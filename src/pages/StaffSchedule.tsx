import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Clock, UserCheck, UserX, ArrowLeft, ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react'
import { staff, weekDays, laborProjection } from '../data/mockData'
import type { ShiftType } from '../data/mockData'

const shiftStyle: Record<ShiftType, string> = {
  prep: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  service: 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
  both: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  off: 'text-gray-700',
}

const shiftLabel: Record<ShiftType, string> = {
  prep: 'Prep',
  service: 'Service',
  both: 'Full Day',
  off: '—',
}

const attendanceStyle = {
  present: 'text-emerald-400',
  late: 'text-amber-400',
  absent: 'text-red-400',
  scheduled: 'text-gray-600',
}

const attendanceIcon = {
  present: <UserCheck className="w-3 h-3" />,
  late: <Clock className="w-3 h-3" />,
  absent: <UserX className="w-3 h-3" />,
  scheduled: null,
}

const deptColor: Record<string, string> = {
  Kitchen: 'text-brand-400',
  'Front of House': 'text-blue-400',
  Bar: 'text-violet-400',
}

const deptBg: Record<string, string> = {
  Kitchen: 'bg-brand-500/10',
  'Front of House': 'bg-blue-500/10',
  Bar: 'bg-violet-500/10',
}

interface AISuggestion {
  id: number
  text: string
  saving: string | null
  effect: { staffName: string; day: string; note: string } | null
}

const aiSuggestions: AISuggestion[] = [
  {
    id: 1,
    text: 'Add a second salad spinner Sat — 620 projected covers with only 1 spinner scheduled creates bottlenecks in the 7pm–8pm rush.',
    saving: null,
    effect: null,
  },
  {
    id: 2,
    text: 'Reduce Ana Rios (Prep Cook) by 2 hrs Monday — Mon is historically 38% lighter than Fri. Prep load does not justify full-day shift.',
    saving: '$40',
    effect: { staffName: 'Ana Rios', day: 'Mon', note: '−2h' },
  },
  {
    id: 3,
    text: 'Marcus Johansson has been late 2 of last 3 Fridays. Consider moving his Friday call time 30 min earlier as a buffer.',
    saving: null,
    effect: { staffName: 'Marcus Johansson', day: 'Fri', note: 'Early +30' },
  },
]

