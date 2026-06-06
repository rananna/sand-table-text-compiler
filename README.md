# Dune Weaver Text Compiler & Custom Menu Guide

This guide details how to install and use the **Sand Table Text Compiler** within your Dune Weaver 4.0 environment. You can choose to deploy it via a quick **Simplified Standalone** drop-in, or perform a **Full UI Menu Integration** to add it directly to the native React sidebar. 

To protect your files from being wiped out during system updates, your custom source assets should be stored completely outside the tracked repository in a dedicated home folder (`~/my-custom-tools/`).

---

## 📁 Repository & System Architecture

Dune Weaver runs natively on the Raspberry Pi as a Linux `systemd` background service managed by the root execution script wrapper `./dw`.

* **The React Frontend Interface:** Housed inside `~/dune-weaver/frontend/`. It must be compiled using Node/Vite (`npm run build`) whenever UI configurations are altered.
* **The Static Workspace:** Housed inside `~/dune-weaver/static/`. This directory serves production assets to the FastAPI Python backend server. This folder is completely wiped and regenerated during a frontend compilation or a software update.
* **The Safe Asset Vault:** Housed inside `~/my-custom-tools/`. This folder holds your standalone `text.html` page and a complete backup copy of your modified `Layout.tsx` file, isolating them from upstream Git repository cleanups.

```text
~ (Home Directory)
├── my-custom-tools/                  <-- [SAFE VAULT] Persistent Custom Files
│   ├── text.html                     <-- Standalone Canvas Utility (Text Compiler)
│   └── Layout.tsx                    <-- Reference Backup UI File
│
└── dune-weaver/                      <-- [TRACKED REPO] Application Core
    ├── static/                       <-- Assets served by Python Backend
    │   └── text.html (Symlink)       <-- Portal link pointing back to Vault
    └── frontend/src/components/layout/
        └── Layout.tsx                <-- Active UI component
```

---

## 🚀 Section 1: Installation Options

You can install this tool using one of two methods, depending on your comfort level with compiling the frontend.

### Option A: Simplified Standalone Deployment (Quick)
This method is the easiest way to get started and does not require modifying or recompiling the native Dune Weaver interface. 

1. **Transfer the file:** Copy `text.html` directly into the web server's static folder:
   ```bash
   cp text.html ~/dune-weaver/static/
   ```
2. **Access the tool:** Open your web browser and navigate directly to the asset using your table's local IP address:
   `http://<YOUR_PI_IP>:8000/static/text.html`

> **⚠️ Downsides of Option A:** > * **No UI Integration:** You must manually type or bookmark this long URL to access the tool.
> * **Update Wipeout:** The `static` directory is completely erased and rebuilt during official Dune Weaver software updates. You will lose `text.html`. Always keep a safe backup copy in a separate folder like `~/my-custom-tools/`.

### Option B: Full UI Menu Integration (Advanced)
This method adds a permanent "Text Compiler" button to your Dune Weaver sidebar menu. It uses a "Safe Vault" to protect your files from being wiped out during system updates.

#### Step 1.1: Create the Safe Vault and Store Assets
Log into your Raspberry Pi over SSH and create the protected folder outside of the repository path:

```bash
mkdir -p ~/my-custom-tools
```

Place your custom canvas utility file (`text.html`) and the modified layout component file (`Layout.tsx`) into this directory.

*(If you are creating them via terminal, run `nano ~/my-custom-tools/text.html` and `nano ~/my-custom-tools/Layout.tsx`, paste the respective code blocks, then save with `Ctrl+O` and exit with `Ctrl+X`).*

#### Step 1.2: Swap the Layout File into the Core Application Space
Overwrite the default repository layout file with your custom version:

```bash
cp /home/pi/my-custom-tools/Layout.tsx /home/pi/dune-weaver/frontend/src/components/layout/Layout.tsx
```

> **Note:** If your Raspberry Pi user account is not named `pi`, replace `/home/pi/` with your exact home path across all commands in this guide.

#### Step 1.3: Compile the Frontend Framework
Navigate into the frontend code boundary and trigger the production Vite compiler:

```bash
cd ~/dune-weaver/frontend
npm run build
```

Clear out any stale production bundles and sync the compiled static files into the web server workspace:

```bash
rm -rf ../static/*
cp -r dist/* ../static/
```

#### Step 1.4: Inject the Symbolic Link Portal
Create a Linux Symbolic Link (Symlink). This creates an automated virtual shortcut inside the backend folder pointing directly back to your persistent source asset:

```bash
ln -s /home/pi/my-custom-tools/text.html /home/pi/dune-weaver/static/text.html
```

