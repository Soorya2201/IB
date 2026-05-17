// Strip the function out of useTTS.ts for testing — since it's not exported,
// inline it here for the test (copy the exact implementation):

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(?!\s)([^*\n]+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/>\s/g, '');
}

describe('stripMarkdown', () => {
  it('removes bold markdown', () => {
    expect(stripMarkdown('**bold text**')).toBe('bold text');
  });
  it('removes italic markdown', () => {
    expect(stripMarkdown('*italic*')).toBe('italic');
  });
  it('removes inline code', () => {
    expect(stripMarkdown('`code`')).toBe('code');
  });
  it('passes through normal text', () => {
    expect(stripMarkdown('normal text')).toBe('normal text');
  });
  it('strips mixed markdown from a real Claude response', () => {
    const input = '**Two** truffle fries added! `$16.00` total.';
    const expected = 'Two truffle fries added! $16.00 total.';
    expect(stripMarkdown(input)).toBe(expected);
  });
});
