/**
 * Product content, written against the real Android app source.
 *
 * Every claim below is verifiable in the app repository at
 * `heymeowcat/RemoteMouseJiggler`:
 *   - domain/entities/jiggler/JigglerModels.kt   (patterns, config, engine)
 *   - data/bluetooth/BluetoothHidCore.kt          (HID report descriptor, coding emulator)
 *   - ui/views/mouse/MousePad.kt                  (touchpad gestures)
 *   - ui/screens/SettingsScreen.kt                (reachable settings)
 *   - AndroidManifest.xml                         (permissions)
 */

/* ------------------------------------------------------------------ *
 * Jiggler patterns — JigglePattern enum, JigglerModels.kt
 * ------------------------------------------------------------------ */

export const PATTERNS = [
    {
        id: "jitter",
        name: "Micro Jitter",
        tag: "Screen saver",
        short: "Alternating horizontal nudges of a single pixel or two.",
        desc: "The pointer shifts a fraction of a pixel left, then right, then left again. It is the least noticeable movement in the app and the one most screen savers fail to detect.",
        detail:
            "Each tick flips the horizontal direction and moves by the configured radius. Set the movement distance to its lowest value and the cursor looks completely still while the host still registers real input events.",
        best: "Office desktops with aggressive screen savers where you do not want the pointer moving.",
    },
    {
        id: "circle",
        name: "Smooth Circle",
        tag: "Natural motion",
        short: "A continuous loop around a fixed focal point.",
        desc: "The cursor travels around an invisible circle, rotating smoothly in one direction without ever changing speed.",
        detail:
            "The engine advances the angle by 0.3 radians per tick and derives both axes from that angle, so the path stays a true circle at every radius from 2 to 50 pixels.",
        best: "Long unattended sessions where a constant, predictable motion looks least synthetic.",
    },
    {
        id: "figure-eight",
        name: "Figure Eight",
        tag: "Natural motion",
        short: "An infinity loop across both axes.",
        desc: "The pointer traces a horizontal figure eight, the motion people naturally make when they fidget with a mouse.",
        detail:
            "Horizontal position follows the sine of the angle while vertical position follows the sine of twice that angle, which produces the crossing point in the middle of the loop.",
        best: "Sessions where you want movement that reads as human rather than robotic.",
    },
    {
        id: "random",
        name: "Random Wander",
        tag: "Natural motion",
        short: "Unpredictable movement in every direction.",
        desc: "The cursor roams inside the configured radius with no repeating pattern at all.",
        detail:
            "Every tick picks an independent random offset on both axes within the movement radius, so the path never repeats and never traces a recognisable shape.",
        best: "Anti-idle checks that analyse for repeating motion patterns.",
    },
    {
        id: "wave",
        name: "Sine Wave",
        tag: "Natural motion",
        short: "Side-to-side movement with a vertical ripple.",
        desc: "The cursor sweeps left and right while rising and falling along a sine curve.",
        detail:
            "The horizontal axis alternates between the two extremes of the radius while the vertical axis follows half the radius scaled by the sine of the angle.",
        best: "Keeping a session alive on machines whose screensaver ignores purely horizontal motion.",
    },
    {
        id: "spiral",
        name: "Expanding Spiral",
        tag: "Structured",
        short: "A spiral that grows outward, then resets.",
        desc: "The pointer spirals outwards from the centre, growing with every step until it reaches the movement radius and starts again.",
        detail:
            "The spiral radius increases by half a pixel per tick and resets to one pixel once it passes the configured distance, so the loop keeps repeating at every radius setting.",
        best: "Showing that the jiggler is genuinely animating rather than nudging.",
    },
    {
        id: "diagonal",
        name: "Diagonal Bounce",
        tag: "Structured",
        short: "Corner-to-corner movement on the diagonal.",
        desc: "The cursor travels diagonally between opposite corners of the movement area, reversing direction each tick.",
        detail:
            "Both axes move by the same signed radius, so the pointer stays on a 45 degree line and bounces between the two opposing corners.",
        best: "Hosts that only register diagonal or high-velocity input as genuine activity.",
    },
    {
        id: "coding",
        name: "Coding Emulator",
        tag: "Signature",
        short: "Types realistic code, with human typos and corrections.",
        desc: "Instead of moving the pointer, the app types short lines of real code into whatever window is focused, pausing to correct itself when it mistypes a character.",
        detail:
            "The app picks a line from a pool of seventeen realistic Kotlin, Java and SQL snippets, types it in chunks of one to five characters with a 60 millisecond base delay plus jitter, and presses Enter at the end. Roughly one character in five is wrong on purpose: it types the mistake, pauses for 300 to 1200 milliseconds as if noticing it, then backspaces over it and retypes it correctly. Between lines it either reads for a few seconds or, one time in five, pauses for six to fourteen seconds as if reviewing a diff.",
        best: "Keeping an IDE, terminal or code review session looking genuinely attended.",
    },
];

