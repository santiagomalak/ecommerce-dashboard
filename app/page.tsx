'use client'

import { useEffect, useState } from 'react'
import {
  ComposedChart, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ReferenceLine
} from 'recharts'
import { ShoppingCart, Users, DollarSign, TrendingUp, Star, Truck, AlertCircle, Loader2 } from 'lucide-react'
import { T, LANGUAGES, type Lang, type Translations } from '@/lib/i18n'

// ── Types ──────────────────────────────────────────────────────────────────────
interface KPIs {
  total_orders: number; total_customers: number; gross_revenue: number
  avg_order_value: number; avg_review_score: number; delivery_rate: number
}
interface RevenueRow {
  month_label: string; month_iso: string; total_orders: number
  gross_revenue: number; avg_order_value: number; growth_pct: number
}
interface RFMRow {
  segment: string; customers: number; pct: number; total_revenue: number
  avg_order_value: number; avg_recency: number; avg_review_score: number
}
interface CohortRow {
  cohort_label: string; cohort_size: number; month_index: number; retention_rate: number
}
interface SellerRow {
  seller_id: string; state: string; seller_tier: string; total_orders: number
  gross_revenue: number; avg_review_score: number; delivery_rate: number; unique_products: number
}
interface TierRow { seller_tier: string; sellers: number; revenue: number }

// ── Helpers ───────────────────────────────────────────────────────────────────
const ACCENT = '#FF694B'
const SURFACE = '#111118'
const BORDER  = '#1e1e2e'

const fmt = {
  currency: (n: number | string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n)),
  number: (n: number | string) => new Intl.NumberFormat('en-US').format(Number(n)),
  pct:    (n: number | string) => `${Number(n).toFixed(1)}%`,
  score:  (n: number | string) => Number(n).toFixed(2),
}

const RFM_COLORS  = ['#FF694B','#f97316','#eab308','#22c55e','#06b6d4','#6366f1','#a855f7','#ec4899']
const TIER_COLORS: Record<string, string> = {
  Platinum: '#e5e7eb', Gold: '#fbbf24', Silver: '#94a3b8', Bronze: '#b45309',
}

// ── Language Switcher ─────────────────────────────────────────────────────────
function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          title={l.label}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all"
          style={{
            background: lang === l.code ? `${ACCENT}20` : 'transparent',
            border: `1px solid ${lang === l.code ? ACCENT : BORDER}`,
            color: lang === l.code ? ACCENT : '#71717a',
          }}
        >
          <span className="text-base leading-none">{l.flag}</span>
          <span>{l.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KPICard({ icon: Icon, label, value, sub }: {
  icon: React.ElementType; label: string; value: string; sub?: string
}) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-zinc-400 text-xs uppercase tracking-widest">
        <Icon size={14} style={{ color: ACCENT }} />{label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-zinc-500">{sub}</div>}
    </div>
  )
}

// ── Loading / Error ───────────────────────────────────────────────────────────
function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin" style={{ color: ACCENT }} />
    </div>
  )
}

