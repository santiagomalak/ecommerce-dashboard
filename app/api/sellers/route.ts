export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        seller_id,
        state,
        seller_tier,
        total_orders::int,
        ROUND(gross_revenue::numeric, 2)       AS gross_revenue,
        ROUND(avg_review_score::numeric, 2)    AS avg_review_score,
        ROUND(delivery_rate::numeric, 1)::float AS delivery_rate,
        unique_products::int
      FROM raw_marts.mart_seller_performance
      ORDER BY gross_revenue DESC
      LIMIT 20
    `
    // Tier summary
    const tiers = await sql`
      SELECT
        seller_tier,
        COUNT(*)::int                              AS sellers,
        ROUND(SUM(gross_revenue)::numeric, 2)      AS revenue
      FROM raw_marts.mart_seller_performance
      GROUP BY seller_tier
      ORDER BY revenue DESC
    `
    return NextResponse.json({ top: rows, tiers })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
