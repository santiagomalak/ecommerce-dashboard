import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const rows = await sql`
      SELECT
        TO_CHAR(cohort_month, 'Mon ''YY') AS cohort_label,
        cohort_size::int,
        month_index::int,
        retention_rate::float
      FROM raw_marts.mart_cohort_retention
      WHERE month_index <= 6
      ORDER BY cohort_month, month_index
    `
    return NextResponse.json(rows)
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
