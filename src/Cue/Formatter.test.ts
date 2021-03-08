import React from 'react';
import { RegionsList, TrackList } from '../types';
import Formatter from './Formatter';

const formatter = new Formatter();
describe('Formatter', () => {
  //   let formatter: Formatter | undefined;
  //   beforeAll(() => {

  //   });
  test('formatPerformer', () => {
    const actual = formatter.formatPerformer('Bobina');
    const expected = 'PERFORMER "Bobina"\n';
    expect(actual).toBe(expected);
  });
  test('formatTitle', () => {
    const actual = formatter.formatTitle('Russia Goes Clubbing');
    const expected = 'TITLE "Russia Goes Clubbing"\n';
    expect(actual).toBe(expected);
  });
  test('formatFilename', () => {
    const actual = formatter.formatFilename('Bobina - Russia Goes Clubbing #272.cue', 'WAVE');
    const expected = 'FILE "Bobina - Russia Goes Clubbing #272.cue" WAVE\n';
    expect(actual).toBe(expected);
  });
  test('formatTracklist_1', () => {
    const tracklist: TrackList = [{ track: 1, performer: '', title: 'Miami Echoes', time: '02:41:00' }];
    const regionsList: RegionsList = [];
    const globalPerformer = 'Bobina';

    var actual = formatter.formatTracklist(tracklist, regionsList, globalPerformer);
    var expected = '';
    expected += '  TRACK 01 AUDIO\n';
    expected += '    PERFORMER "Bobina"\n';
    expected += '    TITLE "Miami Echoes"\n';
    expected += '    INDEX 00 00:00:00\n';
    expected += '    INDEX 01 02:41:00\n';
    expect(actual).toBe(expected);
  });
  test('formatTracklist_2', () => {
    const tracklist: TrackList = [{ track: 1, performer: '', title: 'Miami Echoes', time: '' }];
    const regionsList: RegionsList = ['02:41:00'];
    const globalPerformer = 'Bobina';

    var actual = formatter.formatTracklist(tracklist, regionsList, globalPerformer);
    var expected = '';
    expected += '  TRACK 01 AUDIO\n';
    expected += '    PERFORMER "Bobina"\n';
    expected += '    TITLE "Miami Echoes"\n';
    expected += '    INDEX 00 00:00:00\n';
    expected += '    INDEX 01 02:41:00\n';
    expect(actual).toBe(expected);
  });
});
