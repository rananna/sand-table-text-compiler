# Dune Weaver Custom Menu Modification & Restore Guide

This guide details how to add a custom standalone HTML utility (such as the **Sand Table Text Compiler**) directly into the native Dune Weaver 4.0 React user interface as a sidebar menu item. It also contains instructions for safely backing up your modifications so they can be instantly restored following an official software or firmware update.

To protect your files from being wiped out during system updates, your custom source assets are stored completely outside the tracked repository in a dedicated home folder (`~/my-custom-tools/`).

---

## 📁 Repository & System Architecture

Dune Weaver runs natively on the Raspberry Pi as a Linux `systemd` background service managed by the root execution script wrapper `./dw`. 

* **The React Frontend Interface:** Housed inside `~/dune-weaver/frontend/`. It must be compiled using Node/Vite (`npm run build`) whenever UI configurations are altered.
* **The Static Workspace:** Housed inside `~/dune-weaver/static/`. This directory serves production assets to the FastAPI Python backend server. This folder is completely wiped and regenerated during a frontend compilation or a software update.
* **The Safe Asset Vault:** Housed inside `~/my-custom-tools/`. This folder holds your standalone `text.html` page and a complete backup copy of your modified `Layout.tsx` file, isolating them from upstream Git repository cleanups.

```
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

## 🚀 Section 1: Initial First-Time Setup Instructions

Follow these steps if you are setting up this custom menu modification for the first time on an existing Dune Weaver environment over SSH.

### Step 1.1: Create the Safe Vault and Store Assets
Log into your Raspberry Pi over SSH and create the protected folder outside of the repository path:
```bash
mkdir -p ~/my-custom-tools
```
Place your custom canvas utility file (`text.html`) and the modified layout component file (`Layout.tsx`) into this directory. 

*(If you are creating them via terminal, run `nano ~/my-custom-tools/text.html` and `nano ~/my-custom-tools/Layout.tsx`, paste the respective code blocks, then save with `Ctrl+O` and exit with `Ctrl+X`).*

### Step 1.2: Swap the Layout File into the Core Application Space
Overwrite the default repository layout file with your custom version:
```bash
cp /home/pi/my-custom-tools/Layout.tsx /home/pi/dune-weaver/frontend/src/components/layout/Layout.tsx
```
> [!NOTE]
> If your Raspberry Pi user account is not named `pi`, replace `/home/pi/` with your exact home path across all commands in this guide.

### Step 1.3: Compile the Frontend Framework
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

### Step 1.4: Inject the Symbolic Link Portal
Create a Linux Symbolic Link (Symlink). This creates an automated virtual shortcut inside the backend folder pointing directly back to your persistent source asset:
```bash
ln -s /home/pi/my-custom-tools/text.html /home/pi/dune-weaver/static/text.html
```

### Step 1.5: Reboot the System Service
Head back to the root project directory and restart the native systemd service script wrapper to flush the application cache:
```bash
cd ~/dune-weaver
./dw restart
```

---

## 🔄 Section 2: Automated Recovery Guide After a Dune Weaver Update

When you update Dune Weaver via the web interface dashboard or via a terminal `git pull`, the repository synchronization sequence forces a hard overwrite on `Layout.tsx` back to factory settings and completely wipes out the contents of the `static/` directory.

Because your source modifications live safely inside `~/my-custom-tools/`, you can completely restore your customized Text Compiler sidebar integration over SSH in less than 30 seconds by executing the following copy-and-paste command string:

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

# 5. Restore the symbolic shortcut link portal for text.html
ln -s /home/pi/my-custom-tools/text.html /home/pi/dune-weaver/static/text.html

# 6. Exit back to the root folder and restart the system background service
cd ..
./dw restart
```

---

## 📝 Section 3: Reference Documentation for text.html (Dune Weaver Text Compiler)

A unified, browser-based serial interface and text-to-path compiler for kinetic sand tables. This tool translates standard alphanumeric text into continuous, machine-ready Theta-Rho (`.thr`) coordinate paths. 