export default function StaffSchedule() {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [department, setDepartment] = useState<string>('All')
  const [appliedIds, setAppliedIds] = useState<number[]>([])
  const [dismissedIds, setDismissedIds] = useState<number[]>([])

  const departments = ['All', 'Kitchen', 'Front of House', 'Bar']
  const filteredStaff = department === 'All' ? staff : staff.filter((s) => s.department === department)
  const visibleSuggestions = aiSuggestions.filter((s) => !dismissedIds.includes(s.id))

  const getAppliedEffect = (staffName: string, day: string) =>
    aiSuggestions.find(
      (s) => appliedIds.includes(s.id) && s.effect?.staffName === staffName && s.effect?.day === day,
    )?.effect ?? null

  const totalScheduledHours = staff.reduce((sum, s) => {
    return sum + Object.values(s.schedule).reduce((sh, d) => sh + (d === 'both' ? 14 : d !== 'off' ? 8 : 0), 0)
  }, 0)

  const laborCost = staff.reduce((sum, s) => {
    const hours = Object.values(s.schedule).reduce((sh, d) => sh + (d === 'both' ? 14 : d !== 'off' ? 8 : 0), 0)
    return sum + hours * s.hourlyRate
  }, 0)

  const presentToday = staff.filter((s) => s.schedule['Fri'] !== 'off' && ['present', 'late'].includes(s.attendance['Fri'])).length
  const scheduledToday = staff.filter((s) => s.schedule['Fri'] !== 'off').length

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h2 className="text-xl font-semibold text-white">Staff Schedule</h2>
          </div>
          <p className="text-sm text-gray-400">Week of Apr 28 – May 4 · {staff.length} staff · Dinner service only · 5pm–10pm</p>
        </div>
        <div className="flex gap-3">
          <button className="px-3 py-2 rounded-lg border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
            Export Schedule
          </button>
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI Suggestions
            {visibleSuggestions.length > 0 && (
              <span className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                {visibleSuggestions.length}
              </span>
            )}
            {showSuggestions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* AI Suggestions panel */}
      {showSuggestions && (
        <div className="bg-brand-500/5 border border-brand-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="text-sm font-semibold text-white">PlateIQ Scheduling Suggestions</h3>
            <span className="text-xs text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full">
              {visibleSuggestions.length} this week
            </span>
          </div>
          {visibleSuggestions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-3">All suggestions addressed.</p>
          ) : (
            <div className="space-y-3">
              {visibleSuggestions.map((s) => {
                const isApplied = appliedIds.includes(s.id)
                return (
                  <div
                    key={s.id}
                    className={`flex items-start justify-between gap-4 rounded-lg p-3 transition-colors ${
                      isApplied ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-gray-900/60'
                    }`}
                  >
                    <p className="text-sm text-gray-200">{s.text}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {s.saving && (
                        <span className="text-xs text-emerald-400 font-medium">Saves {s.saving}</span>
                      )}
                      {isApplied ? (
                        <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-medium">
                          <Check className="w-3 h-3" />
                          Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => setAppliedIds((prev) => [...prev, s.id])}
                          className="text-xs px-2.5 py-1 rounded-md bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors font-medium"
                        >
                          Apply
                        </button>
                      )}
                      {!isApplied && (
                        <button
                          onClick={() => setDismissedIds((prev) => [...prev, s.id])}
                          className="text-xs px-2.5 py-1 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Today's Attendance</p>
          <p className="text-2xl font-bold text-white">{presentToday} / {scheduledToday}</p>
          <p className="text-xs text-amber-400 mt-0.5">1 late · 0 absent</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Weekly Hours</p>
          <p className="text-2xl font-bold text-white">{totalScheduledHours}h</p>
          <p className="text-xs text-gray-500 mt-0.5">Across {staff.length} staff</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Weekly Labor Cost</p>
          <p className="text-2xl font-bold text-white">${laborCost.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-0.5">↓ $2,300 vs last week</p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-2">AI Savings Available</p>
          <p className="text-2xl font-bold text-white">$172</p>
          <p className="text-xs text-gray-400 mt-0.5">3 schedule adjustments</p>
        </div>
      </div>

      {/* Department filter */}
      <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 w-fit">
        {departments.map((d) => (
          <button
            key={d}
            onClick={() => setDepartment(d)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              department === d ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {d === 'All' ? `All (${staff.length})` : `${d} (${staff.filter((s) => s.department === d).length})`}
          </button>
        ))}
      </div>

      {/* Schedule grid */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
        <div
          className="grid border-b border-gray-800"
          style={{ gridTemplateColumns: '220px repeat(7, minmax(80px, 1fr))', minWidth: '700px' }}
        >
          <div className="px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Employee</div>
          {weekDays.map((day) => (
            <div key={day} className={`px-2 py-3 text-xs font-medium uppercase tracking-wider text-center border-l border-gray-800 ${day === 'Fri' ? 'text-brand-400' : 'text-gray-400'}`}>
              {day}{day === 'Fri' ? ' ·today' : ''}
            </div>
          ))}
        </div>

        <div className="divide-y divide-gray-800">
          {filteredStaff.map((member) => (
            <div
              key={member.id}
              className="grid items-center hover:bg-gray-800/30 transition-colors"
              style={{ gridTemplateColumns: '220px repeat(7, minmax(80px, 1fr))', minWidth: '700px' }}
            >
              <div className="px-4 py-3 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full ${deptBg[member.department]} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-xs font-semibold ${deptColor[member.department]}`}>
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200 leading-tight">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role} · ${member.hourlyRate}/hr</p>
                </div>
              </div>

              {weekDays.map((day) => {
                const shift = member.schedule[day] as ShiftType
                const attendance = member.attendance[day]
                const isToday = day === 'Fri'
                const appliedEffect = getAppliedEffect(member.name, day)
                return (
                  <div
                    key={day}
                    className={`px-2 py-3 flex flex-col items-center gap-1 border-l border-gray-800 ${isToday ? 'bg-brand-500/5' : ''} ${appliedEffect ? 'ring-1 ring-inset ring-amber-500/40 bg-amber-500/5' : ''}`}
                  >
                    {shift !== 'off' ? (
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${shiftStyle[shift]}`}>
                        {shiftLabel[shift]}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-800">Off</span>
                    )}
                    {appliedEffect && (
                      <span className="text-xs text-amber-400 font-medium leading-none">{appliedEffect.note}</span>
                    )}
                    {shift !== 'off' && !appliedEffect && (
                      <span className={`flex items-center gap-0.5 text-xs ${attendanceStyle[attendance]}`}>
                        {attendanceIcon[attendance]}
                        {attendance !== 'scheduled' && (
                          <span className="capitalize text-xs">{attendance}</span>
                        )}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/30 inline-block" /> Prep (10am–5pm)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-500/20 border border-brand-500/30 inline-block" /> Service (4pm–close)</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-500/20 border border-violet-500/30 inline-block" /> Full Day</span>
        <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5 text-emerald-400" /> Present</span>
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> Late</span>
        <span className="flex items-center gap-1.5"><UserX className="w-3.5 h-3.5 text-red-400" /> Absent</span>
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-full ${deptBg['Kitchen']} inline-block`} /> Kitchen
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-full ${deptBg['Front of House']} inline-block`} /> Front of House
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded-full ${deptBg['Bar']} inline-block`} /> Bar
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded ring-1 ring-inset ring-amber-500/40 bg-amber-500/5 inline-block" /> AI-modified
        </span>
      </div>

      {/* Labor chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Labor Cost by Day</h3>
            <p className="text-xs text-gray-400 mt-0.5">Scheduled vs actual vs PlateIQ optimal</p>
          </div>
          <Link to="/analytics" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            Full analytics →
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={laborProjection} margin={{ top: 4, right: 4, bottom: 0, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
              formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
            />
            <Bar dataKey="scheduled" fill="#f97316" opacity={0.7} radius={[3, 3, 0, 0]} name="Scheduled" />
            <Bar dataKey="actual" fill="#10b981" opacity={0.7} radius={[3, 3, 0, 0]} name="Actual" />
            <Bar dataKey="optimal" fill="#6b7280" opacity={0.5} radius={[3, 3, 0, 0]} name="Optimal" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-brand-500/70 rounded-sm inline-block" /> Scheduled</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-emerald-500/70 rounded-sm inline-block" /> Actual</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-gray-500/50 rounded-sm inline-block" /> Optimal (PlateIQ)</span>
        </div>
      </div>
    </div>
  )
}
