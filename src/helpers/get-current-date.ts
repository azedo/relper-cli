export default function getCurrentDate(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth() + 1
  const d = now.getDate()

  return `${y}-${(m < 10 ? '0' : '') + m}-${(d < 10 ? '0' : '') + d}`
}
