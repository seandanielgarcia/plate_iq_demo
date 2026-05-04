import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ChefHat, TrendingUp, AlertTriangle, CheckCircle2, Filter, ArrowLeft } from 'lucide-react'
import { prepItems } from '../data/mockData'

type FilterType = 'all' | 'low' | 'over' | 'on-track'

const statusConfig = {
  'on-track': {
    label: 'On Track',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  low: {
    label: 'Needs More',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  over: {
    label: 'Over-Prepped',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
}

const categories = ['All', 'Roast', 'Cut Forecast', 'Yorkshire', 'Salad', 'Sides', 'Starter', 'Dessert', 'Bread', 'Fish Special', 'Bar', 'Garnishes']

export default function PrepPlan() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState<FilterType>((searchParams.get('filter') as FilterType) || 'all')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const f = searchParams.get('filter') as FilterType
    if (f && ['all', 'low', 'over', 'on-track'].includes(f)) setFilter(f)
  }, [searchParams])

  function handleFilterChange(f: FilterType) {
    setFilter(f)
    if (f === 'all') {
      searchParams.delete('filter')
    } else {
      searchParams.set('filter', f)
    }
    setSearchParams(searchParams)
  }

  const filtered = prepItems.filter((item) => {
    const matchesStatus = filter === 'all' || item.status === filter
    const matchesCategory = category === 'All' || item.category === category
    return matchesStatus && matchesCategory
  })

  const counts = {
    all: prepItems.length,
    'on-track': prepItems.filter((i) => i.status === 'on-track').length,
    low: prepItems.filter((i) => i.status === 'low').length,
    over: prepItems.filter((i) => i.status === 'over').length,
  }

  const totalAtRiskCost = prepItems
    .filter((i) => i.status === 'low')
    .reduce((s, i) => s + (i.recommended - i.prepped) * i.cost, 0)

  const potentialWaste = prepItems
    .filter((i) => i.status === 'over')
    .reduce((s, i) => s + (i.prepped - i.recommended) * i.cost, 0)

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h2 className="text-xl font-semibold text-white">Prep Plan</h2>
          </div>
          <p className="text-sm text-gray-400">
            Friday, May 3 · Updated 4:18 PM · {prepItems.length} items · Dinner service 5pm–10pm · 580 covers projected
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
          <ChefHat className="w-4 h-4" />
          Mark All Complete
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => handleFilterChange('on-track')}
          className={`rounded-xl border p-4 text-left transition-all ${filter === 'on-track' ? 'ring-2 ring-emerald-500/40' : 'hover:border-emerald-500/30'} bg-emerald-500/10 border-emerald-500/20`}
        >
          <p className="text-3xl font-bold text-emerald-400">{counts['on-track']}</p>
          <p className="text-sm text-gray-300 mt-1">On Track</p>
        </button>
        <button
          onClick={() => handleFilterChange('low')}
          className={`rounded-xl border p-4 text-left transition-all ${filter === 'low' ? 'ring-2 ring-amber-500/40' : 'hover:border-amber-500/30'} bg-amber-500/10 border-amber-500/20`}
        >
          <p className="text-3xl font-bold text-amber-400">{counts.low}</p>
          <p className="text-sm text-gray-300 mt-1">Needs More</p>
          <p className="text-xs text-amber-500 mt-0.5">${totalAtRiskCost} at risk</p>
        </button>
        <button
          onClick={() => handleFilterChange('over')}
          className={`rounded-xl border p-4 text-left transition-all ${filter === 'over' ? 'ring-2 ring-blue-500/40' : 'hover:border-blue-500/30'} bg-blue-500/10 border-blue-500/20`}
        >
          <p className="text-3xl font-bold text-blue-400">{counts.over}</p>
          <p className="text-sm text-gray-300 mt-1">Over-Prepped</p>
          <p className="text-xs text-blue-500 mt-0.5">${potentialWaste} potential waste</p>
        </button>
        <button
          onClick={() => handleFilterChange('all')}
          className={`rounded-xl border p-4 text-left transition-all ${filter === 'all' ? 'ring-2 ring-gray-500/40' : 'hover:border-gray-600'} bg-gray-900 border-gray-800`}
        >
          <p className="text-3xl font-bold text-white">{counts.all}</p>
          <p className="text-sm text-gray-300 mt-1">Total Items</p>
          <p className="text-xs text-gray-500 mt-0.5">Click to show all</p>
        </button>
      </div>

      {/* Filters */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                category === cat ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
        <div className="grid gap-4 px-5 py-3 border-b border-gray-800 text-xs font-medium text-gray-400 uppercase tracking-wider" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 1fr', minWidth: '640px' }}>
          <div>Item</div>
          <div>Category</div>
          <div className="text-right">Recommended</div>
          <div className="text-right">Prepped</div>
          <div className="text-center">Conf.</div>
          <div className="text-right">Status</div>
        </div>

        <div className="divide-y divide-gray-800">
          {filtered.map((item) => {
            const cfg = statusConfig[item.status as keyof typeof statusConfig]
            const delta = item.prepped - item.recommended
            return (
              <div key={item.id} className="grid gap-4 px-5 py-4 items-center hover:bg-gray-800/50 transition-colors" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 1fr', minWidth: '640px' }}>
                <div>
                  <p className="text-sm font-medium text-gray-100">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Last week: {item.lastWeekActual} {item.unit} · ${item.cost}/unit</p>
                </div>
                <div>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">{item.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-200">{item.recommended}</span>
                  <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${item.status === 'on-track' ? 'text-emerald-400' : item.status === 'low' ? 'text-amber-400' : 'text-blue-400'}`}>
                    {item.prepped}
                  </span>
                  {delta !== 0 && (
                    <span className={`text-xs ml-1 ${delta > 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                      {delta > 0 ? `+${delta}` : delta}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 ml-1">{item.unit}</span>
                </div>
                <div className="text-center">
                  <ConfidencePip value={item.confidence} />
                </div>
                <div className="flex justify-end">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                    {cfg.icon}
                    {cfg.label}
                  </span>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-gray-500">No items match the current filters.</div>
          )}
        </div>
      </div>

      {/* Data sources */}
      <div className="flex items-start gap-2 text-xs text-gray-500">
        <Filter className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
        <p>
          Recommendations based on: 90-day Friday sales history, 580 confirmed covers across 5 dining rooms, cut-mix preference from reservation notes, trailing 4-week bar attach rates, and weather forecast (53°F → bisque +18%). Roast counts factor in seconds rate (avg 11% of covers). Confidence reflects prediction accuracy vs trailing Friday actuals.
        </p>
      </div>
    </div>
  )
}

function ConfidencePip({ value }: { value: number }) {
  const color = value >= 90 ? 'text-emerald-400' : value >= 80 ? 'text-amber-400' : 'text-red-400'
  return <span className={`text-xs font-medium ${color}`}>{value}%</span>
}
