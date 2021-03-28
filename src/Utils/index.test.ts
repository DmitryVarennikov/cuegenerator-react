import React from 'react';
import * as Utils from '.';

describe('Utils', () => {
  describe('replaceFileExt', () => {
    it('replace existing extension', () => {
      const actual = Utils.replaceFileExt('my sound file.mp3', '.cue');
      const expected = 'my sound file.cue';
      expect(actual).toBe(expected);
    });
    it('no extension', () => {
      const actual = Utils.replaceFileExt('my sound file', '.cue');
      const expected = 'my sound file.cue';
      expect(actual).toBe(expected);
    });
  });

  describe('makeCueFileName', () => {
    it('non-empty sound file name', () => {
      const actual = Utils.makeCueFileName('sound file name');
      const expected = 'sound file name.cue';
      expect(actual).toBe(expected);
    });
    it('empty sound file name', () => {
      const actual = Utils.makeCueFileName('');
      const expected = 'Untitled.cue';
      expect(actual).toBe(expected);
    });
  });
});
