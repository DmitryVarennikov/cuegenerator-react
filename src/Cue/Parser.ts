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

    //                          01.             9999:53 | 999:02:28
    var pattern = /^(?:\d{2}\.)?\[?((?:\d{1,3}:)?\d{2,4}:\d{2})\]?.*$/i;
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
    value = value.trim();

    let pattern = /^\d{1,3}:\d{2}:\d{2}$/;
    let matches = value.match(pattern);
    if (matches) {
      var times = value.split(':');
      var hr = parseInt(times[0], 10);
      var mn = parseInt(times[1], 10);
      var sc = times[2];
      mn = hr * 60 + mn;
      value = mn + ':' + sc + ':00';
    } else {
      pattern = /^\d{2,4}:\d{2}$/;
      matches = value.match(pattern);
      if (matches) {
        value = value + ':00';
      } else {
        value = '00:00:00';
      }
    }

    return value;
  }

  cleanOffTime(value: string) {
    var pattern = /^(?:\]? )?(?:\d{2}\)?\.? )?(.*)$/i;
    var matches = value.match(pattern);

    if (matches && matches[1]) {
      value = matches[1];
    }

    value = this.removeDoubleQuotes(value);

    return value;
  }

  removeDoubleQuotes(value: string) {
    return value.replace(/"/g, '');
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
    var contents = [],
      row,
      performerTitle,
      timePerformer,
      timeTitle,
      time,
      performer,
      title;

    contents = value.split('\n');

    for (var i = 0, track = 1; i < contents.length; i++, track++) {
      row = contents[i].trim();
      if (!row.length) {
        track--;
        continue;
      }

      performerTitle = this.helper.splitTitlePerformer(row);

      if (performerTitle.performer) {
        timePerformer = this.helper.separateTime(performerTitle.performer);

        time = this.helper.castTime(timePerformer.time);
        performer = this.helper.cleanOffTime(timePerformer.residue);
        title = this.helper.removeDoubleQuotes(performerTitle.title);
      } else {
        timeTitle = this.helper.separateTime(performerTitle.title);
        time = this.helper.castTime(timeTitle.time);
        performer = '';
        title = this.helper.cleanOffTime(timeTitle.residue);
      }

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
    var regionsList = [],
      time = '';
    var contents = value.split('\n');

    for (var i = 0; i < contents.length; i++) {
      var row = contents[i].trim();

      // Soundforge or Audition
      var matches = row.match(/(\d{2}:\d{2}:\d{2}[\.,:]\d{2})/i);
      if (null != matches) {
        var time = matches[0].split(':');
        var hr = time.shift();
        var mn = time.shift();

        // frames can be separated by .(dot) or :(colon) or ,(comma)
        if (time.length > 1) {
          var sc = time.shift();
          var fr = time.shift();
        } else {
          var sc_fr = time.shift();
          switch (true) {
            case -1 != sc_fr.indexOf('.'):
              sc_fr = sc_fr.split('.');
              var sc = sc_fr.shift();
              var fr = sc_fr.shift();
              break;
            case -1 != sc_fr.indexOf(','):
              sc_fr = sc_fr.split(',');
              var sc = sc_fr.shift();
              var fr = sc_fr.shift();
              break;
          }
        }

        mn = parseInt(mn, 10) + parseInt(hr, 10) * 60;
        time = (mn < 10 ? '0' + mn : mn) + ':' + sc + ':' + fr;
        regionsList.push(time);

        continue;
      }

      // find Nero/Winamp formats mm(m):ss(:|.)ii
      var matches = row.match(/(\d{2,3}:\d{2}[\.:]\d{2})/i);
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

        time = mn + ':' + sc + ':' + fr;
        regionsList.push(time);

        continue;
      }

      // Audacity
      var matches = row.match(/(\d{1,5}).(\d{6})/i);
      if (null != matches) {
        var milliseconds = matches[2];
        var seconds = matches[1];
        var minutes = Math.floor(seconds / 60);

        var mn = minutes > 0 ? minutes : 0;
        var sc = seconds % 60;
        // frames can not be more than 74, so floor them instead of round
        var fr = Math.floor(parseFloat(0 + '.' + milliseconds) * 75);

        time = (mn < 10 ? '0' + mn : mn) + ':' + (sc < 10 ? '0' + sc : sc) + ':' + (fr < 10 ? '0' + fr : fr);
        regionsList.push(time);

        continue;
      }

      // try to recognise raw cue timings
      var matches = row.match(/(\d{2}:\d{2}:\d{2})/i);
      if (null != matches) {
        time = matches[0].split(':');
        var mn = parseInt(time[0], 10);
        var sc = parseInt(time[1], 10);
        var fr = parseInt(time[2], 10);

        time = (mn < 10 ? '0' + mn : mn) + ':' + (sc < 10 ? '0' + sc : sc) + ':' + (fr < 10 ? '0' + fr : fr);
        regionsList.push(time);

        continue;
      }
    }

    return regionsList;
  }
}