/* ------------------------------------------------------------------ *
 * Jiggler controls
 * ------------------------------------------------------------------ */

export const JIGGLER_CONTROLS = [
    {
        name: "Interval speed",
        value: "0.2 s to 5.0 s",
        detail:
            "How long the app waits between movement steps. The default is one second. Finer intervals produce denser motion for hosts that need a high event rate.",
    },
    {
        name: "Movement distance",
        value: "2 px to 50 px",
        detail:
            "How far the pointer travels on each axis per step. This is the single most important control: a couple of pixels is invisible, while 50 pixels is obvious to anyone watching the screen.",
    },
    {
        name: "Duration",
        value: "Infinite or 1 to 240 minutes",
        detail:
            "Run until you stop it, or set a timer and the jiggler stops itself. Timed runs keep going while the app is in the background.",
    },
    {
        name: "Live stats",
        value: "Moves and active time",
        detail:
            "The jiggler screen counts every movement step and every second spent running, and can reset both on demand.",
    },
];

/* ------------------------------------------------------------------ *
 * Where the jiggler can be started
 * ------------------------------------------------------------------ */

export const JIGGLER_ENTRY_POINTS = [
    {
        name: "Jiggler screen",
        detail:
            "A dedicated screen with a large start and stop control, live statistics and every pattern and timing option in one place.",
    },
    {
        name: "Remote screen",
        detail:
            "A mouse jiggler card sits above the touchpad, showing the remaining time when a timed run is active.",
    },
    {
        name: "Quick Settings tile",
        detail:
            "A tile shows the name of the connected device and toggles the jiggler straight from the notification shade. If nothing is connected it opens the app instead.",
    },
    {
        name: "Home screen widget",
        detail:
            "The widget carries mouse buttons and a start and stop button for the jiggler, so you can keep a session alive without opening the app.",
    },
];

/* ------------------------------------------------------------------ *
 * Mouse and touchpad — ui/views/mouse/MousePad.kt
 * ------------------------------------------------------------------ */

export const MOUSE_GESTURES = [
    {
        gesture: "One finger drag",
        action: "Move the cursor",
        detail:
            "Relative movement is scaled by the pointer speed setting before it is sent to the host.",
    },
    {
        gesture: "One finger tap",
        action: "Left click",
        detail:
            "A tap is only counted as a click when it lasts under 200 milliseconds and the finger drifts less than 5 pixels, so scrolling never fires a stray click.",
    },
    {
        gesture: "Two finger tap",
        action: "Right click",
        detail: "Useful for opening context menus on a remote desktop.",
    },
    {
        gesture: "Three finger tap",
        action: "Middle click",
        detail: "Opens tabs in a browser or pastes in most editors.",
    },
    {
        gesture: "Two finger drag",
        action: "Scroll",
        detail:
            "Vertical two finger movement is converted into wheel events, one step for every 20 pixels of travel, scaled by the scroll speed setting. Scrolling can be inverted.",
    },
    {
        gesture: "L, M and R buttons",
        action: "Hold to click",
        detail:
            "Three dedicated buttons mirror the left, middle and right mouse buttons and respond while held.",
    },
];

