// Usage tracking for free tier limits
// In production, use Redis or a database

const DAILY_FREE_LIMIT = 5
const usageStore: Record<string, { count: number; date: string }> = {}

export function getUsageKey(identifier: string): string {
  return identifier || 'anonymous'
}

export function checkUsageLimit(identifier: string, isPro: boolean): { allowed: boolean; remaining: number } {
  if (isPro) {
    return { allowed: true, remaining: Infinity }
  }

  const key = getUsageKey(identifier)
  const today = new Date().toISOString().split('T')[0]
  const usage = usageStore[key]

  if (!usage || usage.date !== today) {
    return { allowed: true, remaining: DAILY_FREE_LIMIT }
  }

  const remaining = DAILY_FREE_LIMIT - usage.count
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) }
}

export function incrementUsage(identifier: string): void {
  const key = getUsageKey(identifier)
  const today = new Date().toISOString().split('T')[0]
  const usage = usageStore[key]

  if (!usage || usage.date !== today) {
    usageStore[key] = { count: 1, date: today }
  } else {
    usageStore[key].count++
  }
}

export function getUsageStats(identifier: string): { used: number; limit: number; resetsAt: string } {
  const key = getUsageKey(identifier)
  const today = new Date().toISOString().split('T')[0]
  const usage = usageStore[key]

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  return {
    used: usage?.date === today ? usage.count : 0,
    limit: DAILY_FREE_LIMIT,
    resetsAt: tomorrow.toISOString(),
  }
}
