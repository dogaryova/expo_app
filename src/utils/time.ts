
export function timeAgoRu(iso: string, now: Date = new Date()): string {
  const d = new Date(iso);
  const diff = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 1000));

  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)} мин`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} д`;

  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function ruPlural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (lastDigit > 1 && lastDigit < 5) return forms[1];
  if (lastDigit === 1) return forms[0];
  return forms[2];
}