#### Step 1.5: Reboot the System Service
Head back to the root project directory and restart the native systemd service script wrapper to flush the application cache:

```bash
cd ~/dune-weaver
./dw restart
```

---

## 🔄 Section 2: Automated Recovery Guide After a Dune Weaver Update

When you update Dune Weaver via the web interface dashboard or via a terminal `git pull`, the repository synchronization sequence forces a hard overwrite on `Layout.tsx` back to factory settings and completely wipes out the contents of the `static/` directory.

If you chose **Option B (Full UI Menu Integration)**, because your source modifications live safely inside `~/my-custom-tools/`, you can completely restore your customized Text Compiler sidebar integration over SSH in less than 30 seconds by executing the following copy-and-paste command string:

```bash
# 1. Navigate to the core project workspace
cd ~/dune-weaver

# 2. Restore your custom layout code from the safe vault
cp /home/pi/my-custom-tools/Layout.tsx ~/dune-weaver/frontend/src/components/layout/Layout.tsx

# 3. Enter the frontend workspace and recompile the application bundle
cd frontend
npm run build

# 4. Wipe out the newly fetched stock static block and sync the custom bundle
rm -rf ../static/*
cp -r dist/* ../static/

# 5. Recreate the Symlink for text.html
ln -s /home/pi/my-custom-tools/text.html /home/pi/dune-weaver/static/text.html

# 6. Exit back to the root folder and restart the system background service
cd ..
./dw restart
```

*(Note: If you chose **Option A**, simply re-copy your backed-up `text.html` file back into `~/dune-weaver/static/` after an update).*

---

## 📝 Section 3: Reference Documentation for text.html (Dune Weaver Text Compiler)

A unified, browser-based serial interface and text-to-path compiler for kinetic sand tables. This tool translates standard alphanumeric text into continuous, machine-ready Theta-Rho (`.thr`) coordinate paths.

It includes a custom single-stroke proportional font engine and a parametric math pipeline capable of wrapping text around complex geometric profiles like Archimedean spirals, concentric circles, and Cassini peanuts.

### Features
* **Custom Pathing Engine:** Transforms strings into continuous vectors using a custom retraced proportional font, minimizing gantry travel time and eliminating sand drags between characters.
* **Complex Geometric Projections:** Projects flat text along various parametric curves:
	+ Centered Block Stack
	+ Concentric Circular Ring Bend
	+ Continuous Archimedean Spiral Wrap
	+ Rolling Sine Wave Horizontal Ribbon
	+ The Gentle Ellipse
	+ The Soft Petal (5-Ripple)
	+ The Cassini Peanut
	+ The Perimeter Squircle
* **Live Virtual Twin:** Real-time, Retina-ready HTML5 Canvas rendering of the calculated sand path.
* **Pi Telemetry Dashboard:** Tracks vector output nodes, calculated font scale, and rotational matrix loops.
* **Direct Hardware Interfacing:** Streams coordinates directly to a Raspberry Pi serial interface (via UART endpoint) with adjustable millisecond feedrates, or saves the `.thr` file directly to the controller's storage.
* **Standalone Export:** Works completely offline to generate and download `.thr` files for manual transfer.

### Project Structure
The entire application is currently contained within a single `text.html` file, which includes:
1. **`ProportionalRetracedFont`:** A static dictionary containing the vector spline data for all supported alphanumeric characters and symbols.
2. **`DuneWeaverPipeline`:** The core mathematical engine that handles word-wrapping, arc-length parameterization, curve projection, and cartesian-to-polar coordinate transformations.
3. **UI Controller:** Handles local storage state caching, debounced user inputs, and network requests (`fetch`) to the local motor controller backend.

### 🚀 Quick Start & Usage Modes

#### Standalone Mode (No Hardware)
1. **Load a Font:** Drag and drop an `.svg` or `.json` font file directly onto the window, or click **📂 Load Font** in the top right.
2. **Enter Text:** Type your desired message in the **Message Payload** text box.
3. **Select a Projection:** Choose a mathematical shape from the **Geometric Projection** dropdown.
4. **Preview:** The canvas on the right will automatically compile and display your toolpath. 
5. **Export:** Click **💾 Download .THR** to save the file locally.

#### Networked/Raspberry Pi Mode
To use the **Save Direct to Table** button (or Stream Live to Gantry), the `text.html` file must be served from (or proxied to) a backend controller (like a Raspberry Pi running a Python/Node.js web server) that exposes the following endpoints:
* `POST /api/upload_theta_rho`: Accepts a `.thr` file payload and saves it to the table's local directory.
* `GET /api/stream_step?theta={val}&rho={val}`: Accepts discrete coordinates and relays them via UART/Serial to the motor drivers.

