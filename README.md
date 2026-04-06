# E-Commerce Analytics Dashboard — Olist Brazil

> End-to-end analytics platform built on 100k+ real Brazilian e-commerce orders.  
> Live demo → **[ecommerce-dashboard-puce.vercel.app](https://ecommerce-dashboard-puce.vercel.app)**

![Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Stack](https://img.shields.io/badge/PostgreSQL-Neon-4169e1?logo=postgresql&logoColor=white)
![Stack](https://img.shields.io/badge/dbt-1.8-ff694b?logo=dbt&logoColor=white)
![Stack](https://img.shields.io/badge/Recharts-2.x-22b5bf)
![Stack](https://img.shields.io/badge/i18n-EN%20%7C%20ES%20%7C%20PT-5c6bc0)

---

## Overview

Full-stack analytics dashboard that ingests the public **Olist Brazil** dataset (2016–2018) through a multi-layer dbt pipeline and exposes the results via a Next.js frontend with interactive charts and trilingual support.

### Key metrics surfaced
| Tab | What it shows |
|-----|---------------|
| **Revenue** | Monthly gross revenue + MoM growth % (ComposedChart dual Y-axis) |
| **Orders** | Volume trend with YoY color-coded bars |
| **RFM Segments** | 6 customer segments — Champions → Lost, with counts & revenue share |
| **Cohort Retention** | Heatmap matrix — month-by-month retention per acquisition cohort |
| **Sellers** | Top 20 sellers ranked by revenue, delivery rate & review score |

---

## Architecture

```
Kaggle CSV files
      │
      ▼
PostgreSQL (Neon Serverless)
      │
      ▼
dbt pipeline — 4 layers
  ├── staging/        (stg_orders, stg_customers, stg_order_items …)
  ├── intermediate/   (int_orders_enriched, int_customer_orders)
  └── marts/          (mart_revenue_monthly, mart_rfm_segments,
                        mart_cohort_retention, mart_seller_performance)
      │
      ▼
Next.js 14 API Routes  (/api/kpis · /api/revenue · /api/rfm · /api/cohort · /api/sellers)
      │
      ▼
React frontend (Recharts · Tailwind · Framer Motion)
```

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Database | **Neon** (serverless PostgreSQL) |
| Transformation | **dbt** 1.8 |
| Backend | **Next.js 14** App Router + API Routes |
| Charts | **Recharts** 2 |
| Styling | **Tailwind CSS** + **Framer Motion** |
| i18n | Custom `lib/i18n.ts` — EN 🇺🇸 / ES 🇦🇷 / PT 🇧🇷 |
| Deploy | **Vercel** |

---

## Local Setup

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database with the dbt models already run  
  *(see [ecommerce-data-platform](https://github.com/santiagomalak/ecommerce-data-platform) for the dbt project)*

### Steps

```bash
git clone https://github.com/santiagomalak/ecommerce-dashboard.git
cd ecommerce-dashboard
npm install
```

Create `.env.local`:
```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## dbt Models (source: ecommerce-data-platform)

| Model | Schema | Description |
|-------|--------|-------------|
| `mart_revenue_monthly` | `raw_marts` | Monthly revenue + order count |
| `mart_rfm_segments` | `raw_marts` | RFM scoring → 6 named segments |
| `mart_cohort_retention` | `raw_marts` | Retention matrix by `customer_unique_id` |
| `mart_seller_performance` | `raw_marts` | Revenue, delivery rate, review score per seller |

---

## Dataset

**Brazilian E-Commerce Public Dataset by Olist** — available on [Kaggle](https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce).  
~100k orders · 93k unique customers · Sep 2016 – Oct 2018.

---

## Related Repos

- **[ecommerce-data-platform](https://github.com/santiagomalak/ecommerce-data-platform)** — dbt project + ingestion scripts
- **[Portfolio](https://santiagomalak.is-a.dev/data-science)** — project card with context
