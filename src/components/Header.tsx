import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, ArrowRight, X, AlertTriangle, Info, CheckCircle2 } from 'lucide-react'
import { restaurant, alerts } from '../data/mockData'

const alertIcons = {
  warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />,
  info: <Info className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />,
  success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />,
}

export default function Header() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [dismissedIds, setDismissedIds] = useState<number[]>([])

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  const visible = alerts.filter((a) => !dismissedIds.includes(a.id))
  const unreadCount = visible.length

  const dismiss = (id: number) => setDismissedIds((prev) => [...prev, id])

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-gray-900 border-b border-gray-800 flex-shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-white">{restaurant.name}</h1>
        <p className="text-xs text-gray-400">{today} · {restaurant.location} · {restaurant.seats} seats</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center px-0.5 leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <>
              {/* Click-outside backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

              {/* Dropdown panel */}
              <div className="absolute right-0 top-full mt-2 w-96 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  {dismissedIds.length > 0 && (
                    <button
                      onClick={() => setDismissedIds([])}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Restore all
                    </button>
                  )}
                </div>

                <div className="divide-y divide-gray-800 max-h-[420px] overflow-y-auto">
                  {visible.length === 0 ? (
                    <div className="flex items-center gap-2.5 px-4 py-5 text-sm text-gray-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      You're all caught up.
                    </div>
                  ) : (
                    visible.map((alert) => (
                      <div key={alert.id} className="flex gap-3 px-4 py-3.5 hover:bg-gray-800/40 transition-colors">
                        {alertIcons[alert.type as keyof typeof alertIcons]}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-200 leading-snug">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{alert.time}</p>
                          {alert.action && alert.route && (
                            <button
                              onClick={() => { navigate(alert.route!); setOpen(false) }}
                              className="mt-1.5 text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                            >
                              {alert.action} <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => dismiss(alert.id)}
                          className="flex-shrink-0 p-1 rounded text-gray-600 hover:text-gray-400 hover:bg-gray-700/50 transition-colors self-start mt-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <button className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
          <div className="w-7 h-7 rounded-full bg-brand-500/20 flex items-center justify-center">
            <span className="text-xs font-medium text-brand-400">{restaurant.managerInitials}</span>
          </div>
          <span className="text-sm text-gray-300">{restaurant.manager}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>
    </header>
  )
}