export const MOUSE_FEATURES = [
    {
        title: "Gyroscope air mouse",
        body: "Switch on the gyroscope and the phone becomes a pointer you move through the air. The axes are remapped for the current screen rotation, so the cursor follows the phone the way you expect regardless of how you hold it.",
        note: "Off by default. Sensitivity follows the pointer speed setting. The sensor is registered and unregistered with the screen lifecycle, so it never runs in the background.",
    },
    {
        title: "Pointer and scroll speed",
        body: "Pointer speed and scroll speed are tuned independently on a scale from 0.25x to 5x, with an optional invert switch for the scroll direction.",
        note: null,
    },
    {
        title: "Relative, not absolute",
        body: "The app sends relative mouse movement, the same model a physical mouse uses. The cursor moves the same way whether the phone screen is 6 inches or 6 feet away from the monitor.",
        note: null,
    },
];

/* ------------------------------------------------------------------ *
 * Keyboard — ui/views/keyboard/VirtualKeyboard.kt
 * ------------------------------------------------------------------ */

export const KEYBOARD_FEATURES = [
    {
        title: "Type anything",
        body: "Compose text in the keyboard sheet and send it to the host in one go, with or without a trailing Enter. A quick action row adds Backspace, Enter, Space, Tab, Escape and the four arrow keys for one tap each.",
    },
    {
        title: "Typing speed control",
        body: "Set the delay between key presses from 1 to 60 milliseconds. The setting shows the resulting characters per second so you can pick a speed that suits the host.",
    },
    {
        title: "Keep copied indentation",
        body: "Enable this and the app detects when the host editor has auto-indented your pasted line, then backspaces over the surplus so the code lands exactly as you copied it.",
    },
    {
        title: "Nothing gets stuck",
        body: "Every key press is followed by a release report in a finally block, and all keys are released when the connection drops or the jiggler stops. A cancelled keystroke can never leave a key auto-repeating on the host.",
    },
];

/* ------------------------------------------------------------------ *
 * Bluetooth and pairing
 * ------------------------------------------------------------------ */

export const BLUETOOTH_FACTS = [
    {
        title: "A real HID device, not a driver",
        body: "Your phone registers with the host as a standard Bluetooth Human Interface Device using a combo keyboard and mouse descriptor. Windows, macOS, Linux and ChromeOS treat it exactly like a wireless mouse and keyboard.",
    },
    {
        title: "Keyboard-first descriptor",
        body: "The report descriptor declares the keyboard interface before the mouse interface. That ordering is deliberate: hosts that parse the primary interface first would otherwise misidentify the device as a joystick and silently discard every movement packet.",
    },
    {
        title: "Eight byte keyboard, four byte mouse",
        body: "Keyboard reports carry eight modifier bits, a reserved byte and up to six simultaneous key codes. Mouse reports carry three button bits plus separate relative X, Y and wheel axes, each clamped to the range a HID mouse can express.",
    },
    {
        title: "Nothing leaves the device",
        body: "The app never requests the Android internet permission. It is technically incapable of contacting a server, so every keystroke and every pointer movement stays on the Bluetooth link between your phone and the machine in front of you.",
    },
];

export const PAIRING_STEPS = [
    {
        title: "Turn on Bluetooth",
        body: "Enable Bluetooth on your phone and on the machine you want to control. The target can be a Windows, macOS or Linux computer, an Android phone, an Android TV or any other Bluetooth host.",
    },
    {
        title: "Pick your device",
        body: "Open the app and scan. Remote Mouse Jiggler searches for classic Bluetooth and BLE devices at the same time and shows real device names, with computers, phones, TVs and audio hardware labelled by their Bluetooth class.",
    },
    {
        title: "Pair from the remote side",
        body: "A plain Android Bluetooth pairing does not bind the HID profile, so the app walks you through pairing from the device you are controlling: make it visible, pair, disconnect it manually, then let the app finish the connection.",
    },
    {
        title: "Name it and go",
        body: "Rename the device so it appears in your host's Bluetooth list as something recognisable. The name applies immediately, without restarting the connection.",
    },
];

/* ------------------------------------------------------------------ *
 * Reliability
 * ------------------------------------------------------------------ */

