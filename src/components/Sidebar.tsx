import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ChefHat,
  Users,
  BarChart3,
  Flame,
  CalendarRange,
  FlaskConical,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import { todayMetrics } from '../data/mockData'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/prep', icon: ChefHat, label: 'Prep Plan' },
  { to: '/aging', icon: CalendarRange, label: 'Dry Aging' },
  { to: '/schedule', icon: Users, label: 'Staff Schedule' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/methodology', icon: FlaskConical, label: 'Methodology' },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-30 w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-200',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">PlateIQ</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800',
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="bg-brand-500/10 rounded-lg p-3">
            <p className="text-xs font-medium text-brand-400 mb-1">Savings YTD</p>
            <p className="text-xl font-bold text-white">${todayMetrics.savingsYTD.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">vs. pre-PlateIQ baseline</p>
          </div>
        </div>
      </aside>
    </>
  )
}
