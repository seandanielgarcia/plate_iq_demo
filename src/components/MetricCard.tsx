import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  subValue?: string
  trend?: number
  trendLabel?: string
  accent?: boolean
  className?: string
}

export default function MetricCard({
  label,
  value,
  subValue,
  trend,
  trendLabel,
  accent,
  className,
}: MetricCardProps) {
  const trendPositive = trend !== undefined && trend >= 0
  const TrendIcon = trend === 0 ? Minus : trendPositive ? TrendingUp : TrendingDown

  return (
    <div
      className={clsx(
        'rounded-xl border p-5',
        accent
          ? 'bg-brand-500/10 border-brand-500/30'
          : 'bg-gray-900 border-gray-800',
        className,
      )}
    >
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={clsx('text-2xl font-bold', accent ? 'text-brand-400' : 'text-white')}>
        {value}
      </p>
      {subValue && <p className="text-sm text-gray-400 mt-0.5">{subValue}</p>}
      {trend !== undefined && (
        <div
          className={clsx(
            'flex items-center gap-1 mt-2 text-xs font-medium',
            trendPositive ? 'text-emerald-400' : 'text-red-400',
          )}
        >
          <TrendIcon className="w-3.5 h-3.5" />
          <span>
            {trend > 0 ? '+' : ''}{trend}% {trendLabel}
          </span>
        </div>
      )}
    </div>
  )
}