### ⚠️ System Warnings & Error States (Red Text)
Dune Weaver actively monitors your toolpath and hardware limits. If the system detects an issue that will physically fail on the table or block a network transfer, the relevant telemetry, status banner, or canvas will turn **red**.
* **Red Canvas Toolpaths:** If the drawn text in the Virtual Twin preview turns red instead of natural sand colors, it means the physical ball diameter is too wide for the current text scale. The ball will physically overlap its own path and erase the cursive loops. *Fix: Type fewer words to allow Auto-Fit to scale the text up, manually increase scale, or specify a smaller Ball Dia.*
* **POOR (Loops Erased):** Located in the Telemetry Dashboard under *Physics Legibility*. This is the text-based UI warning corresponding to the red canvas toolpaths above.
* **⚠️ INT32 ROLLOVER:** Located in the Telemetry Dashboard next to *Path Rotations*. If a single continuous toolpath exceeds 1,000 full rotations, it risks overflowing the 32-bit integer limit on certain GRBL/MKS DLC32 firmware versions, causing the table to freeze or crash. *Fix: Break the text into smaller batches or reduce the total length.*
* **Font Blocked / Compilation Error:** Appears in the main Status Banner. Occurs if the local font fails to fetch, or if a manually uploaded SVG/JSON has broken syntax that the kinematics engine cannot parse. 
* **Upload Errors (Timeout / CORS / Offline):** Appears in the main Status Banner when attempting to push directly to the table. If the controller is turned off, the IP address in the **Controller API** field is incorrect, or your browser blocks the local network request, the banner will flash red with the specific HTTP or Network error.

### 🎛️ User Interface Overview
The interface is divided into two primary sections: the **Control Dashboard** (left) and the **Virtual Twin Preview** (right).

#### The Control Dashboard
This panel houses all variables related to layout, hardware specifications, and toolpath optimization.
* **Pattern Name:** Sets the filename for your exported `.thr` file.
* **Scaling Strategy:** Controls the overall size of the text. **Auto-Fit** dynamically scales the text to fill your table's maximum radius without clipping the edge.

#### ⚙️ Advanced Tuning & Hardware
Expand the Advanced Tuning section to match the software engine with your exact physical hardware.
* **Table Model (mm):** Sets the absolute boundary radius. This acts as a mathematical wall to prevent the mechanism from crashing.
* **Ball Dia. (mm):** The physical width of your steel ball. Used by the physics engine to calculate legibility and visually simulate sand displacement.
* **Controller API:** The local IP endpoint of your table (e.g., `http://192.168.1.100:8000`) for direct network uploads.
* **Word Jump Droop:** When the ball lifts to jump between individual words, this controls the downward gravity/sag of the connecting line. Keep it high for elegant cursive aesthetics.
* **Perimeter Margin:** Keeps the text away from the absolute edge of the glass (padding).
* **Character & Line Spacing:** Adjusts kerning (horizontal) and leading (vertical) space.
* **Wipe Quality:** Controls the density of the center-out flattening spiral if **Prepend Spiral Wipe** is activated.
* **Context Ligatures:** Automatically swaps specific letter pairings for pre-drawn continuous transitions to avoid awkward overlaps.
* **Smooth Corners:** Applies Chaikin smoothing to sharp angles in the vector path, ensuring smoother motor velocity.

### 📡 Telemetry Dashboard & Simulation
Before executing a print, monitor the **Telemetry Dashboard** to ensure your mechanism can handle the toolpath.
* **Vector Nodes:** The total number of coordinate pairs in the generated `.thr` file.
* **Path Rotations:** The total number of physical rotations the theta motor must complete. 
* **Estimated Time:** Calculated based on your specified **Est. Feedrate (ms/pt)**.
* **Physics Legibility:** A check to ensure your steel ball isn't too large for the tightest details in the generated path.

#### The Virtual Twin
The canvas provides a 1:1 simulation of the physical table.
* **Pan & Zoom:** Click and drag to pan around the table. Use your mouse wheel to zoom. Double-click to reset the view.
* **Simulation Player:** Click **▶ Play** to animate the exact routing path the steel ball will take. You can scrub through time using the slider.
* **Loupe Tool:** Click **🔎 Loupe** to toggle a magnifying glass over your cursor to inspect vector intersections and ball-width overlap in high detail.
* **Record:** Click **📼 REC** to capture the simulation as a WebM video file.

