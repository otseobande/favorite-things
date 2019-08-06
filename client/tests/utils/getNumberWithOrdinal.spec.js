import getNumberWithOrdinal from '../../src/utils/getNumberWithOrdinal';

describe('getNumberWithOrdinal', () => {
  it('should return number with ordinal', () => {
    expect(getNumberWithOrdinal(1)).toBe('1st');
    expect(getNumberWithOrdinal(2)).toBe('2nd');
    expect(getNumberWithOrdinal(3)).toBe('3rd');
    expect(getNumberWithOrdinal(4)).toBe('4th');
    expect(getNumberWithOrdinal(100)).toBe('100th');
  })
})
