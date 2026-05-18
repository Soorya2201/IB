export interface FastPathResult {
  matched: boolean;
  actions?: Array<{ tool: string; input: Record<string, unknown>; status: 'applied' }>;
  reply?: string;
}

let menuItems: Array<{ id: string; name: string }> = [];

export function initFastPath(items: Array<{ id: string; name: string }>) {
  menuItems = items;
}

function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

// Naive singular: strip trailing 's', 'es', 'ies' → 'y'
function singular(s: string): string {
  if (s.endsWith('ies')) return s.slice(0, -3) + 'y';
  if (s.endsWith('es') && s.length > 3) return s.slice(0, -2);
  if (s.endsWith('s') && s.length > 2) return s.slice(0, -1);
  return s;
}

function findItemId(query: string): string | null {
  const q = normalise(query);
  const qs = singular(q);

  const exact = menuItems.find(m => m.id === q || m.id === qs);
  if (exact) return exact.id;

  const nameMatch = menuItems.find(m => {
    const n = normalise(m.name);
    const ns = singular(n);
    return n.includes(q) || n.includes(qs) ||
           q.includes(n)  || qs.includes(n) ||
           q.includes(ns) || qs.includes(ns);
  });
  return nameMatch?.id ?? null;
}

const ADD_PATTERN = /^(?:add|i(?:'d| would)? ?like|can i (?:get|have)|give me|get me)\s+(\d+|a|an|one|two|three|four|five)?\s*(.+?)(?:\s+please)?$/i;
const REMOVE_PATTERN = /^(?:remove|delete|take off|cancel|drop)\s+(?:the\s+)?(?:\d+\s+)?(.+?)(?:\s+please)?$/i;
const CLEAR_PATTERN = /^(?:clear|empty|reset|start over|remove everything)(?: my)?(?: cart| order)?$/i;
const VIEW_PATTERN = /^(?:what(?:'s| is) in(?: my)? cart|show(?: my)? cart|view(?: my)? cart|cart summary)$/i;
const QUANTITY_WORDS: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5 };

export function tryFastPath(message: string): FastPathResult {
  const msg = message.trim();
  if (CLEAR_PATTERN.test(msg)) {
    return { matched: true, actions: [{ tool: 'clear_cart', input: { confirm: true }, status: 'applied' }], reply: "Done — your cart has been cleared." };
  }
  if (VIEW_PATTERN.test(msg)) {
    return { matched: true, actions: [], reply: '__VIEW_CART__' };
  }
  const removeMatch = msg.match(REMOVE_PATTERN);
  if (removeMatch) {
    const itemId = findItemId(removeMatch[1]);
    if (itemId) {
      return { matched: true, actions: [{ tool: 'remove_item', input: { item_id: itemId }, status: 'applied' }], reply: `Removed from your cart.` };
    }
  }
  const addMatch = msg.match(ADD_PATTERN);
  if (addMatch) {
    const rawQty = (addMatch[1] ?? '1').toLowerCase();
    const quantity = (QUANTITY_WORDS[rawQty] ?? parseInt(rawQty, 10)) || 1;
    const itemId = findItemId(addMatch[2]);
    if (itemId) {
      const item = menuItems.find(m => m.id === itemId);
      return { matched: true, actions: [{ tool: 'add_item', input: { item_id: itemId, quantity }, status: 'applied' }], reply: `Added ${quantity}× ${item?.name ?? itemId} to your cart.` };
    }
  }
  return { matched: false };
}

export function disambiguate(transcript: string, threshold = 0.2):
  | { found: true; itemId: string; itemName: string; original: string }
  | { found: false; original: string } {
  const q = transcript.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  if (!q) return { found: false, original: transcript };

  function jaccard(a: string, b: string): number {
    const setA = new Set(a.split(' ').filter(Boolean));
    const setB = new Set(b.split(' ').filter(Boolean));
    const intersection = [...setA].filter(x => setB.has(x)).length;
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : intersection / union;
  }

  let bestScore = 0;
  let bestItem: { id: string; name: string } | null = null;
  for (const item of menuItems) {
    const score = jaccard(q, item.name.toLowerCase().replace(/[^a-z0-9\s]/g, ''));
    if (score > bestScore) { bestScore = score; bestItem = item; }
  }
  if (bestItem && bestScore >= threshold) {
    return { found: true, itemId: bestItem.id, itemName: bestItem.name, original: transcript };
  }
  return { found: false, original: transcript };
}