### 🛠️ Font Manager & Inspector
Click **🛠️ Font Manager** in the top header to inspect the active font currently loaded in memory.
* **Available Glyphs:** Displays every character successfully parsed from your SVG or JSON file.
* **Kerning Pair Inspector:** Type any two characters (e.g., `o` and `r`) to visually test how the engine mathematically overlaps them.

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Enter` | Upload directly to the Controller API. |
| `Ctrl + S` | Download the `.thr` file locally. |
| `Spacebar` | Play/Pause the canvas simulation (when not typing in a text field). |

### 🛣️ Roadmap & Future Enhancements
* Implementation of the native browser Web Serial

---

## 📄 Appendix: `Layout.tsx` Reference Backup

```tsx
import { useEffect, useMemo, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { useTable } from '@/hooks/use-table'
import { useStatusStore } from '@/store/status'
import { NowPlayingBar } from '@/components/layout/now-playing-bar'

// 1. MENU REGISTRATION FOR CUSTOM APP COMPONENT
const navItems = [
  { path: '/', label: 'Library', icon: 'library_music', title: 'Pattern Library' },
  { path: '/table-control', label: 'Control', icon: 'gamepad', title: 'Manual Control' },
  { path: '/led', label: 'LED', icon: 'lightbulb', title: 'LED Control' },
  // CUSTOM TEXT COMPILER ACTION LINK
  { 
    path: '/static/text.html', 
    label: 'Text Compiler', 
    icon: 'text_fields', 
    title: 'Sand Table Text Compiler',
    isExternal: true 
  },
  { path: '/settings', label: 'Settings', icon: 'settings', title: 'Settings' },
]

const DEFAULT_APP_NAME = 'Dune Weaver'

// Detect captive portal context (DNS-redirected domains used by OS probe requests)
const CAPTIVE_PORTAL_HOSTS = [
  'captive.apple.com',
  'connectivitycheck.gstatic.com',
  'connectivitycheck.android.com',
  'clients3.google.com',
  'nmcheck.gnome.org',
  'network-test.debian.org',
  'msftconnecttest.com',
  '[www.msftconnecttest.com](https://www.msftconnecttest.com)',
]
const isCaptivePortal = CAPTIVE_PORTAL_HOSTS.some(h => window.location.hostname === h || window.location.hostname.endsWith('.' + h))

export function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Captive portal: redirect to captive landing page (unless user dismissed it or is on wifi-setup)
  useEffect(() => {
    if (
      isCaptivePortal &&
      location.pathname !== '/wifi-setup' &&
      location.pathname !== '/captive' &&
      !sessionStorage.getItem('captive-dismissed')
    ) {
      navigate('/captive', { replace: true })
    }
  }, [location.pathname, navigate])

  const { activeTable, tables } = useTable()
  const hasMultipleTables = tables.length > 1

  const [isDark, setIsDark] = useState(() => {
    if (isCaptivePortal) return false
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const [appName, setAppName] = useState(DEFAULT_APP_NAME)
  const [customLogo, setCustomLogo] = useState<string | null>(null)

  const activeTableData = tables.find(t => t.id === activeTable?.id)
  const tableName = activeTableData?.name || activeTable?.name
  const displayName = hasMultipleTables && tableName ? tableName : appName

  // Connection & status bindings from global store
  const isBackendConnected = useStatusStore((s) => s.isBackendConnected)
  const securityMode = useStatusStore((s) => s.status?.security_mode ?? 'off')
  const isPlayOnlyActive = securityMode === 'play_only'

  // Filter nav items based on security mode options
  const playOnlyHiddenPaths = ['/settings', '/table-control']
  const visibleNavItems = useMemo(() => {
    if (isPlayOnlyActive) {
      return navItems.filter((item) => !playOnlyHiddenPaths.includes(item.path))
    }
    return navItems
  }, [isPlayOnlyActive])

  // Update document title based on active view pathing
  useEffect(() => {
    const currentNav = navItems.find((item) => item.path === location.pathname)
    if (currentNav) {
      document.title = `${currentNav.title} | ${displayName}`
    } else {
      document.title = displayName
    }
  }, [location.pathname, displayName])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      {/* Side Control Panel Frame */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <span className="material-symbols-outlined text-primary text-2xl">waves</span>
            <span className="font-bold text-lg">{displayName}</span>
          </div>
          <Separator />
          <nav className="flex flex-col gap-1">
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.path

              // 2. RENDERING LOGIC INTERCEPTION FOR EXTERNAL .html ASSETS
              if (item.isExternal) {
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    <span className="material-symbols-outlined text-xs ml-auto opacity-40">open_in_new</span>
                  </a>
                )
              }

              // Default React Router link execution
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
 isActive
 ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
 : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50'
 }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Sandbox Canvas Viewport */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
        <NowPlayingBar />
      </main>
    </div>
  )
}
```
