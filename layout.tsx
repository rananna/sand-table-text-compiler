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
  'www.msftconnecttest.com',
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
