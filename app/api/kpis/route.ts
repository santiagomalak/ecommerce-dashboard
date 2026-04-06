import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const [result] = await sql`
      SELECT
        COUNT(DISTINCT order_id)::int                        AS total_orders,
        COUNT(DISTINCT customer_id)::int                     AS total_customers,
        ROUND(SUM(order_revenue)::numeric, 2)                AS gross_revenue,
        ROUND(AVG(order_revenue)::numeric, 2)                AS avg_order_value,
        ROUND(AVG(review_score)::numeric, 2)                 AS avg_review_score,
        ROUND(
          100.0 * SUM(CASE WHEN is_delivered THEN 1 ELSE 0 END)
          / NULLIF(COUNT(*), 0), 1
        )                                                    AS delivery_rate
      FROM raw_intermediate.int_orders_enriched
      WHERE order_status = 'delivered'
    `
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
