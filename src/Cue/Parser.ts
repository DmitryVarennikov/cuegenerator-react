import { Timings, TimeEntry, TrackList } from '../types';
import { timeEntryToString } from './Formatter';
import { adobeAudition, audacity, soundforge, standard, winampNero } from './TimingParsers';

export class ParserHelper {
  // that's how we tell performer and title apart
  private titlePerformerSeparators = [
    ' - ', // 45 hyphen-minus
    ' – ', // 8211 en dash
    ' ‒ ', // 8210 figure dash
    ' — ', // 8212 em dash
    ' ― ', // 8213 horizontal bar
  ];
  splitTitlePerformer(value: string) {
    // `foreach` and `switch` are toooooooooo slow!
    let split = [],
      performer = '',
      title = '';

    if (-1 !== value.search(this.titlePerformerSeparators[0])) {
      split = value.split(this.titlePerformerSeparators[0]);
    } else if (-1 !== value.search(this.titlePerformerSeparators[1])) {
      split = value.split(this.titlePerformerSeparators[1]);
    } else if (-1 !== value.search(this.titlePerformerSeparators[2])) {
      split = value.split(this.titlePerformerSeparators[2]);
    } else if (-1 !== value.search(this.titlePerformerSeparators[3])) {
      split = value.split(this.titlePerformerSeparators[3]);
    } else if (-1 !== value.search(this.titlePerformerSeparators[4])) {
      split = value.split(this.titlePerformerSeparators[4]);
    } else {
      split = [value];
    }

    // if string wasn't split yet then we get just a title (performer assumed to be the global one)
    if (1 === split.length) {
      performer = '';
      title = split.shift() || '';
    } else {
      performer = split.shift() || '';
      title = split.join(' ');
    }

    return {
      performer: performer.trim(),
      title: title.trim(),
    };
  }

  separateTime(value: string) {
    var time = '',
      residue = '';

    // ask to increase minutes up to 9999 referred to the "h:m" not "h:m:f" format
    // but I still increased "h:m:f" up to 999 hours just in case
    // https://github.com/dVaffection/cuegenerator/issues/14

    //                          01.     9999:53 | 999:02:28
    var pattern = /(?:\d{2}\.)?\[?((?:\d{1,3}:)?\d{1,4}:\d{2})\]?.*/i;
    var matches = value.match(pattern);

    if (matches && matches[1]) {
      time = matches[1].trim();
      // residue = value.substring(value.indexOf(matches[1]) + matches[1].length).trim();
      residue = value.replace(time, '').trim();
    } else {
      residue = value.trim();
    }

    return {
      time: time,
      residue: residue,
    };
  }

  /**
   * Accept time in format either hr:mn:sc or mn:sc
   *
   * @param {String}
   * @returns mn:sc:fr
   */
  castTime(value: string) {
    let castTime = '00:00:00';
    value = value.trim();

    const pattern = /^\d{1,4}:\d{2}:\d{2}$/;
    const matches = value.match(pattern);
    if (matches) {
      const times = value.split(':');
      const hrParsed = parseInt(times[0], 10);
      const mnParsed = parseInt(times[1], 10);
      const sc = times[2].padStart(2, '0');
      const mn = String(hrParsed * 60 + mnParsed).padStart(2, '0');
      castTime = mn + ':' + sc + ':00';
    } else {
      const pattern = /(^\d{1,4}):(\d{2})$/;
      const matches = value.match(pattern);
      if (matches) {
        const mn = matches[1].padStart(2, '0');
        const sc = matches[2].padStart(2, '0');
        castTime = `${mn}:${sc}:00`;
      }
    }

    return castTime;
  }

  cleanOffTime(value: string) {
    var pattern = /^(?:\]? )?(?:\d{2}\)?\.? )?(.*)$/i;
    var matches = value.match(pattern);

    if (matches && matches[1]) {
      value = matches[1];
    }

    return value;
  }

  removeDoubleQuotes(value: string) {
    return value.replace(/"/g, '');
  }

  replaceDoubleQuotes(value: string) {
    return value.replace(/"/g, "'");
  }
}

export default class Parser {
  static readonly regionsListParsers = [adobeAudition, audacity, soundforge, winampNero, standard];

  constructor(readonly helper: ParserHelper) {}

  parsePerformer(v: string): string {
    return v.trim();
  }
  parseTitle(v: string): string {
    return v.trim();
  }
  parseFileName(v: string): string {
    return v.trim();
  }
  parseTrackList(value: string): TrackList {
    const trackList = [];
    let time, performer, title;

    const contentInLines = value.split('\n');
    for (let i = 0, track = 1; i < contentInLines.length; i++, track++) {
      const row = contentInLines[i].trim();
      if (!row.length) {
        track--;
        continue;
      }

      const performerTitle = this.helper.splitTitlePerformer(row);

      if (performerTitle.performer) {
        const timePerformer = this.helper.separateTime(performerTitle.performer);
        time = this.helper.castTime(timePerformer.time);
        performer = this.helper.cleanOffTime(timePerformer.residue);
        title = performerTitle.title;
      } else {
        performer = '';
        const timeTitle = this.helper.separateTime(performerTitle.title);
        time = this.helper.castTime(timeTitle.time);
        title = this.helper.cleanOffTime(timeTitle.residue);
      }

      performer = this.helper.replaceDoubleQuotes(performer);
      title = this.helper.replaceDoubleQuotes(title);

      trackList.push({
        track,
        performer,
        title,
        time,
      });
    }

    return trackList;
  }

  parseTimings(value: string): Timings {
    const contents = value.split('\n');

    // define a parser
    let regionsListParser: typeof Parser.regionsListParsers[0] | undefined;
    for (const parser of Parser.regionsListParsers) {
      const timeEntry = parser(contents[0] || '');
      if (timeEntry) {
        regionsListParser = parser;
        break;
      }
    }

    if (regionsListParser === undefined) return [];

    // apply the parser for every line
    return contents
      .map((row) => regionsListParser!(row))
      .filter((timeEntry): timeEntry is TimeEntry => timeEntry !== undefined);
  }
}
