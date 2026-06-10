/**
 * Formata tempo em horas para exibição
 * Se > 48h, converte para dias
 */
export function formatHoursAsTimeString(hours: number): string {
  if (hours <= 48) {
    return `${Math.round(hours)}h`;
  }
  const days = Math.round(hours / 24 * 10) / 10;
  return days === Math.floor(days) 
    ? `${Math.floor(days)}d` 
    : `${days}d`;
}

/**
 * Calcula diferença em horas e retorna como string formatada
 */
export function formatTimeDifference(from: string, to: string): string {
  const d1 = new Date(from);
  const d2 = new Date(to);
  const hours = Math.max(0, (d2.getTime() - d1.getTime()) / (1000 * 60 * 60));
  return formatHoursAsTimeString(hours);
}