export const RELIABILITY_FEATURES = [
    {
        title: "Hourly self-healing cycle",
        body: "Every 60 minutes the app releases all keys, drops the HID link for five seconds and reconnects. Long sessions cannot wedge on a stale link, and nothing flashes on screen while it happens.",
    },
    {
        title: "Foreground service",
        body: "A low-priority foreground service keeps the connection alive while you switch apps, with an ongoing notification that shows which device is connected.",
    },
    {
        title: "Reconnect after a reboot",
        body: "If you have chosen an auto-connect device, the app starts the service after a restart and re-establishes the link on its own.",
    },
    {
        title: "Duplicate connection guard",
        body: "Connecting to a device that is already connected is skipped, which stops the operating system showing a spurious cannot connect error.",
    },
];

/* ------------------------------------------------------------------ *
 * Appearance
 * ------------------------------------------------------------------ */

export const APPEARANCE_FEATURES = [
    {
        title: "Light and dark",
        body: "Follow the system theme or pin the app to light or dark. A separate true black option strips the greys from the dark theme, which saves power on OLED panels.",
    },
    {
        title: "Dynamic colour",
        body: "On Android 12 and newer the app can tint itself with the colours from your wallpaper.",
    },
    {
        title: "Full screen",
        body: "Hide the status and navigation bars for an unobstructed remote control surface.",
    },
];

/* ------------------------------------------------------------------ *
 * FAQ
 * ------------------------------------------------------------------ */

export const FAQ = [
    {
        q: "Do I have to install anything on my computer?",
        a: "No. Remote Mouse Jiggler speaks the standard Bluetooth Human Interface Device profile, which operating systems already support. Your computer sees a wireless mouse and keyboard and nothing else. There is no driver, no background agent and no software to install.",
    },
    {
        q: "What operating systems and hosts does it work with?",
        a: "Any host with Bluetooth HID support: Windows, macOS, Linux, ChromeOS, Android phones and Android TV. The app searches for both classic Bluetooth and BLE devices and labels what it finds by Bluetooth class, so computers, TVs, phones and audio hardware are all easy to pick out.",
    },
    {
        q: "What exactly does the mouse jiggler do?",
        a: "It sends real relative mouse movement over the Bluetooth link so the host sees genuine input events. Eight movement patterns are available, from a one pixel micro jitter to an expanding spiral, plus a coding emulator that types realistic lines of code with human typos and corrections.",
    },
    {
        q: "Will the coding emulator type into my other windows?",
        a: "Yes, and that is the point. It sends keystrokes exactly like a physical keyboard, so it types into whatever window currently has focus. Close anything you do not want typed into before you start a coding run.",
    },
    {
        q: "Does the app collect any data?",
        a: "None. The app never requests the Android internet permission, so it cannot reach a server even if it wanted to. There are no accounts, no analytics, no crash reporting and no advertising SDKs. Keystrokes and pointer positions exist only in memory while a session is running.",
    },
    {
        q: "Can my employer detect that I am using this?",
        a: "To the host machine the input arrives over standard Bluetooth hardware signals, identical to a physical wireless mouse. There is no agent, service or driver running on the computer to detect. What you do with your own device is between you and your employer.",
    },
    {
        q: "What is the difference between Micro Jitter and the other patterns?",
        a: "Micro Jitter alternates a tiny horizontal nudge in each direction, which is the least visible movement in the app. The other patterns vary the shape of the path: a circle, a figure eight, random wander, a sine wave, an expanding spiral, a diagonal bounce, and the coding emulator.",
    },
    {
        q: "Can I control the scroll speed and pointer speed separately?",
        a: "Yes. Pointer speed and scroll speed are independent sliders from 0.25x to 5x, and scroll direction can be inverted if your host scrolls the opposite way to what you expect.",
    },
    {
        q: "What is the gyroscope air mouse and how do I calibrate it?",
        a: "The air mouse uses the phone's gyroscope to move the cursor when you move the phone. The axes are remapped for your current screen rotation. There is no separate calibration step: the sensor stream is zeroed each time you leave the screen, so the cursor never jumps when you switch back.",
    },
    {
        q: "Does it work as a TV remote?",
        a: "It is a mouse, keyboard and jiggler rather than a dedicated TV remote. Hosts that accept a Bluetooth mouse or keyboard, including Android TV, will accept it. There is no dedicated volume, playback or channel button set in the current release.",
    },
    {
        q: "Why does pairing need several steps?",
        a: "A normal Android Bluetooth pairing only creates a bonded connection. Binding the HID profile on top of that pairing has to be done from the device you are controlling, so the app includes a step by step guide for the remote side of the pairing.",
    },
    {
        q: "How long can it run?",
        a: "Indefinitely in infinite mode, or for a set number of minutes up to 240 in timed mode. The jiggler keeps running in the background, and every hour the app briefly refreshes the Bluetooth link so a long session cannot get stuck.",
    },
    {
        q: "Will a key ever get stuck down?",
        a: "No. Every key press is followed by a key release, and all keys are released when the connection drops or a run stops, so a key can never be left auto-repeating on your computer.",
    },
    {
        q: "Which Android versions are supported?",
        a: "Android 9.0 and newer. The app targets Android 16 and uses the modern Bluetooth permission model, with the legacy Bluetooth permissions requested only on devices that still need them.",
    },
];

