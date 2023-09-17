import { TimeEntry } from '../types';

// frames can not be more than 74, so floor them instead of round
export const msToFrames = (ms: number): number => Math.floor(parseFloat(0 + '.' + ms) * 75);

export const adobeAudition = (value: string): TimeEntry | undefined => {
  const matches = value.match(/(\d{1,3}):(\d{2}).(\d{3,6})/i);
  if (null === matches) return;

  const mn = Number(matches[1]);
  const sc = Number(matches[2]);
  const ms = Number(matches[3]);
  const fr = msToFrames(ms);
  return { mn, sc, fr };
};

export const soundforge = (value: string): TimeEntry | undefined => {
  const matches = value.match(/(\d{2}:\d{2}:\d{2}[\.,:]\d{2})/i);
  if (null === matches) return;

  const time = matches[0].split(':');
  const hr = time.shift() || '0';
  let mn: string | number = time.shift() || '0';

  // frames can be separated by .(dot) or :(colon) or ,(comma)
  let sc;
  let fr;
  if (time.length > 1) {
    sc = time.shift();
    fr = time.shift();
  } else {
    let sc_fr = time.shift() || '';
    let sc_fr_split;
    switch (true) {
      case -1 != sc_fr.indexOf('.'):
        sc_fr_split = sc_fr.split('.');
        sc = sc_fr_split.shift();
        fr = sc_fr_split.shift();
        break;
      case -1 != sc_fr.indexOf(','):
        sc_fr_split = sc_fr.split(',');
        sc = sc_fr_split.shift();
        fr = sc_fr_split.shift();
        break;
    }
  }

  if (sc === undefined || fr === undefined) return undefined;

  mn = parseInt(mn, 10) + parseInt(hr, 10) * 60;
  return { mn, sc: Number(sc), fr: Number(fr) };
};

// Nero/Winamp formats mm(m):ss(:|.)ii
export const winampNero = (value: string): TimeEntry | undefined => {
  const matches = value.match(/(\d{2,3}:\d{2}[\.:]\d{2})/i);
  if (null === matches) return;

  const time = matches[0].split(':');
  const mn = time.shift();
  let sc;
  let fr;
  if (time.length == 1) {
    var sc_fr = time[0].split('.');
    sc = sc_fr.shift();
    fr = sc_fr.shift();
  } else {
    sc = time.shift();
    fr = time.shift();
  }

  if (sc === undefined || fr === undefined) return undefined;

  return { mn: Number(mn), sc: Number(sc), fr: Number(fr) };
};

export const audacity = (value: string): TimeEntry | undefined => {
  const matches = value.match(/(\d{1,5}).(\d{6})/i);
  if (null === matches) return;

  const milliseconds = Number(matches[2]);
  const seconds = Number(matches[1]) || 0;
  const minutes = Math.floor(seconds / 60);

  const mn = minutes > 0 ? minutes : 0;
  const sc = seconds % 60;
  // frames can not be more than 74, so floor them instead of round
  const fr = msToFrames(milliseconds);
  return { mn, sc, fr };
};

// try to recognise raw cue timings
export const standard = (value: string): TimeEntry | undefined => {
  const matches = value.match(/(\d{1,2}:\d{2}:\d{2})/i);
  if (null === matches) return;

  const time = matches[0].split(':');
  const mn = parseInt(time[0], 10);
  const sc = parseInt(time[1], 10);
  const fr = parseInt(time[2], 10);

  return { mn, sc, fr };
};
