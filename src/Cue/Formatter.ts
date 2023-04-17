import { Timings, TimeEntry, TrackList } from '../types';

export default class Formatter {
  formatPerformer(value: string) {
    return 'PERFORMER "' + value + '"\n';
  }

  formatTitle(value: string) {
    return 'TITLE "' + value + '"\n';
  }

  formatFilename(name: string, type: string) {
    return `FILE "${name}" ${type}\n`;
  }

  formatTracklist(tracklist: TrackList, regionsList: Timings, globalPerformer: string) {
    let output = '';
    for (var i = 0; i < tracklist.length; i++) {
      const row = tracklist[i];
      const performer = row.performer || globalPerformer;
      const time = regionsList[i] ? timeEntryToString(regionsList[i]) : row.time;

      output += '  TRACK ' + (row.track < 10 ? '0' + row.track : row.track) + ' AUDIO\n';
      output += '    PERFORMER "' + performer + '"\n';
      output += '    TITLE "' + row.title + '"\n';
      // when first track does not start at 00:00:00
      // "INDEX 00 00:00:00" line has to be the first index
      if (i === 0 && time !== '00:00:00') {
        output += '    INDEX 00 00:00:00\n';
      }
      output += '    INDEX 01 ' + time + '\n';
    }

    return output;
  }
}

export const timeEntryToString = (timeEntry: TimeEntry): string => {
  const mn = timeEntry.mn.toString(10).padStart(2, '0');
  const sc = timeEntry.sc.toString(10).padStart(2, '0');
  const fr = timeEntry.fr.toString(10).padStart(2, '0');
  return `${mn}:${sc}:${fr}`;
};
