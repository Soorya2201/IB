interface MockPattern {
  keywords: string[];
  actions: object[];
  reply: string;
}

const PATTERNS: MockPattern[] = [
  {
    keywords: ['burger'],
    actions: [{ name: 'add_item', input: { item_id: 'classic-bistro-burger', quantity: 1 }, status: 'applied' }],
    reply: "Voilà — one Classic Bistro Burger is on its way. Can I get you a side with that?",
  },
  {
    keywords: ['fries', 'truffle'],
    actions: [{ name: 'add_item', input: { item_id: 'truffle-fries', quantity: 1 }, status: 'applied' }],
    reply: "Perfect. Truffle fries added. A great call.",
  },
  {
    keywords: ['remove', 'cancel', 'clear', 'start over'],
    actions: [{ name: 'clear_cart', input: { confirm: true }, status: 'applied' }],
    reply: "Done — I've cleared your cart. Ready to start fresh?",
  },
];

const DEFAULT_REPLY = "I'd be happy to help with your order. What sounds good today?";

function drip(sendEvent: (d: object) => void, text: string): Promise<void> {
  return new Promise(resolve => {
    let i = 0;
    const iv = setInterval(() => {
      if (i >= text.length) { clearInterval(iv); resolve(); return; }
      sendEvent({ type: 'delta', text: text[i] });
      i++;
    }, 20);
  });
}

export async function handleMockChat(
  lastUserMessage: string,
  sendEvent: (data: object) => void,
): Promise<void> {
  const lower = lastUserMessage.toLowerCase();
  const match = PATTERNS.find(p => p.keywords.some(k => lower.includes(k)));

  if (match && match.actions.length > 0) {
    sendEvent({ type: 'actions', actions: match.actions });
  }

  const reply = match ? match.reply : DEFAULT_REPLY;
  await drip(sendEvent, reply);
  sendEvent({ type: 'done' });
}
