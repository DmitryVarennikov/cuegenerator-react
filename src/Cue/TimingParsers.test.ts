import { standard } from './TimingParsers';

describe('TimingParsers', () => {
  describe('standard', () => {
    it('DD:DD:DD', () => {
      const actual = standard(' 01:23:45 ');
      expect(actual).toEqual({ fr: 45, mn: 1, sc: 23 });
    });
    it('D:DD:DD', () => {
      const actual = standard(' 0:05:47 ');
      expect(actual).toEqual({ fr: 47, mn: 0, sc: 5 });
    });
  });
});
