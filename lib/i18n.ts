export type Lang = 'en' | 'es' | 'pt'

export const LANGUAGES: { code: Lang; flag: string; label: string }[] = [
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'es', flag: '🇦🇷', label: 'ES' },
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
]

export const T = {
  en: {
    // Header
    title: 'E-Commerce Analytics',
    subtitle: 'Olist · Brazilian marketplace · dbt + PostgreSQL',
    live: 'Live',
    disconnected: 'Disconnected',

    // KPIs
    kpi_orders: 'Orders',
    kpi_customers: 'Customers',
    kpi_revenue: 'Revenue',
    kpi_avg_order: 'Avg Order',
    kpi_review: 'Review',
    kpi_review_sub: 'out of 5.0',
    kpi_delivery: 'Delivery',
    kpi_delivery_sub: 'on-time rate',

    // Tabs
    tab_revenue: 'Revenue',
    tab_rfm: 'RFM Segments',
    tab_cohort: 'Cohort',
    tab_sellers: 'Sellers',

    // Revenue tab
    chart_monthly_revenue: 'Monthly Gross Revenue',
    chart_monthly_orders: 'Monthly Orders',
    revenue_label: 'Revenue',
    orders_label: 'Orders',

    // RFM tab
    chart_customer_share: 'Customer Share by Segment',
    chart_revenue_by_segment: 'Revenue by Segment',
    col_segment: 'Segment',
    col_customers: 'Customers',
    col_share: 'Share',
    col_revenue: 'Revenue',
    col_avg_order: 'Avg Order',
    col_avg_recency: 'Avg Recency',
    col_review: 'Review',

    // Cohort tab
    chart_cohort: 'Cohort Retention Matrix',
    cohort_sub: '% of customers still active N months after first purchase',
    col_cohort: 'Cohort',
    col_size: 'Size',

    // Sellers tab
    chart_top_sellers: 'Top 20 Sellers by Revenue',
    col_seller_id: 'Seller ID',
    col_state: 'State',
    col_tier: 'Tier',
    col_delivery: 'Delivery',
    col_products: 'Products',

    // Error
    db_error_title: 'Database not connected',
    db_error_hint: 'Set DATABASE_URL in your environment variables to connect to Neon PostgreSQL.',

    // Footer
    footer: 'Built with Next.js 14 · Neon PostgreSQL · dbt · Recharts',

    // Segments (from DB)
    Champions: 'Champions',
    'Loyal Customers': 'Loyal Customers',
    'New Customers': 'New Customers',
    'Potential Loyalists': 'Potential Loyalists',
    'Recent Customers': 'Recent Customers',
    'At Risk': 'At Risk',
    'Cannot Lose Them': 'Cannot Lose Them',
    Lost: 'Lost',
    'Need Attention': 'Need Attention',
  },

  es: {
    title: 'Análisis de E-Commerce',
    subtitle: 'Olist · Marketplace brasileño · dbt + PostgreSQL',
    live: 'En vivo',
    disconnected: 'Desconectado',

    kpi_orders: 'Pedidos',
    kpi_customers: 'Clientes',
    kpi_revenue: 'Ingresos',
    kpi_avg_order: 'Ticket Promedio',
    kpi_review: 'Calificación',
    kpi_review_sub: 'sobre 5.0',
    kpi_delivery: 'Entregas',
    kpi_delivery_sub: 'tasa a tiempo',

    tab_revenue: 'Ingresos',
    tab_rfm: 'Segmentos RFM',
    tab_cohort: 'Cohortes',
    tab_sellers: 'Vendedores',

    chart_monthly_revenue: 'Ingresos Brutos Mensuales',
    chart_monthly_orders: 'Pedidos Mensuales',
    revenue_label: 'Ingresos',
    orders_label: 'Pedidos',

    chart_customer_share: 'Participación por Segmento',
    chart_revenue_by_segment: 'Ingresos por Segmento',
    col_segment: 'Segmento',
    col_customers: 'Clientes',
    col_share: 'Participación',
    col_revenue: 'Ingresos',
    col_avg_order: 'Ticket Prom.',
    col_avg_recency: 'Recencia Prom.',
    col_review: 'Calificación',

    chart_cohort: 'Matriz de Retención de Cohortes',
    cohort_sub: '% de clientes activos N meses después de su primera compra',
    col_cohort: 'Cohorte',
    col_size: 'Tamaño',

    chart_top_sellers: 'Top 20 Vendedores por Ingresos',
    col_seller_id: 'ID Vendedor',
    col_state: 'Estado',
    col_tier: 'Nivel',
    col_delivery: 'Entregas',
    col_products: 'Productos',

    db_error_title: 'Base de datos no conectada',
    db_error_hint: 'Configurá DATABASE_URL en las variables de entorno para conectarte a Neon PostgreSQL.',

    footer: 'Construido con Next.js 14 · Neon PostgreSQL · dbt · Recharts',

    Champions: 'Campeones',
    'Loyal Customers': 'Clientes Fieles',
    'New Customers': 'Nuevos Clientes',
    'Potential Loyalists': 'Leales Potenciales',
    'Recent Customers': 'Clientes Recientes',
    'At Risk': 'En Riesgo',
    'Cannot Lose Them': 'No Perder',
    Lost: 'Perdidos',
    'Need Attention': 'Necesitan Atención',
  },

  pt: {
    title: 'Análise de E-Commerce',
    subtitle: 'Olist · Marketplace brasileiro · dbt + PostgreSQL',
    live: 'Ao vivo',
    disconnected: 'Desconectado',

    kpi_orders: 'Pedidos',
    kpi_customers: 'Clientes',
    kpi_revenue: 'Receita',
    kpi_avg_order: 'Ticket Médio',
    kpi_review: 'Avaliação',
    kpi_review_sub: 'de 5.0',
    kpi_delivery: 'Entregas',
    kpi_delivery_sub: 'taxa no prazo',

    tab_revenue: 'Receita',
    tab_rfm: 'Segmentos RFM',
    tab_cohort: 'Coortes',
    tab_sellers: 'Vendedores',

    chart_monthly_revenue: 'Receita Bruta Mensal',
    chart_monthly_orders: 'Pedidos Mensais',
    revenue_label: 'Receita',
    orders_label: 'Pedidos',

    chart_customer_share: 'Participação por Segmento',
    chart_revenue_by_segment: 'Receita por Segmento',
    col_segment: 'Segmento',
    col_customers: 'Clientes',
    col_share: 'Participação',
    col_revenue: 'Receita',
    col_avg_order: 'Ticket Méd.',
    col_avg_recency: 'Recência Méd.',
    col_review: 'Avaliação',

    chart_cohort: 'Matriz de Retenção de Coortes',
    cohort_sub: '% de clientes ativos N meses após a primeira compra',
    col_cohort: 'Coorte',
    col_size: 'Tamanho',

    chart_top_sellers: 'Top 20 Vendedores por Receita',
    col_seller_id: 'ID Vendedor',
    col_state: 'Estado',
    col_tier: 'Nível',
    col_delivery: 'Entregas',
    col_products: 'Produtos',

    db_error_title: 'Banco de dados não conectado',
    db_error_hint: 'Configure DATABASE_URL nas variáveis de ambiente para conectar ao Neon PostgreSQL.',

    footer: 'Construído com Next.js 14 · Neon PostgreSQL · dbt · Recharts',

    Champions: 'Campeões',
    'Loyal Customers': 'Clientes Fiéis',
    'New Customers': 'Novos Clientes',
    'Potential Loyalists': 'Leais em Potencial',
    'Recent Customers': 'Clientes Recentes',
    'At Risk': 'Em Risco',
    'Cannot Lose Them': 'Não Perder',
    Lost: 'Perdidos',
    'Need Attention': 'Precisam de Atenção',
  },
} satisfies Record<Lang, Record<string, string>>

export type Translations = typeof T.en
