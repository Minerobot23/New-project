export type Purchase = { transactionId: string; value: number; currency: string };

export function validPurchase(value: unknown): value is Purchase {
  if (!value || typeof value !== "object") return false;
  const p = value as Purchase;
  return /^[a-f0-9-]{36}$/i.test(p.transactionId) && Number.isFinite(p.value) && p.value > 0 && /^[A-Z]{3}$/.test(p.currency);
}
