import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  ArrowLeft,
  ShoppingCart,
  CalendarDays,
  Info,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { agingBatches, forwardForecast, todayAgingOrder } from '../data/mockData'

const statusConfig = {
  ready: { label: 'Ready', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', bar: '#10b981' },
  'ready-soon': { label: 'Ready Soon', color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/20', bar: '#f97316' },
  mid: { label: 'Mid-Aging', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', bar: '#3b82f6' },
  early: { label: 'Early Stage', color: 'text-gray-400', bg: 'bg-gray-800', border: 'border-gray-700', bar: '#6b7280' },
}

const coverageColor = {
  covered: 'text-emerald-400',
  tight: 'text-amber-400',
  deficit: 'text-red-400',
}

const coverageBg = {
  covered: 'bg-emerald-500/10',
  tight: 'bg-amber-500/10',
  deficit: 'bg-red-500/10',
}

export default function AgingPlan() {
  const totalRoastsAging = agingBatches.filter((b) => b.status !== 'ready').reduce((s, b) => s + b.roastCount, 0)
  const totalRawLbs = agingBatches.filter((b) => b.status !== 'ready').reduce((s, b) => s + b.rawWeightLbs, 0)
  const moistureLossLbs = agingBatches.filter((b) => b.status !== 'ready').reduce((s, b) => s + (b.rawWeightLbs - b.projectedYieldLbs), 0)

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h2 className="text-xl font-semibold text-white">Dry Aging Plan</h2>
          </div>
          <p className="text-sm text-gray-400">
            21-day aging pipeline · USDA Prime standing rib roasts
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/prep"
            className="px-3 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Today's prep
          </Link>
        </div>
      </div>

      {/* TODAY'S ORDER — urgent callout */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <ShoppingCart className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-semibold text-white">Order required by {todayAgingOrder.orderDeadline} today</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-medium">Urgent</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              Beef started today ages to perfection on <span className="text-white font-medium">{todayAgingOrder.targetDate}</span> — <span className="text-red-400 font-medium">{todayAgingOrder.targetEvent}</span>. Second-biggest night of the year.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
              <OrderStat label="Roasts to Order" value={todayAgingOrder.recommendedRoasts.toString()} unit="roasts" highlight />
              <OrderStat label="Projected Covers" value={todayAgingOrder.coversForecast.toLocaleString()} unit="covers" />
              <OrderStat label="Est. Order Cost" value={`$${todayAgingOrder.totalOrderCost.toLocaleString()}`} unit={`@ $${todayAgingOrder.pricePerRoast}/roast`} />
              <OrderStat label="Supplier Deadline" value="5:00 PM" unit={todayAgingOrder.supplier.split(' — ')[0]} />
            </div>
            <p className="text-xs text-gray-400 bg-gray-900/60 rounded-lg px-3 py-2">
              <span className="text-gray-300 font-medium">Why 58 roasts:</span> {todayAgingOrder.rationale}
            </p>
          </div>
          <button className="flex-shrink-0 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
            Place Order
          </button>
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Active Batches</p>
          <p className="text-2xl font-bold text-white">5</p>
          <p className="text-xs text-gray-500 mt-0.5">+1 ready to use tonight</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Roasts Aging Now</p>
          <p className="text-2xl font-bold text-white">{totalRoastsAging}</p>
          <p className="text-xs text-gray-500 mt-0.5">{totalRawLbs.toLocaleString()} lbs raw</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Moisture Loss (est.)</p>
          <p className="text-2xl font-bold text-white">{moistureLossLbs.toLocaleString()} lbs</p>
          <p className="text-xs text-gray-500 mt-0.5">~18% avg — normal range</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-2">Coverage Gap</p>
          <p className="text-2xl font-bold text-white">May 24</p>
          <p className="text-xs text-amber-400 mt-0.5">No batch covers Memorial Day</p>
        </div>
      </div>

      {/* Active batches */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Aging Locker — Active Batches</h3>
          <p className="text-xs text-gray-400 mt-0.5">{agingBatches.length} batches tracked · {totalRoastsAging} roasts aging now</p>
        </div>

        <div className="divide-y divide-gray-800">
          {agingBatches.map((batch) => {
            const cfg = statusConfig[batch.status]
            const pct = Math.round((batch.daysAged / 21) * 100)
            return (
              <div key={batch.id} className="px-4 md:px-5 py-4 hover:bg-gray-800/30 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Batch label + status */}
                  <div className="flex-shrink-0 w-20 md:w-24">
                    <p className="text-sm font-semibold text-white">{batch.batchLabel}</p>
                    <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Progress bar + details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <span className="text-xs text-gray-400 truncate">
                        {batch.startDate} → {batch.readyDate}
                      </span>
                      <span className="text-xs font-medium text-white flex-shrink-0">{batch.daysAged}/21d</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: cfg.bar }}
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <p className="text-xs text-gray-500 truncate">{batch.notes}</p>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <p className="text-xs font-semibold text-white">{batch.roastCount} roasts</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <CalendarDays className="w-3 h-3 text-gray-500" />
                          <span className="hidden sm:inline">{batch.targetService}</span>
                          {batch.daysRemaining > 0 && <span className="text-gray-600">· {batch.daysRemaining}d left</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 21-day forward forecast */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">21-Day Forward Demand Forecast</h3>
          <p className="text-xs text-gray-400 mt-0.5">Projected covers and roast requirements — May 3 → May 24</p>
        </div>

        {/* Chart */}
        <div className="p-5">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={forwardForecast} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="shortDate" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                formatter={(val: number, name: string) => [val, name === 'roastsNeeded' ? 'Roasts needed' : '']}
                labelFormatter={(label) => {
                  const d = forwardForecast.find((f) => f.shortDate === label)
                  return d ? `${d.date}${d.isHoliday ? ' · ' + d.isHoliday : ''}` : label
                }}
              />
              <Bar dataKey="roastsNeeded" radius={[3, 3, 0, 0]} name="roastsNeeded">
                {forwardForecast.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={
                      entry.coverageStatus === 'deficit'
                        ? '#ef4444'
                        : entry.coverageStatus === 'tight'
                        ? '#f97316'
                        : '#10b981'
                    }
                    opacity={entry.isToday ? 1 : 0.75}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-5 mt-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Covered</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-500 inline-block" /> Tight</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" /> Deficit — order needed</span>
          </div>
        </div>

        {/* Day-by-day table (condensed) */}
        <div className="border-t border-gray-800 overflow-x-auto">
          <div className="grid px-5 py-2 border-b border-gray-800 text-xs font-medium text-gray-400 uppercase tracking-wider" style={{ gridTemplateColumns: '100px 60px 1fr 100px 140px', minWidth: '480px' }}>
            <div>Date</div>
            <div className="text-center">Covers</div>
            <div className="text-center">Roasts</div>
            <div className="text-center">Coverage</div>
            <div>Batch Assigned</div>
          </div>
          <div className="divide-y divide-gray-800/50 max-h-[360px] overflow-y-auto">
            {forwardForecast.map((day) => (
              <div
                key={day.date}
                className={`grid px-5 py-2.5 items-center text-sm ${day.isToday ? 'bg-brand-500/5' : 'hover:bg-gray-800/30'} transition-colors`}
                style={{ gridTemplateColumns: '100px 60px 1fr 100px 140px', minWidth: '480px' }}
              >
                <div>
                  <span className={`font-medium ${day.isToday ? 'text-brand-400' : day.isHoliday ? 'text-amber-300' : 'text-gray-200'}`}>
                    {day.date}
                  </span>
                  {day.isToday && <span className="ml-1.5 text-xs text-brand-500">today</span>}
                  {day.isHoliday && (
                    <div className="text-xs text-amber-500 truncate">{day.isHoliday}</div>
                  )}
                </div>
                <div className="text-center text-gray-300">{day.projectedCovers.toLocaleString()}</div>
                <div className="text-center">
                  <span className={`font-semibold ${day.coverageStatus === 'deficit' ? 'text-red-400' : day.coverageStatus === 'tight' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {day.roastsNeeded}
                  </span>
                </div>
                <div className="text-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${coverageBg[day.coverageStatus]} ${coverageColor[day.coverageStatus]}`}>
                    {day.coverageStatus === 'deficit' ? 'Order needed' : day.coverageStatus === 'tight' ? 'Tight' : 'Covered'}
                  </span>
                </div>
                <div className={`text-xs ${day.coverageStatus === 'deficit' ? 'text-red-400 font-medium' : 'text-gray-500'}`}>
                  {day.batchCovering}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Moisture loss explainer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-semibold text-white">Yield Projection by Batch</h3>
          </div>
          <div className="space-y-3">
            {agingBatches.slice(1).map((b) => {
              const lossLbs = b.rawWeightLbs - b.projectedYieldLbs
              const lossPct = Math.round((lossLbs / b.rawWeightLbs) * 100)
              return (
                <div key={b.id} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-14 flex-shrink-0">{b.batchLabel}</span>
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500/60 rounded-full"
                      style={{ width: `${(b.projectedYieldLbs / b.rawWeightLbs) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-28 flex-shrink-0 text-right">
                    {b.projectedYieldLbs} / {b.rawWeightLbs} lbs ({lossPct}% loss)
                  </span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-500 mt-4 border-t border-gray-800 pt-3">
            Target moisture loss: 16–20%. Below 16% = under-aged. Above 22% = over-trimming risk.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">How PlateIQ Forecasts Roast Counts</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-400">
            <FormulaRow label="Projected covers" value="Historical Fri/Sat + OpenTable + weather" />
            <FormulaRow label="Prime rib attach rate" value="96% (trailing 30-day average)" />
            <FormulaRow label="Seconds buffer" value="+13% (Fri/Sat guests order seconds)" />
            <FormulaRow label="Avg portions per roast" value="12.8 (based on cut-mix history)" />
            <FormulaRow label="Yield factor" value="×0.82 moisture loss adjustment" />
            <FormulaRow label="Holiday multiplier" value="×1.18 for long weekends (verified)" />
          </div>
          <div className="mt-4 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Pre-PlateIQ accuracy: <span className="text-red-400">71%</span> &nbsp;→&nbsp; Post-PlateIQ: <span className="text-emerald-400">94%</span> on roast count predictions over 7 months.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderStat({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-red-400' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-gray-500">{unit}</p>
    </div>
  )
}

function FormulaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-gray-300 text-right text-xs">{value}</span>
    </div>
  )
}
