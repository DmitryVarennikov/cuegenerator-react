import { RegionsList, TrackList } from '../types';

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
    var pattern = /^(?:\d{2}\.)?\[?((?:\d{1,3}:)?\d{1,4}:\d{2})\]?.*$/i;
    var matches = value.match(pattern);
    if (matches && matches[1]) {
      time = matches[1].trim();
      residue = value.substring(value.indexOf(matches[1]) + matches[1].length).trim();
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
  private helper: ParserHelper;

  constructor(helper: ParserHelper) {
    this.helper = helper;
  }

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

  parseRegionsList(value: string): RegionsList {
    const regionsList: RegionsList = [];
    let matches;
    var contents = value.split('\n');

    for (let i = 0; i < contents.length; i++) {
      const row = contents[i].trim();

      // Adobe Audition
      matches = row.match(/(\d{1,3}):(\d{2}).(\d{3,6})/i);
      if (null != matches) {
        const mn = Number(matches[1]);
        // do not Number seconds so the value preserves a leading zero (for less than 10)
        // and we don't use it in numeric calculations anyway
        const sc = matches[2];
        const ms = Number(matches[3]);
        const fr = Math.floor(parseFloat(0 + '.' + ms) * 75);

        const timeEntry = mn + ':' + sc + ':' + fr;
        regionsList.push(timeEntry);
        continue;
      }

      // Soundforge or Audition
      matches = row.match(/(\d{2}:\d{2}:\d{2}[\.,:]\d{2})/i);
      if (null != matches) {
        let time = matches[0].split(':');
        const hr = time.shift() || '0';
        let mn: string | number = time.shift() || '0';

        // frames can be separated by .(dot) or :(colon) or ,(comma)
        if (time.length > 1) {
          var sc = time.shift();
          var fr = time.shift();
        } else {
          let sc_fr = time.shift() || '';
          let sc_fr_split;
          switch (true) {
            case -1 != sc_fr.indexOf('.'):
              sc_fr_split = sc_fr.split('.');
              var sc = sc_fr_split.shift();
              var fr = sc_fr_split.shift();
              break;
            case -1 != sc_fr.indexOf(','):
              sc_fr_split = sc_fr.split(',');
              var sc = sc_fr_split.shift();
              var fr = sc_fr_split.shift();
              break;
          }
        }

        mn = parseInt(mn, 10) + parseInt(hr, 10) * 60;
        const timeEntry = (mn < 10 ? '0' + mn : mn) + ':' + sc + ':' + fr;
        regionsList.push(timeEntry);

        continue;
      }

      // find Nero/Winamp formats mm(m):ss(:|.)ii
      matches = row.match(/(\d{2,3}:\d{2}[\.:]\d{2})/i);
      if (null != matches) {
        var time = matches[0].split(':');
        var mn = time.shift();
        if (time.length == 1) {
          var sc_fr = time[0].split('.');
          var sc = sc_fr.shift();
          var fr = sc_fr.shift();
        } else {
          var sc = time.shift();
          var fr = time.shift();
        }

        const timeEntry = mn + ':' + sc + ':' + fr;
        regionsList.push(timeEntry);

        continue;
      }

      // Audacity
      matches = row.match(/(\d{1,5}).(\d{6})/i);
      if (null != matches) {
        const milliseconds = matches[2];
        const seconds = Number(matches[1]) || 0;
        const minutes = Math.floor(seconds / 60);

        let mn = minutes > 0 ? minutes : 0;
        let sc = seconds % 60;
        // frames can not be more than 74, so floor them instead of round
        const fr = Math.floor(parseFloat(0 + '.' + milliseconds) * 75);

        const timeEntry = (mn < 10 ? '0' + mn : mn) + ':' + (sc < 10 ? '0' + sc : sc) + ':' + (fr < 10 ? '0' + fr : fr);
        regionsList.push(timeEntry);

        continue;
      }

      // try to recognise raw cue timings
      matches = row.match(/(\d{2}:\d{2}:\d{2})/i);
      if (null != matches) {
        time = matches[0].split(':');
        const mn = parseInt(time[0], 10);
        const sc = parseInt(time[1], 10);
        const fr = parseInt(time[2], 10);

        const timeEntry = (mn < 10 ? '0' + mn : mn) + ':' + (sc < 10 ? '0' + sc : sc) + ':' + (fr < 10 ? '0' + fr : fr);
        regionsList.push(timeEntry);

        continue;
      }
    }

    return regionsList;
  }
}