/* ------------------------------------------------------------------ *
 * Changelog — derived from the app repository history
 * ------------------------------------------------------------------ */

export const CHANGELOG = [
    {
        version: "1.0.4",
        date: "2026-10-21",
        summary: "Long session reliability and a cleaner device list.",
        changes: [
            {
                type: "Added",
                text: "Pairing guide from the remote device, so you can bind the HID profile on the machine you are controlling.",
            },
            {
                type: "Fixed",
                text: "Unnamed BLE devices no longer appear as phantom rows in the scan list.",
            },
            {
                type: "Fixed",
                text: "Device names refresh in the background so real names show up instead of a generic fallback.",
            },
            {
                type: "Fixed",
                text: "Already connected devices stay in the list, so you can see what is currently linked.",
            },
        ],
    },
    {
        version: "1.0.3",
        date: "2026-10-16",
        summary: "Input reliability fixes and OLED theming.",
        changes: [
            {
                type: "Fixed",
                text: "Stuck keys are now impossible: every press is followed by a release, and all keys are released on disconnect.",
            },
            {
                type: "Fixed",
                text: "Lifecycle bugs that kept the sensor or the service alive after the screen was closed.",
            },
            {
                type: "Fixed",
                text: "Connecting to a device that is already connected no longer triggers a system error.",
            },
            {
                type: "Fixed",
                text: "True black dark theme now renders correctly on OLED displays.",
            },
        ],
    },
    {
        version: "1.0.2",
        date: "2026-10-15",
        summary: "Keyboard tuning and jiggler improvements.",
        changes: [
            {
                type: "Added",
                text: "Adjustable typing speed from 1 to 60 milliseconds per key, with a live characters per second readout.",
            },
            {
                type: "Added",
                text: "Keep copied indentation backspaces over a host editor's auto-indent so pasted code lines up exactly.",
            },
            {
                type: "Improved",
                text: "Jiggler patterns and timing controls were retuned for smoother motion.",
            },
        ],
    },
    {
        version: "1.0.1",
        date: "2026-09-25",
        summary: "Trackpad movement and keyboard latency.",
        changes: [
            {
                type: "Fixed",
                text: "Trackpad cursor movement now reaches the host correctly.",
            },
            {
                type: "Improved",
                text: "Keyboard dispatch was made sequential so key presses and pasted text never interleave.",
            },
        ],
    },
    {
        version: "1.0.0",
        date: "2026-08-24",
        summary: "First public release.",
        changes: [
            {
                type: "Added",
                text: "Bluetooth HID mouse, keyboard and jiggler for Android.",
            },
            {
                type: "Added",
                text: "Eight mouse jiggler patterns with interval, distance and duration controls.",
            },
            {
                type: "Added",
                text: "Home screen widget and Quick Settings tile.",
            },
        ],
    },
];
