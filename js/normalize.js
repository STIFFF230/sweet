export const norm = s => String(s ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
export const compact = s => norm(s).replace(/ /g, '');
export function matches(input, rule) {
  const alts = [...rule.alts, ...(rule.acceptPlainPink ? ['rosa', 'rosado', 'rosada'] : [])];
  return alts.some(a => compact(a) === compact(input)) || (rule.contains ?? []).some(parts => parts.every(p => norm(input).includes(norm(p))));
}
