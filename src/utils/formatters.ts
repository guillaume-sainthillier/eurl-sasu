/**
 * Format a number as French currency (EUR)
 */
export function formatCurrency(value: number | undefined): string {
  if (value === undefined) return '0 €'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

/**
 * Format a number as percentage
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)} %`
}

/**
 * Format a date timestamp to French locale
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}
