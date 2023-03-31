import { left, right } from './either';

describe('Either', () => {
  describe('left', () => {
    test('When isLeft() is called, should return true', () => {
      const stringOrNumber = left<string, number>('left value');
      expect(stringOrNumber.isLeft()).toBe(true);
    });

    test('When isRight() is called, should return false', () => {
      const stringOrNumber = left<string, number>('still left value');
      expect(stringOrNumber.isRight()).toBe(false);
    });
  });

  describe('right', () => {
    test('When isLeft() is called, should return false', () => {
      const stringOrNumber = right<string, number>(1);
      expect(stringOrNumber.isLeft()).toBe(false);
    });

    test('When isRight() is called, should return true', () => {
      const stringOrNumber = right<string, number>(1);
      expect(stringOrNumber.isRight()).toBe(true);
    });
  });
});
