import { Link } from 'react-router-dom'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { DollarSign, Leaf, Clock, ArrowLeft, ChefHat, Users, ArrowRight, FlaskConical } from 'lucide-react'
import { savingsHistory, wasteTrend, todayMetrics, restaurant } from '../data/mockData'
import MetricCard from '../components/MetricCard'

const roiData = [
  { month: 'Oct', cumulative: 6_800 },
  { month: 'Nov', cumulative: 14_200 },
  { month: 'Dec', cumulative: 22_420 },
  { month: 'Jan', cumulative: 29_220 },
  { month: 'Feb', cumulative: 36_620 },
  { month: 'Mar', cumulative: 44_620 },
  { month: 'Apr', cumulative: 52_820 },
]

const laborEfficiency = [
  { month: 'Oct', covers_per_labor_hour: 2.8 },
  { month: 'Nov', covers_per_labor_hour: 3.0 },
  { month: 'Dec', covers_per_labor_hour: 3.2 },
  { month: 'Jan', covers_per_labor_hour: 3.4 },
  { month: 'Feb', covers_per_labor_hour: 3.6 },
  { month: 'Mar', covers_per_labor_hour: 3.9 },
  { month: 'Apr', covers_per_labor_hour: 4.2 },
]

const categoryBreakdown = [
  { category: 'Proteins', saved: 14_200, waste_pct: 3.8 },
  { category: 'Sides', saved: 8_400, waste_pct: 5.2 },
  { category: 'Desserts', saved: 6_100, waste_pct: 4.1 },
  { category: 'Starters', saved: 5_800, waste_pct: 3.6 },
  { category: 'Bread', saved: 3_200, waste_pct: 2.1 },
  { category: 'Soups', saved: 4_260, waste_pct: 2.8 },
]