function DBError({ message, t }: { message: string; t: Translations }) {
  return (
    <div style={{ background: '#1a0a08', border: '1px solid #7f1d1d' }} className="rounded-xl p-6 flex items-start gap-4">
      <AlertCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-red-300 font-semibold mb-1">{t.db_error_title}</p>
        <p className="text-red-400/70 text-sm font-mono">{message}</p>
        <p className="text-zinc-500 text-xs mt-3">
          {t.db_error_hint}
        </p>
      </div>
    </div>
  )
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RevenueTooltip({ active, payload, label, t }: { active?: boolean; payload?: readonly any[]; label?: string | number; t: Translations }) {
  if (!active || !payload?.length) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const revenue   = payload.find((p: any) => p.name === 'gross_revenue')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const growth    = payload.find((p: any) => p.name === 'growth_pct')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orders    = payload.find((p: any) => p.name === 'total_orders')
  const growthVal = growth ? Number(growth.value) : null

  return (
    <div style={{ background: '#0d0d14', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', minWidth: 160 }}>
      <p className="text-zinc-300 text-xs font-semibold mb-2">{label}</p>
      {revenue && (
        <p className="text-xs" style={{ color: ACCENT }}>
          {t.revenue_label}: <span className="font-bold">{fmt.currency(revenue.value)}</span>
        </p>
      )}
      {orders && (
        <p className="text-xs text-zinc-400">
          {t.orders_label}: <span className="font-medium text-zinc-200">{fmt.number(orders.value)}</span>
        </p>
      )}
      {growthVal !== null && (
        <p className="text-xs mt-1" style={{ color: growthVal >= 0 ? '#22c55e' : '#f87171' }}>
          MoM: <span className="font-bold">{growthVal >= 0 ? '+' : ''}{growthVal.toFixed(1)}%</span>
        </p>
      )}
    </div>
  )
}

// ── Revenue Tab ───────────────────────────────────────────────────────────────
function RevenueTab({ data, t }: { data: RevenueRow[]; t: Translations }) {
  // Filter out outlier months with < 100 orders to keep the chart clean
  const clean = data.filter(d => Number(d.total_orders) >= 100)

  return (
    <div className="flex flex-col gap-6">
      {/* Revenue + Growth combo */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm text-zinc-400 uppercase tracking-widest">{t.chart_monthly_revenue}</h3>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded inline-block" style={{ background: ACCENT }} />
              {t.revenue_label}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded inline-block border-t-2 border-dashed" style={{ borderColor: '#22c55e' }} />
              MoM %
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={clean} margin={{ top: 8, right: 48, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.2} />
                <stop offset="95%" stopColor={ACCENT} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="month_label" tick={{ fill: '#71717a', fontSize: 11 }} />
            <YAxis yAxisId="rev" tick={{ fill: '#71717a', fontSize: 11 }}
              tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <YAxis yAxisId="pct" orientation="right" tick={{ fill: '#71717a', fontSize: 11 }}
              tickFormatter={(v) => `${v.toFixed(0)}%`} domain={['auto', 'auto']} />
            <Tooltip content={(props) => <RevenueTooltip {...props} t={t} />} />
            <ReferenceLine yAxisId="pct" y={0} stroke="#3f3f5a" strokeDasharray="4 4" />
            <Area yAxisId="rev" type="monotone" dataKey="gross_revenue"
              stroke={ACCENT} strokeWidth={2} fill="url(#revGrad)" />
            <Line yAxisId="pct" type="monotone" dataKey="growth_pct"
              stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Orders bar chart colored by growth */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-6">
        <h3 className="text-sm text-zinc-400 uppercase tracking-widest mb-4">{t.chart_monthly_orders}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={clean} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="month_label" tick={{ fill: '#71717a', fontSize: 11 }} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip content={(props) => <RevenueTooltip {...props} t={t} />} />
            <Bar dataKey="total_orders" radius={[3, 3, 0, 0]}>
              {clean.map((entry, i) => (
                <Cell key={i} fill={Number(entry.growth_pct) >= 0 ? '#22c55e' : '#f87171'} opacity={0.75} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-zinc-600 mt-2">
          <span className="inline-block w-2 h-2 rounded-sm bg-green-500 mr-1" />green = MoM growth &nbsp;
          <span className="inline-block w-2 h-2 rounded-sm bg-red-400 mr-1" />red = MoM decline
        </p>
      </div>
    </div>
  )
}

// ── RFM Tab ───────────────────────────────────────────────────────────────────
function RFMTab({ data, t }: { data: RFMRow[]; t: Translations }) {
  const translated = data.map(row => ({
    ...row,
    segment: (t as Record<string, string>)[row.segment] ?? row.segment,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-6">
          <h3 className="text-sm text-zinc-400 uppercase tracking-widest mb-4">{t.chart_customer_share}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={translated} dataKey="customers" nameKey="segment"
                cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {translated.map((_, i) => <Cell key={i} fill={RFM_COLORS[i % RFM_COLORS.length]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0d0d14', border: `1px solid ${BORDER}`, borderRadius: 8 }}
                formatter={(v, name) => [fmt.number(Number(v)), String(name)]}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#a1a1aa' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-6">
          <h3 className="text-sm text-zinc-400 uppercase tracking-widest mb-4">{t.chart_revenue_by_segment}</h3>
          <div className="flex flex-col gap-3 mt-2">
            {translated.map((row, i) => {
              const maxRev = Math.max(...translated.map(d => Number(d.total_revenue)))
              const pct = (Number(row.total_revenue) / maxRev) * 100
              return (
                <div key={row.segment}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-300">{row.segment}</span>
                    <span className="text-zinc-500">{fmt.currency(row.total_revenue)}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: BORDER }}>
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: RFM_COLORS[i % RFM_COLORS.length] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {[t.col_segment, t.col_customers, t.col_share, t.col_revenue, t.col_avg_order, t.col_avg_recency, t.col_review].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {translated.map((row, i) => (
              <tr key={row.segment} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium" style={{ color: RFM_COLORS[i % RFM_COLORS.length] }}>{row.segment}</span>
                </td>
                <td className="px-4 py-3 text-zinc-300">{fmt.number(row.customers)}</td>
                <td className="px-4 py-3 text-zinc-400">{fmt.pct(row.pct)}</td>
                <td className="px-4 py-3 text-zinc-300">{fmt.currency(row.total_revenue)}</td>
                <td className="px-4 py-3 text-zinc-400">{fmt.currency(row.avg_order_value)}</td>
                <td className="px-4 py-3 text-zinc-400">{Number(row.avg_recency).toFixed(0)}d</td>
                <td className="px-4 py-3 text-zinc-400">{fmt.score(row.avg_review_score)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Cohort Tab ────────────────────────────────────────────────────────────────
function CohortTab({ data, t }: { data: CohortRow[]; t: Translations }) {
  const cohorts = [...new Set(data.map(r => r.cohort_label))]
  const maxIdx  = Math.max(...data.map(r => r.month_index))
  const indices = Array.from({ length: maxIdx + 1 }, (_, i) => i)

  const matrix: Record<string, Record<number, number>> = {}
  const cohortSize: Record<string, number> = {}
  data.forEach(row => {
    if (!matrix[row.cohort_label]) matrix[row.cohort_label] = {}
    matrix[row.cohort_label][row.month_index] = row.retention_rate
    cohortSize[row.cohort_label] = row.cohort_size
  })

  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
      <div className="p-6 pb-2">
        <h3 className="text-sm text-zinc-400 uppercase tracking-widest">{t.chart_cohort}</h3>
        <p className="text-xs text-zinc-600 mt-1">{t.cohort_sub}</p>
      </div>
      <div className="overflow-x-auto pb-4">
        <table className="text-xs min-w-max mx-6 mb-2">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 text-zinc-500 font-medium w-24">{t.col_cohort}</th>
              <th className="px-3 py-2 text-zinc-500 font-medium">{t.col_size}</th>
              {indices.map(i => (
                <th key={i} className="px-3 py-2 text-zinc-500 font-medium">M{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map(cohort => (
              <tr key={cohort}>
                <td className="px-3 py-1.5 text-zinc-400 font-medium">{cohort}</td>
                <td className="px-3 py-1.5 text-zinc-500 text-center">{fmt.number(cohortSize[cohort])}</td>
                {indices.map(idx => {
                  const rate    = matrix[cohort]?.[idx]
                  const rateNum = rate != null ? Number(rate) : null
                  const opacity = rateNum != null ? Math.max(0.08, rateNum / 100) : 0
                  return (
                    <td key={idx} className="px-3 py-1.5 text-center rounded"
                      style={{ background: rateNum != null ? `rgba(255,105,75,${opacity})` : 'transparent' }}>
                      {rateNum != null ? (
                        <span style={{ color: rateNum > 50 ? '#fff' : rateNum > 20 ? '#fca5a5' : '#6b7280' }}>
                          {rateNum.toFixed(1)}%
                        </span>
                      ) : <span className="text-zinc-800">—</span>}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Sellers Tab ───────────────────────────────────────────────────────────────
function SellersTab({ top, tiers, t }: { top: SellerRow[]; tiers: TierRow[]; t: Translations }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tiers.map(tier => (
          <div key={tier.seller_tier} style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest mb-1"
              style={{ color: TIER_COLORS[tier.seller_tier] ?? '#9ca3af' }}>
              {tier.seller_tier}
            </div>
            <div className="text-xl font-bold text-white">{fmt.number(tier.sellers)}</div>
            <div className="text-xs text-zinc-500 mt-0.5">{fmt.currency(tier.revenue)}</div>
          </div>
        ))}
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}` }} className="rounded-xl overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <h3 className="text-sm text-zinc-400 uppercase tracking-widest">{t.chart_top_sellers}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                {[t.col_seller_id, t.col_state, t.col_tier, t.col_customers, t.col_revenue, t.col_review, t.col_delivery, t.col_products].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top.map((s, i) => (
                <tr key={s.seller_id} style={{ borderBottom: `1px solid ${BORDER}` }} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-zinc-500 text-xs mr-2">{i + 1}.</span>
                    <span className="font-mono text-zinc-300 text-xs">{s.seller_id.slice(0, 8)}…</span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{s.state}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        color: TIER_COLORS[s.seller_tier] ?? '#9ca3af',
                        background: `${TIER_COLORS[s.seller_tier] ?? '#9ca3af'}15`,
                        border: `1px solid ${TIER_COLORS[s.seller_tier] ?? '#9ca3af'}30`,
                      }}>
                      {s.seller_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{fmt.number(s.total_orders)}</td>
                  <td className="px-4 py-3 text-zinc-300">{fmt.currency(s.gross_revenue)}</td>
                  <td className="px-4 py-3 text-zinc-400">{fmt.score(s.avg_review_score)}</td>
                  <td className="px-4 py-3 text-zinc-400">{fmt.pct(s.delivery_rate)}</td>
                  <td className="px-4 py-3 text-zinc-400">{s.unique_products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
type Tab = 'revenue' | 'rfm' | 'cohort' | 'sellers'

export default function Dashboard() {
  const [lang, setLang]       = useState<Lang>('en')
  const [tab, setTab]         = useState<Tab>('revenue')
  const [kpis, setKpis]       = useState<KPIs | null>(null)
  const [revenue, setRevenue] = useState<RevenueRow[]>([])
  const [rfm, setRfm]         = useState<RFMRow[]>([])
  const [cohort, setCohort]   = useState<CohortRow[]>([])
  const [sellers, setSellers] = useState<{ top: SellerRow[]; tiers: TierRow[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const t = T[lang]

  useEffect(() => {
    Promise.all([
      fetch('/api/kpis').then(r => r.json()),
      fetch('/api/revenue').then(r => r.json()),
      fetch('/api/rfm').then(r => r.json()),
      fetch('/api/cohort').then(r => r.json()),
      fetch('/api/sellers').then(r => r.json()),
    ]).then(([k, rev, rfmData, cohortData, sellerData]) => {
      if (k.error) throw new Error(k.error)
      setKpis(k); setRevenue(rev); setRfm(rfmData); setCohort(cohortData); setSellers(sellerData)
    }).catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'revenue', label: t.tab_revenue },
    { id: 'rfm',     label: t.tab_rfm     },
    { id: 'cohort',  label: t.tab_cohort  },
    { id: 'sellers', label: t.tab_sellers },
  ]

  return (
    <div className="min-h-screen text-white" style={{ background: '#0a0a0f' }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${BORDER}`, background: SURFACE }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">{t.title}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <LangSwitcher lang={lang} setLang={setLang} />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: error ? '#ef4444' : '#22c55e' }} />
              <span className="text-xs text-zinc-500">{error ? t.disconnected : t.live}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? <Loading /> : error ? <DBError message={error} t={t} /> : (
          <>
            {kpis && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <KPICard icon={ShoppingCart} label={t.kpi_orders}    value={fmt.number(kpis.total_orders)} />
                <KPICard icon={Users}        label={t.kpi_customers} value={fmt.number(kpis.total_customers)} />
                <KPICard icon={DollarSign}   label={t.kpi_revenue}   value={fmt.currency(kpis.gross_revenue)} />
                <KPICard icon={TrendingUp}   label={t.kpi_avg_order} value={fmt.currency(kpis.avg_order_value)} />
                <KPICard icon={Star}         label={t.kpi_review}    value={fmt.score(kpis.avg_review_score)} sub={t.kpi_review_sub} />
                <KPICard icon={Truck}        label={t.kpi_delivery}  value={fmt.pct(kpis.delivery_rate)} sub={t.kpi_delivery_sub} />
              </div>
            )}

            <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
              {TABS.map(tb => (
                <button key={tb.id} onClick={() => setTab(tb.id)}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                  style={{ background: tab === tb.id ? ACCENT : 'transparent', color: tab === tb.id ? '#fff' : '#71717a' }}>
                  {tb.label}
                </button>
              ))}
            </div>

            {tab === 'revenue' && revenue.length > 0 && <RevenueTab data={revenue} t={t} />}
            {tab === 'rfm'     && rfm.length > 0     && <RFMTab     data={rfm}     t={t} />}
            {tab === 'cohort'  && cohort.length > 0  && <CohortTab  data={cohort}  t={t} />}
            {tab === 'sellers' && sellers             && <SellersTab top={sellers.top} tiers={sellers.tiers} t={t} />}
          </>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-6 mt-8" style={{ borderTop: `1px solid ${BORDER}` }}>
        <p className="text-xs text-zinc-600">
          {t.footer} ·{' '}
          <a href="https://github.com/santiagomalak" className="hover:text-zinc-400 transition-colors">
            @santiagomalak
          </a>
        </p>
      </footer>
    </div>
  )
}
