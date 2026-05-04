import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  Users,
  UtensilsCrossed,
  CalendarDays,
  Star,
  TrendingUp,
  CalendarRange,
  X,
} from 'lucide-react'
import MetricCard from '../components/MetricCard'
import { todayMetrics, revenueByHour, alerts, reservations, restaurant } from '../data/mockData'

const alertIcons = {
  warning: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />,
  info: <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />,
  success: <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />,
}

const alertBg = {
  warning: 'border-amber-500/20 bg-amber-500/5',
  info: 'border-blue-500/20 bg-blue-500/5',
  success: 'border-emerald-500/20 bg-emerald-500/5',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [dismissedAlertIds, setDismissedAlertIds] = useState<number[]>([])
  const totalCoversTonightBooked = reservations.filter((r) => !r.notes.includes('Forecast') && !r.notes.includes('est.')).reduce((s, r) => s + r.covers, 0)
  const estimatedWalkIns = reservations.filter((r) => r.notes.includes('Forecast') || r.notes.includes('est.')).reduce((s, r) => s + r.covers, 0)

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Today's Overview</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Friday, May 3 · Dinner service opens in 42 min · {restaurant.seats} seats across 5 rooms
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live · Updated 4:18 PM
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Revenue Forecast"
          value={`$${todayMetrics.forecastRevenue.toLocaleString()}`}
          subValue={`$${todayMetrics.actualRevenue.toLocaleString()} actual so far`}
          trend={6.4}
          trendLabel="vs last Friday"
        />
        <MetricCard
          label="Covers Forecast"
          value={todayMetrics.forecastCovers.toString()}
          subValue={`${todayMetrics.actualCovers} seated so far`}
          trend={18.3}
          trendLabel="vs avg Friday"
        />
        <MetricCard
          label="Food Cost %"
          value={`${todayMetrics.foodCostPercent}%`}
          subValue={`Target: ${todayMetrics.foodTarget}%`}
          trend={-2.4}
          trendLabel="vs Oct baseline"
        />
        <MetricCard
          label="Savings This Month"
          value={`$${todayMetrics.savingsThisMonth.toLocaleString()}`}
          subValue="Food + labor combined"
          accent
          trend={24}
          trendLabel="vs Oct baseline"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Revenue by Hour</h3>
              <p className="text-xs text-gray-400 mt-0.5">Forecast vs actual · Today</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-brand-500 inline-block rounded" />
                Forecast
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" />
                Actual
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueByHour} margin={{ top: 4, right: 4, bottom: 0, left: -4 }}>
              <defs>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#e5e7eb' }}
                formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="forecast" stroke="#f97316" strokeWidth={2} fill="url(#colorForecast)" dot={false} />
              <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} fill="url(#colorActual)" dot={false} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tonight's reservations */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-white">Tonight's Reservations</h3>
            </div>
            <Link
              to="/schedule"
              className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-0.5"
            >
              Schedule <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2.5 overflow-y-auto flex-1 max-h-[260px] pr-1">
            {reservations.filter((r) => !r.notes.includes('est.')).map((r, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 flex items-start gap-1.5">
                  {r.vip && <Star className="w-3 h-3 text-brand-400 flex-shrink-0 mt-0.5" />}
                  <div className="min-w-0">
                    <p className="text-sm text-gray-200 truncate">{r.name}</p>
                    {r.notes && <p className="text-xs text-gray-500 truncate">{r.notes}</p>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-300">{r.time}</p>
                  <p className="text-xs text-gray-500">{r.covers}cv</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {totalCoversTonightBooked} covers booked
            </span>
            <span className="text-gray-500">+{estimatedWalkIns} walk-in est.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-white">Alerts & Recommendations</h3>
            </div>
            {dismissedAlertIds.length > 0 && dismissedAlertIds.length < alerts.length && (
              <button
                onClick={() => setDismissedAlertIds([])}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Restore all
              </button>
            )}
          </div>
          <div className="space-y-3">
            {alerts.filter((a) => !dismissedAlertIds.includes(a.id)).length === 0 ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-sm text-gray-400">All alerts resolved.</p>
                <button
                  onClick={() => setDismissedAlertIds([])}
                  className="ml-auto text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Restore
                </button>
              </div>
            ) : (
              alerts
                .filter((a) => !dismissedAlertIds.includes(a.id))
                .map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex gap-3 p-3 rounded-lg border ${alertBg[alert.type as keyof typeof alertBg]}`}
                  >
                    {alertIcons[alert.type as keyof typeof alertIcons]}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{alert.time}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {alert.action && alert.route && (
                        <button
                          onClick={() => navigate(alert.route!)}
                          className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors whitespace-nowrap"
                        >
                          {alert.action}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => setDismissedAlertIds((prev) => [...prev, alert.id])}
                        className="p-1 rounded text-gray-600 hover:text-gray-400 hover:bg-gray-700/50 transition-colors"
                        title="Dismiss"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Quick status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Shift Status</h3>
          <div className="space-y-3">
            <Link
              to="/prep?filter=low"
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/60 transition-colors group cursor-pointer block"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200">Prep Plan</p>
                <p className="text-xs text-gray-400">22 of 35 items on track · <span className="text-red-400 font-medium">URGENT: 32 roasts in oven, need 44</span></p>
                <p className="text-xs text-gray-500">Also low: au jus, Yorkshire pudding, sparkling wine, citrus mix, olives, mint</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 flex-shrink-0">
                Needs attention
              </span>
            </Link>

            <Link
              to="/schedule"
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/60 transition-colors cursor-pointer block"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200">Staff Attendance</p>
                <p className="text-xs text-gray-400">17 of 18 staff present</p>
                <p className="text-xs text-gray-500">Marcus Webb clocked in 22 min late</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 flex-shrink-0">
                Good
              </span>
            </Link>

            <Link
              to="/aging"
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/60 transition-colors cursor-pointer block border border-red-500/20 bg-red-500/5"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <CalendarRange className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200">Dry Aging — Action Required</p>
                <p className="text-xs text-red-400 font-medium">May 24 (Memorial Day) has no batch assigned</p>
                <p className="text-xs text-gray-500">Order 58 roasts from Golden Gate Meats by 5pm today</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 flex-shrink-0">
                Urgent
              </span>
            </Link>

            <Link
              to="/analytics"
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/60 transition-colors cursor-pointer block"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200">Cost Performance</p>
                <p className="text-xs text-gray-400">$41,220 saved YTD · 54% waste reduction since Oct</p>
                <p className="text-xs text-gray-500">Roast accuracy: 94% last 30 days (up from 71% at onboarding)</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 flex-shrink-0">
                On track
              </span>
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
            <CostBar label="Labor vs target" current={todayMetrics.laborCostPercent} target={todayMetrics.laborTarget} note={`$${(todayMetrics.weeklyLaborBudget - todayMetrics.weeklyLaborActual).toLocaleString()} under weekly labor budget`} color="emerald" />
            <CostBar label="Food cost vs target" current={todayMetrics.foodCostPercent} target={todayMetrics.foodTarget} note="Slightly above — watch wagyu and sea bass waste" color="amber" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CostBar({
  label,
  current,
  target,
  note,
  color,
}: {
  label: string
  current: number
  target: number
  note: string
  color: 'emerald' | 'amber'
}) {
  const pct = Math.min((current / (target * 1.2)) * 100, 100)
  const overTarget = current > target
  const barColor = overTarget ? 'bg-amber-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs text-gray-400">{label}</p>
        <span className={`text-xs font-medium ${overTarget ? 'text-amber-400' : 'text-emerald-400'}`}>
          {current}% / {target}%
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{note}</p>
    </div>
  )
}
