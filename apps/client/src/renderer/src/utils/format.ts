export const formatCurrency = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined) return '0.00'
  return Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export const formatCurrencyWithPrefix = (amount: number | null | undefined): string => {
  return `LKR ${formatCurrency(amount)}`
}

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateFull = (date: string | Date | null | undefined): string => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-LK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatMonth = (month: number, year: number): string => {
  return new Date(year, month - 1).toLocaleDateString('en-LK', {
    month: 'long',
    year: 'numeric',
  })
}

export const formatDateInput = (date: string | Date | null | undefined): string => {
  if (!date) return ''
  return new Date(date).toISOString().split('T')[0]!
}

export const isOverdue = (dueDate: string | Date, amountDue: number): boolean => {
  return new Date(dueDate) < new Date() && amountDue > 0
}

export const todayISO = (): string => new Date().toISOString().split('T')[0]!
