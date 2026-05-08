import type { MetricKey } from '@/types/metrics'

export const UNIT_LABELS: Record<string, string> = {
  days: 'días',
  hours: 'horas',
  visits: 'visitas',
}

export const METRIC_DESCRIPTIONS: Record<MetricKey, string> = {
  traffic: 'Visitas únicas al sitio de marketing.',
  leads_created: 'Nuevos leads captados en el período.',
  leads_qualified: 'Leads calificados por el equipo de ventas.',
  deals_created: 'Oportunidades de venta abiertas en el período.',
  deals_won: 'Deals cerrados y ganados en el período.',
  deals_lost: 'Deals cerrados y perdidos en el período.',
  avg_response_time_min: 'Tiempo promedio de primera respuesta del equipo de ventas a nuevos leads, en minutos.',
  avg_deal_cycle_days: 'Promedio de días desde apertura hasta cierre de un deal.',
  stale_deals: 'Deals abiertos con más de 60 días al cierre del día.',
  support_tickets_opened: 'Tickets de soporte abiertos en el período.',
  support_avg_resolution_hours: 'Tiempo promedio de resolución de tickets, en horas.',
}

/** Spanish labels following the PDF glossary terms */
export const METRIC_LABELS: Record<MetricKey, string> = {
  traffic: 'Visitas diarias',
  leads_created: 'Leads creados',
  leads_qualified: 'Leads calificados',
  deals_created: 'Deals creados',
  deals_won: 'Deals ganados',
  deals_lost: 'Deals perdidos',
  avg_response_time_min: 'Tiempo de respuesta',
  avg_deal_cycle_days: 'Deal cycle',
  stale_deals: 'Stale deals',
  support_tickets_opened: 'Tickets de soporte',
  support_avg_resolution_hours: 'Resolución promedio',
}