It includes a custom single-stroke proportional font engine and a parametric math pipeline capable of wrapping text around complex geometric profiles like Archimedean spirals, concentric circles, and Cassini peanuts.

### Features
* **Custom Pathing Engine:** Transforms strings into continuous vectors using a custom retraced proportional font, minimizing gantry travel time and eliminating sand drags between characters.
* **Complex Geometric Projections:** Projects flat text along various parametric curves:
  * Centered Block Stack
  * Concentric Circular Ring Bend
  * Continuous Archimedean Spiral Wrap
  * Rolling Sine Wave Horizontal Ribbon
  * The Gentle Ellipse
  * The Soft Petal (5-Ripple)
  * The Cassini Peanut
  * The Perimeter Squircle
* **Live Virtual Twin:** Real-time, Retina-ready HTML5 Canvas rendering of the calculated sand path.
* **Pi Telemetry Dashboard:** Tracks vector output nodes, calculated font scale, and rotational matrix loops.
* **Direct Hardware Interfacing:** Streams coordinates directly to a Raspberry Pi serial interface (via UART endpoint) with adjustable millisecond feedrates, or saves the `.thr` file directly to the controller's storage.
* **Standalone Export:** Works completely offline to generate and download `.thr` files for manual transfer.

### Project Structure
The entire application is currently contained within a single `text.html` file, which includes:
1.  **`ProportionalRetracedFont`:** A static dictionary containing the vector spline data for all supported alphanumeric characters and symbols.
2.  **`DuneWeaverPipeline`:** The core mathematical engine that handles word-wrapping, arc-length parameterization, curve projection, and cartesian-to-polar coordinate transformations.
3.  **UI Controller:** Handles local storage state caching, debounced user inputs, and network requests (`fetch`) to the local motor controller backend.

### Usage
#### Standalone Mode (No Hardware)
1. Open `text.html` in any modern web browser.
2. Enter your text, select a geometric profile, and view the generated path.
3. Click **Download THR** to save the Theta-Rho file to your local machine.

#### Networked/Raspberry Pi Mode
To use the **Save to Table** and **Stream Live to Gantry** buttons, the `text.html` file must be served from (or proxied to) a backend controller (like a Raspberry Pi running a Python/Node.js web server) that exposes the following endpoints:
* `POST /api/upload_theta_rho`: Accepts a `.thr` file payload and saves it to the table's local directory.
* `GET /api/stream_step?theta={val}&rho={val}`: Accepts discrete coordinates and relays them via UART/Serial to the motor drivers.

### Roadmap & Future Enhancements
* Implementation of the native browser Web Serial API for direct USB-to-Controller communication, bypassing the need for a backend network relay.
* Stream acknowledgment (ACK) handshakes to prevent the buffer from out-pacing the physical stepper motors.
* Splitting the codebase into modular ES6 JavaScript files for easier maintenance.

---

## 🛠️ Appendix: Complete Reference Code for Modified `Layout.tsx`

This is the exact full code structure of `frontend/src/components/layout/Layout.tsx`. It contains the explicit navigation array route modification mapping (`/static/text.html`), structural anchor interception tags (`isExternal: true`), and Google Material Symbols configuration.

```tsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { NowPlayingBar } from '@/components/NowPlayingBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { cacheAllPreviews } from '@/lib/previewCache'
import { TableSelector } from '@/components/TableSelector'
import { useTable } from '@/contexts/TableContext'
import { apiClient } from '@/lib/apiClient'
import ShinyText from '@/components/ShinyText'
import { useStatusStore } from '@/stores/useStatusStore'
import { useCacheProgressStore } from '@/stores/useCacheProgressStore'

// 1. EXTENDED NAVIGATION ITEMS ARRAY
const navItems = [
  { path: '/', label: 'Browse', icon: 'grid_view', title: 'Browse Patterns' },
  { path: '/playlists', label: 'Playlists', icon: 'playlist_play', title: 'Playlists' },
  { path: '/table-control', label: 'Control', icon: 'tune', title: 'Table Control' },
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
