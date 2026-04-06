export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        segment,
        COUNT(*)::int                                   AS customers,
        ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1)::float AS pct,
        ROUND(SUM(total_revenue)::numeric, 2)           AS total_revenue,
        ROUND(AVG(avg_order_value)::numeric, 2)         AS avg_order_value,
        ROUND(AVG(recency_days)::numeric, 1)::float     AS avg_recency,
        ROUND(AVG(avg_review_score)::numeric, 2)::float AS avg_review_score
      FROM raw_marts.mart_rfm_segments
      GROUP BY segment
      ORDER BY total_revenue DESC
    `
    return NextResponse.json(rows)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
