import {isValueNumber} from './isValueNumber'

describe('isNumber', () => {
  test.each([
    ['123', true],
    ['123.45', true],
    [123, true],
    [0, true],
    ['abc', false],
    ['123abc', false],
    ['01-abc', false],
    ['', false], 
    [undefined, false],
    [null, false],
  
  ])('should return %s for input %p', (input, expected) => {
    expect(isValueNumber(input)).toBe(expected);
  });
});