export default function Analytics() {
  const annualProjection = Math.round((todayMetrics.savingsYTD / 7) * 12)
  const plateiqFee = 9_200
  const netROI = annualProjection - plateiqFee
  const paybackWeeks = Math.round((plateiqFee / annualProjection) * 52)

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h2 className="text-xl font-semibold text-white">Analytics</h2>
          </div>
          <p className="text-sm text-gray-400">Oct 2025 – Apr 2026 · {restaurant.name} · {restaurant.location}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-3 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Savings YTD"
          value={`$${todayMetrics.savingsYTD.toLocaleString()}`}
          subValue="Food + labor combined"
          trend={31}
          trendLabel="vs same period last yr"
          accent
        />
        <MetricCard
          label="Food Waste Reduction"
          value="47%"
          subValue="7.8% → 4.1% of revenue"
          trend={-47}
          trendLabel="waste vs baseline"
        />
        <MetricCard
          label="Covers / Labor Hour"
          value="4.2"
          subValue="Up from 2.8 in Oct"
          trend={50}
          trendLabel="efficiency gain"
        />
        <MetricCard
          label="Annualized Projection"
          value={`$${annualProjection.toLocaleString()}`}
          subValue="At current 7-month pace"
          trend={8}
          trendLabel="vs Q1 pace"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings by category */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Monthly Savings Breakdown</h3>
              <p className="text-xs text-gray-400 mt-0.5">Food vs labor cost reduction</p>
            </div>
            <Link to="/prep" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-0.5">
              Prep plan <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={savingsHistory} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
              />
              <Bar dataKey="food" stackId="a" fill="#f97316" opacity={0.8} name="Food savings" />
              <Bar dataKey="labor" stackId="a" fill="#8b5cf6" opacity={0.8} radius={[3, 3, 0, 0]} name="Labor savings" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand-500/80 inline-block" /> Food</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-violet-500/80 inline-block" /> Labor</span>
          </div>
        </div>

        {/* Cumulative ROI */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-white">Cumulative Verified Savings</h3>
            <p className="text-xs text-gray-400 mt-0.5">Total since onboarding in October 2025</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={roiData} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
              <defs>
                <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                formatter={(val: number) => [`$${val.toLocaleString()}`, 'Cumulative savings']}
              />
              <Area type="monotone" dataKey="cumulative" stroke="#f97316" strokeWidth={2} fill="url(#roiGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste trend */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-sm font-semibold text-white">Food Waste % of Revenue</h3>
                <p className="text-xs text-gray-400">vs industry average 6.2%</p>
              </div>
            </div>
            <Link to="/prep?filter=over" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-0.5">
              Over-prepped items <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={wasteTrend} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} domain={[3, 9]} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                formatter={(val: number) => [`${val}%`, '']}
              />
              <ReferenceLine y={6.2} stroke="#4b5563" strokeDasharray="4 4" label={{ value: 'Industry avg 6.2%', fill: '#6b7280', fontSize: 10, position: 'insideTopRight' }} />
              <Line type="monotone" dataKey="waste" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} name="Monarch waste %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Labor efficiency */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <div>
                <h3 className="text-sm font-semibold text-white">Labor Efficiency</h3>
                <p className="text-xs text-gray-400">Covers served per labor hour</p>
              </div>
            </div>
            <Link to="/schedule" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-0.5">
              Staff schedule <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={laborEfficiency} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
              <defs>
                <linearGradient id="laborGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} domain={[2, 5]} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                formatter={(val: number) => [`${val} covers/hr`, '']}
              />
              <Area type="monotone" dataKey="covers_per_labor_hour" stroke="#3b82f6" strokeWidth={2} fill="url(#laborGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings by menu category */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Savings by Menu Category</h3>
            <p className="text-xs text-gray-400 mt-0.5">YTD — food cost reduction attributed per category</p>
          </div>
          <Link to="/prep" className="text-xs text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-0.5">
            Today's prep plan <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBreakdown.map((cat) => (
            <div key={cat.category} className="bg-gray-800/60 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-gray-200">{cat.category}</p>
                <span className="text-xs text-emerald-400 font-medium">${(cat.saved / 1000).toFixed(1)}k</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(cat.saved / 14200) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{cat.waste_pct}% waste rate</p>
            </div>
          ))}
        </div>
      </div>

      {/* ROI breakdown */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <DollarSign className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-semibold text-white">ROI Summary · {restaurant.name}</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <ROIItem label="Annual Revenue" value={`$${(restaurant.annualRevenue / 1_000_000).toFixed(1)}M`} />
          <ROIItem label="Annualized Savings" value={`$${annualProjection.toLocaleString()}`} note="Based on 7-month run rate" positive />
          <ROIItem label="PlateIQ Annual Fee" value={`$${plateiqFee.toLocaleString()}`} note="Only on verified savings" />
          <ROIItem label="Net Benefit" value={`$${netROI.toLocaleString()}`} note={`${paybackWeeks}-week payback`} positive accent />
        </div>
        <div className="mt-5 pt-5 border-t border-gray-800 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-gray-400">
            Pricing is <span className="text-white font-medium">performance-based</span> — you only pay on verified, measurable cost reductions. No savings = no fee.
          </p>
          <div className="flex gap-3">
            <Link
              to="/prep"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 font-medium transition-colors border border-gray-700 rounded-lg px-3 py-1.5"
            >
              <ChefHat className="w-3.5 h-3.5" />
              Today's prep
            </Link>
            <Link
              to="/schedule"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 font-medium transition-colors border border-gray-700 rounded-lg px-3 py-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              Staff schedule
            </Link>
            <Link
              to="/methodology"
              className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              How we calculate this
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ROIItem({
  label,
  value,
  note,
  positive,
  accent,
}: {
  label: string
  value: string
  note?: string
  positive?: boolean
  accent?: boolean
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold ${accent ? 'text-brand-400' : positive ? 'text-emerald-400' : 'text-white'}`}>
        {value}
      </p>
      {note && <p className="text-xs text-gray-500 mt-0.5">{note}</p>}
    </div>
  )
}
