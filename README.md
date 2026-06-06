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

> **⚠️ Downsides of Option A:** > * **No UI Integration:** You must manually type or bookmark the long URL to access the tool.
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

## 📝 Section 3: Reference Documentation for text.html

A unified, browser-based serial interface and text-to-path compiler for kinetic sand tables. This tool translates standard alphanumeric text into continuous, machine-ready Theta-Rho (`.thr`) coordinate paths.

### Features
* **Custom Pathing Engine:** Transforms strings into continuous vectors using a custom retraced proportional font, minimizing gantry travel time and eliminating sand drags between characters.
* **Complex Geometric Projections:** Projects flat text along various parametric curves:
	+ Centered Block Stack, Concentric Circular Ring Bend, Archimedean Spiral Wrap, Rolling Sine Wave, Ellipse, Soft Petal (5-Ripple), Cassini Peanut, and Perimeter Squircle.
* **Live Virtual Twin:** Real-time, Retina-ready HTML5 Canvas rendering of the calculated sand path.
* **Pi Telemetry Dashboard:** Tracks vector output nodes, calculated font scale, and rotational matrix loops.
* **Direct Hardware Interfacing:** Streams coordinates directly to a Raspberry Pi serial interface (via UART endpoint).
* **Standalone Export:** Works completely offline to generate and download `.thr` files for manual transfer.

### ⚠️ System Warnings & Error States (Red Text)
Dune Weaver actively monitors your toolpath and hardware limits. If the system detects an issue that will physically fail on the table, the relevant UI element will turn **red**.

* **Red Canvas Toolpaths:** If the drawn text in the Virtual Twin preview turns red instead of natural sand colors, it means the physical ball diameter is too wide for the current text scale. The ball will physically overlap its own path and erase the cursive loops. *Fix: Type fewer words to allow Auto-Fit to scale the text up, manually increase scale, or specify a smaller Ball Dia.*
* **POOR (Loops Erased):** Located in the Telemetry Dashboard under *Physics Legibility*. This is the text-based UI warning corresponding to the red canvas toolpaths above.
* **⚠️ INT32 ROLLOVER:** Located in the Telemetry Dashboard next to *Path Rotations*. If a single continuous toolpath exceeds 1,000 full rotations, it risks overflowing the 32-bit integer limit, causing the table to freeze or crash. *Fix: Break the text into smaller batches or reduce the total length.*
* **Font Blocked / Compilation Error:** Appears in the main Status Banner if the local font fails to fetch, or if a manually uploaded SVG/JSON has broken syntax. 
* **Upload Errors:** Appears in the main Status Banner if the controller is off or the API URL is incorrect.

### Quick Start & Usage
1. **Load a Font:** Drag and drop an `.svg` or `.json` font file directly onto the window.
2. **Enter Text:** Type your message in the **Message Payload** text box.
3. **Select a Projection:** Choose a mathematical shape from the **Geometric Projection** dropdown.
4. **Preview:** The canvas on the right will automatically compile and display your toolpath. 
5. **Export:** Click **💾 Download .THR** to save the file locally.

### User Interface Overview
* **Control Dashboard:** Houses all layout, hardware specifications, and toolpath optimization parameters.
* **Advanced Tuning:** Adjust **Word Jump Droop** (for elegant cursive jumps), **Perimeter Margin**, and **Context Ligatures** for specialized character transitions.
* **Telemetry Dashboard:** Monitor Vector Nodes, Path Rotations, and Physics Legibility.
* **Virtual Twin:** A 1:1 simulation of the physical table. Pan, zoom, and scrub through simulation time.
* **Loupe Tool:** Inspect vector intersections and ball-width overlap in high detail.
* **Keyboard Shortcuts:** `Ctrl + Enter` (Upload), `Ctrl + S` (Download), `Spacebar` (Play/Pause Sim).

### Project Structure & Roadmap
* **Structure:** The tool is a single-file application containing the `ProportionalRetracedFont` data, the `DuneWeaverPipeline` math engine, and the UI Controller logic.
* **Roadmap:** Future plans include the implementation of native browser Web Serial for direct controller communication.

---

## 📄 Appendix: Layout.tsx Reference Backup

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
          <Separator/>
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
          <Outlet/>
        </div>
        <NowPlayingBar/>
      </main>
    </div>
  )
}
```
