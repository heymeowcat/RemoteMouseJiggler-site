#!/usr/bin/env python3
"""
Generate the site's brand assets from the Android app source.

Sources
  - App icon PNG : src/assets/logo.png (the shipped launcher art)
  - Duck vector  : the app's ic_launcher_foreground.xml VectorDrawable

Outputs (public/)
  favicon.svg          brand favicon (blue tile + yellow duck)
  favicon-32.png       small raster favicon
  apple-touch-icon.png 180x180 home screen icon
  icon-192.png / icon-512.png   PWA icons
  og-image.png         1200x630 social share image
  press/logo-512.png   press kit download
"""

from pathlib import Path
import os
import re
import xml.etree.ElementTree as ET

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
PRESS = PUBLIC / "press"
LOGO = ROOT / "src" / "assets" / "logo.png"
# The app repository lives outside this site checkout. Override with
# RMJ_APP_DIR if it moves.
APP_DIR = Path(
    os.environ.get(
        "RMJ_APP_DIR",
        ROOT.parent.parent / "AndroidStudioProjects" / "RemoteMouseJiggler",
    )
)
VECTOR = (
    APP_DIR / "app" / "src" / "main" / "res" / "drawable" / "ic_launcher_foreground.xml"
)

BRAND_BLUE = (63, 25, 188)
BRAND_YELLOW = (255, 183, 1)
BRAND_YELLOW_LIGHT = (255, 199, 40)

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"


def duck_path_data() -> str:
    """Pull the single path's data out of the VectorDrawable."""
    text = VECTOR.read_text()
    match = re.search(r'android:pathData="([^"]+)"', text)
    if not match:
        raise SystemExit("Could not find pathData in the vector drawable")
    return match.group(1)


def write_favicon_svg() -> None:
    path = duck_path_data()
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 454 453" role="img" aria-label="Remote Mouse Jiggler">
  <title>Remote Mouse Jiggler</title>
  <defs>
    <linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="{BRAND_YELLOW[0]:02X}{BRAND_YELLOW[1]:02X}{BRAND_YELLOW[2]:02X}"/>
      <stop offset="1" stop-color="{BRAND_YELLOW_LIGHT[0]:02X}{BRAND_YELLOW_LIGHT[1]:02X}{BRAND_YELLOW_LIGHT[2]:02X}"/>
    </linearGradient>
  </defs>
  <rect width="454" height="453" rx="100" fill="#{BRAND_BLUE[0]:02X}{BRAND_BLUE[1]:02X}{BRAND_BLUE[2]:02X}"/>
  <g transform="translate(-4,-4)">
    <path d="{path}" fill="url(#g)" fill-rule="evenodd"/>
  </g>
</svg>
"""
    (PUBLIC / "favicon.svg").write_text(svg)


def write_raster_icons() -> None:
    source = Image.open(LOGO).convert("RGB")

    def resized(size: int) -> Image.Image:
        return source.resize((size, size), Image.LANCZOS)

    resized(32).save(PUBLIC / "favicon-32.png", optimize=True)
    resized(180).save(PUBLIC / "apple-touch-icon.png", optimize=True)
    resized(192).save(PUBLIC / "icon-192.png", optimize=True)
    resized(512).save(PUBLIC / "icon-512.png", optimize=True)

    PRESS.mkdir(parents=True, exist_ok=True)
    resized(512).save(PRESS / "logo-512.png", optimize=True)


def write_og_image() -> None:
    width, height = 1200, 630
    canvas = Image.new("RGB", (width, height), BRAND_BLUE)

    # Soft radial brand glow behind the icon so the tile does not sit flat.
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    cx, cy = 250, 315
    steps = 90
    for i in range(steps, 0, -1):
        radius = i * 2.6
        alpha = int(52 * (1 - i / steps) ** 2)
        glow_draw.ellipse(
            (cx - radius, cy - radius, cx + radius, cy + radius),
            fill=BRAND_YELLOW + (alpha,),
        )
    canvas = Image.alpha_composite(canvas.convert("RGBA"), glow).convert("RGB")

    # The icon tile background is exactly the canvas blue, so the tile pastes
    # in seamlessly with no masking and the artwork is never clipped.
    tile_size = 330
    duck = Image.open(LOGO).convert("RGB").resize((tile_size, tile_size), Image.LANCZOS)
    tile_x, tile_y = 85, 150
    canvas.paste(duck, (tile_x, tile_y))

    draw = ImageDraw.Draw(canvas)

    # Accent rule
    draw.rounded_rectangle((492, 186, 556, 194), radius=4, fill=BRAND_YELLOW_LIGHT)

    title_font = ImageFont.truetype(FONT_BOLD, 64)
    body_font = ImageFont.truetype(FONT_REGULAR, 34)
    meta_font = ImageFont.truetype(FONT_BOLD, 25)

    text_x = 492
    draw.text((text_x, 214), "Remote", font=title_font, fill=(255, 255, 255))
    draw.text((text_x, 286), "Mouse Jiggler", font=title_font, fill=BRAND_YELLOW_LIGHT)

    draw.text((text_x, 386), "Bluetooth mouse, keyboard", font=body_font, fill=(233, 226, 255))
    draw.text((text_x, 428), "& mouse jiggler for Android", font=body_font, fill=(233, 226, 255))

    draw.text((text_x, 508), "FREE  ·  NO ADS  ·  NO ACCOUNT", font=meta_font, fill=(180, 166, 240))

    canvas.save(PUBLIC / "og-image.png", optimize=True)


if __name__ == "__main__":
    write_favicon_svg()
    write_raster_icons()
    write_og_image()
    print("Brand assets written to public/")
