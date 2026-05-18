import { initFastPath, disambiguate } from '../services/fastPath';

const TEST_MENU = [
  { id: 'wagyu-smash-burger', name: 'Wagyu Smash Burger' },
  { id: 'truffle-fries', name: 'Truffle Parmesan Fries' },
  { id: 'fresh-lemonade', name: 'Fresh Lemonade' },
  { id: 'classic-bistro-burger', name: 'Classic Bistro Burger' },
];

beforeAll(() => initFastPath(TEST_MENU));

describe('disambiguate', () => {
  it('matches wagon burger to wagyu-smash-burger', () => {
    const r = disambiguate('wagon burger');
    expect(r.found).toBe(true);
    if (r.found) expect(r.itemId).toBe('wagyu-smash-burger');
  });

  it('matches truffle fry to truffle-fries', () => {
    const r = disambiguate('truffle fry');
    expect(r.found).toBe(true);
    if (r.found) expect(r.itemId).toBe('truffle-fries');
  });

  it('returns not found for completely unknown input', () => {
    const r = disambiguate('completely unknown xyz123');
    expect(r.found).toBe(false);
  });

  it('returns not found for empty string', () => {
    const r = disambiguate('');
    expect(r.found).toBe(false);
  });

  it('exact item name returns found', () => {
    const r = disambiguate('Fresh Lemonade');
    expect(r.found).toBe(true);
    if (r.found) expect(r.itemId).toBe('fresh-lemonade');
  });

  it('single matching word respects threshold', () => {
    const r = disambiguate('burger', 0.2);
    expect(r.found).toBe(true);
  });
});
