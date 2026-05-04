import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Database,
  TrendingUp,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react'

export default function Methodology() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link to="/analytics" className="text-gray-500 hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h2 className="text-xl font-semibold text-white">How PlateIQ Works</h2>
        </div>
        <p className="text-sm text-gray-400">The data, models, and verification behind every recommendation</p>
      </div>

      {/* Data sources */}
      <Section icon={<Database className="w-4 h-4 text-blue-400" />} title="What We Track" color="blue">
        <p className="text-sm text-gray-400 mb-4">Four live streams feed every forecast. No manual entry required.</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <DataCard name="Point of Sale" detail="Toast POS — real-time" description="Every item sold, voided, and modified. Builds per-item demand curves by day, hour, and weather over a 90-day rolling window." />
          <DataCard name="Reservations" detail="OpenTable + Resy — every 2 min" description="Cover counts, party sizes, and late additions. New reservations trigger a re-forecast within 2 minutes of booking." />
          <DataCard name="Weather" detail="NWS API — hourly" description="SF temperature and precipitation. Cold weather boosts bisque and French onion demand by ~24%; rain pulls early seatings by ~11%." />
          <DataCard name="Staff Clock-ins" detail="Toast Payroll — real-time" description="Actual vs scheduled attendance. Late or absent staff trigger immediate labor cost and coverage recalculations." />
        </div>
      </Section>

      {/* Forecasting */}
      <Section icon={<FlaskConical className="w-4 h-4 text-brand-400" />} title="How We Forecast" color="orange">
        <p className="text-sm text-gray-400 mb-4">
          Cover count is the foundation. We start from a 12-week historical baseline for the same weekday, adjust upward or downward based on confirmed reservations vs the historical norm, then factor in walk-in rates using weather and holiday data. Tonight: <span className="text-white font-medium">580 projected covers</span>.
        </p>
        <p className="text-sm text-gray-400 mb-5">
          From covers, the roast count follows: multiply by the prime rib attach rate (96% trailing 30 days), add a seconds buffer (11.8% on Fri/Sat verified from POS), divide by average portions per roast (recalculated weekly from cut-mix), and always round up — one spare roast costs ~$228; turning away a table costs far more.
        </p>
        <div className="bg-gray-800/60 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Forecast accuracy — trailing 90 days</p>
          <div className="flex items-end gap-8">
            <Stat label="Within ±5%" value="81%" positive />
            <Stat label="Within ±10%" value="94%" positive />
            <Stat label="Mean abs error" value="22 covers" />
            <Stat label="Pre-PlateIQ baseline" value="±68 covers" />
          </div>
        </div>
      </Section>

      {/* Confidence */}
      <Section icon={<TrendingUp className="w-4 h-4 text-violet-400" />} title="Confidence Scores" color="violet">
        <p className="text-sm text-gray-400 mb-4">
          Each prep item shows a confidence percentage — how stable that item's demand has been over the trailing 30 days. High confidence means prep to the number. Lower confidence means add a manual buffer.
        </p>
        <div className="space-y-2">
          <ConfRow range="90–99%" color="text-emerald-400" bg="bg-emerald-500/10" label="Very stable. Safe to prep to the number." examples="Brioche service, creamed spinach, au jus, horseradish" />
          <ConfRow range="80–89%" color="text-amber-400" bg="bg-amber-500/10" label="Moderate variance. Prep to number, monitor mid-service." examples="Shrimp cocktail, escargot, tiramisu, baked potato split" />
          <ConfRow range="70–79%" color="text-orange-400" bg="bg-orange-500/10" label="Higher variance. Add a manual buffer or check with kitchen." examples="New cocktails, seasonal fish, recently added items" />
          <ConfRow range="< 70%" color="text-red-400" bg="bg-red-500/10" label="Insufficient data. Treat as rough estimate, flag for chef review." examples="Items with fewer than 4 weeks of sales history" />
        </div>
      </Section>

      {/* Savings verification */}
      <Section icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} title="How Savings Are Verified" color="emerald">
        <p className="text-sm text-gray-400 mb-4">
          PlateIQ only charges for measurable reductions. The first four weeks are observation-only — we record actual food cost %, waste per category, and labor cost % to establish a baseline. After recommendations go live, we compare week-over-week actuals, adjusting for revenue volume and USDA prime beef commodity swings. We only claim savings on specific PlateIQ-recommended actions; general revenue growth is excluded.
        </p>
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3">
          <MetricBox label="Baseline food cost" value="34.1%" sub="Oct 2025" />
          <MetricBox label="Current food cost" value="28.8%" sub="−5.3pp" positive />
          <MetricBox label="Baseline labor cost" value="31.4%" sub="Oct 2025" />
          <MetricBox label="Current labor cost" value="26.4%" sub="−5.0pp" positive />
        </div>
        <p className="text-xs text-gray-500 mt-4">
          PlateIQ charges a percentage of verified savings only — <span className="text-gray-300">you pay nothing until savings are confirmed</span>. No base fee, no minimum commitment, no risk. At House of Prime Rib's current run rate, the fee represents a <span className="text-emerald-400 font-medium">7× return</span> on every dollar paid.
        </p>
      </Section>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Section({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  const border = { blue: 'border-blue-500/20', orange: 'border-brand-500/20', emerald: 'border-emerald-500/20', violet: 'border-violet-500/20' }[color] ?? 'border-gray-800'
  return (
    <div className={`bg-gray-900 border ${border} rounded-xl p-6`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center">{icon}</div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function DataCard({ name, detail, description }: { name: string; detail: string; description: string }) {
  return (
    <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700/50">
      <p className="text-sm font-semibold text-white">{name}</p>
      <p className="text-xs text-gray-500 mb-2">{detail}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  )
}

function Stat({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className={`text-xs mt-0.5 ${positive ? 'text-emerald-400' : 'text-gray-400'}`}>{label}</p>
    </div>
  )
}

function ConfRow({ range, color, bg, label, examples }: { range: string; color: string; bg: string; label: string; examples: string }) {
  return (
    <div className={`flex gap-4 p-3 rounded-lg ${bg}`}>
      <span className={`text-sm font-bold w-16 flex-shrink-0 ${color}`}>{range}</span>
      <div>
        <p className="text-sm text-gray-200">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">e.g. {examples}</p>
      </div>
    </div>
  )
}

function MetricBox({ label, value, sub, positive }: { label: string; value: string; sub: string; positive?: boolean }) {
  return (
    <div className="bg-gray-800/60 rounded-lg p-4 border border-gray-700/50 text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${positive ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  )
}
