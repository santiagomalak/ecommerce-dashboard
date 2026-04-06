export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`
      SELECT
        TO_CHAR(month, 'Mon ''YY')              AS month_label,
        TO_CHAR(month, 'YYYY-MM')               AS month_iso,
        total_orders::int,
        ROUND(gross_revenue::numeric, 0)::float AS gross_revenue,
        ROUND(avg_order_value::numeric, 2)::float AS avg_order_value,
        COALESCE(revenue_growth_pct, 0)::float  AS growth_pct
      FROM raw_marts.mart_monthly_revenue
      ORDER BY month
    `
    return NextResponse.json(rows)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
