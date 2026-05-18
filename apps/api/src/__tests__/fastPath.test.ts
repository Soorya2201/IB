import { initFastPath, tryFastPath } from '../services/fastPath';

const TEST_MENU = [
  { id: 'classic-bistro-burger', name: 'Classic Bistro Burger' },
  { id: 'truffle-fries', name: 'Truffle Parmesan Fries' },
  { id: 'spicy-chicken-sandwich', name: 'Spicy Chicken Sandwich' },
  { id: 'mango-lassi', name: 'Mango Lassi' },
  { id: 'fresh-lemonade', name: 'Fresh Lemonade' },
];

beforeAll(() => initFastPath(TEST_MENU));

describe('tryFastPath', () => {
  it('matches add with numeric quantity', () => {
    const r = tryFastPath('add two burgers');
    expect(r.matched).toBe(true);
    expect(r.actions?.[0].tool).toBe('add_item');
    expect(r.actions?.[0].input.item_id).toBe('classic-bistro-burger');
    expect(r.actions?.[0].input.quantity).toBe(2);
  });

  it('matches add with article quantity', () => {
    const r = tryFastPath('add a spicy chicken sandwich');
    expect(r.matched).toBe(true);
    expect(r.actions?.[0].input.quantity).toBe(1);
  });

  it('matches remove', () => {
    const r = tryFastPath('remove the fries');
    expect(r.matched).toBe(true);
    expect(r.actions?.[0].tool).toBe('remove_item');
    expect(r.actions?.[0].input.item_id).toBe('truffle-fries');
  });

  it('matches clear cart', () => {
    const r = tryFastPath('clear my cart');
    expect(r.matched).toBe(true);
    expect(r.actions?.[0].tool).toBe('clear_cart');
  });

  it('matches view cart', () => {
    const r = tryFastPath("what's in my cart");
    expect(r.matched).toBe(true);
    expect(r.reply).toBe('__VIEW_CART__');
  });

  it('matches I\'d like with word quantity', () => {
    const r = tryFastPath("I'd like three mango lassis");
    expect(r.matched).toBe(true);
    expect(r.actions?.[0].input.quantity).toBe(3);
  });

  it('returns unmatched for unknown item', () => {
    const r = tryFastPath('add a xyz-unknown-item-123');
    expect(r.matched).toBe(false);
  });

  it('returns unmatched for recommendation request', () => {
    const r = tryFastPath('can you recommend something');
    expect(r.matched).toBe(false);
  });
});
