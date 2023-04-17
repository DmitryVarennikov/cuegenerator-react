import Parser, { ParserHelper } from './Parser';

const parserHelper = new ParserHelper();
const parser = new Parser(parserHelper);

describe('Parser', () => {
  test('parseTitle', () => {
    const value = ' Russia Goes Clubbing 249 (2013-07-17) (Live @ Zouk, Singapore) ';
    const actual = parser.parseTitle(value);
    const expected = 'Russia Goes Clubbing 249 (2013-07-17) (Live @ Zouk, Singapore)';
    expect(actual).toBe(expected);
  });
  test('parsePerformer', () => {
    const value = ' Bobina ';
    const actual = parser.parsePerformer(value);
    const expected = 'Bobina';
    expect(actual).toBe(expected);
  });
  test('parseFileName', () => {
    const value = ' Bobina - Russia Goes Clubbing #249 [Live @ Zouk, Singapore].mp3 ';
    const actual = parser.parseFileName(value);
    const expected = 'Bobina - Russia Goes Clubbing #249 [Live @ Zouk, Singapore].mp3';
    expect(actual).toBe(expected);
  });
  test('parseTracklist_1', () => {
    const value = '\
    02:41 Bobina - Miami "Echoes"';
    const actual = parser.parseTrackList(value);
    const expected = [
      {
        performer: 'Bobina',
        time: '02:41:00',
        title: `Miami 'Echoes'`,
        track: 1,
      },
    ];
    expect(actual).toStrictEqual(expected);
  });
  test('parseTracklist_2', () => {
    const value = '\
02:41 Miami "Echoes"';
    const actual = parser.parseTrackList(value);
    const expected = [
      {
        performer: '',
        time: '02:41:00',
        title: `Miami 'Echoes'`,
        track: 1,
      },
    ];
    expect(actual).toStrictEqual(expected);
  });
  test('parseRegionsList', () => {
    const regionsList: { [key: string]: string } = {
      ' Marker 06      01:10:38:52': '70:38:52',
      ' 22                     02:01:50.04': '121:50:04',
      ' 22                     02:01:50,04': '121:50:04',
      ' 5541.293333    7143.640000     19': '92:21:21',
      ' 50:10:01 \n': '50:10:01',
      '01 120:10.01 (Split)': '120:10:01',
      'Marker 02 0:09.623': '0:09:46',
    };

    Object.keys(regionsList).forEach((key: string) => {
      const actual = parser.parseRegionsList(key);
      const expected = regionsList[key];
      expect(actual[0]).toBe(expected);
    });
  });
});

describe('ParserHelper', () => {
  test('splitTitlePerformer', () => {
    const value = "02:41 Dinka - Elements (EDX's 5un5hine Remix)";
    const actual = parserHelper.splitTitlePerformer(value);
    const expected = {
      performer: '02:41 Dinka',
      title: "Elements (EDX's 5un5hine Remix)",
    };
    expect(actual).toStrictEqual(expected);
  });
  test('splitTitlePerformerTitleOnly', () => {
    const value = "02:41 Dinka  Elements (EDX's 5un5hine Remix)";
    const actual = parserHelper.splitTitlePerformer(value);
    const expected = {
      performer: '',
      title: "02:41 Dinka  Elements (EDX's 5un5hine Remix)",
    };
    expect(actual).toStrictEqual(expected);
  });
  test('removeDoubleQuotes', () => {
    const value = 'Elements (EDX "5un5hine" Remix)';
    const actual = parserHelper.removeDoubleQuotes(value);
    const expected = 'Elements (EDX 5un5hine Remix)';
    expect(actual).toBe(expected);
  });
  test('replaceDoubleQuotes', () => {
    const value = `Elements (EDX "5un5hine" Remix)`;
    const actual = parserHelper.replaceDoubleQuotes(value);
    const expected = `Elements (EDX '5un5hine' Remix)`;
    expect(actual).toBe(expected);
  });
  test('separateTime', () => {
    const timePerformers: { [key: string]: { time: string; residue: string } } = {
      '[08:45] 03. 8 Ball': {
        time: '08:45',
        residue: '] 03. 8 Ball',
      },
      '01.[18:02] Giuseppe': {
        time: '18:02',
        residue: '] Giuseppe',
      },
      '10:57 02. Space Manoeuvres': {
        time: '10:57',
        residue: '02. Space Manoeuvres',
      },
      ' CJ Bolland ': {
        time: '',
        residue: 'CJ Bolland',
      },
      '04 Mr. Fluff': {
        time: '',
        residue: '04 Mr. Fluff',
      },
      '9999:53 T.O.M': {
        time: '9999:53',
        residue: 'T.O.M',
      },
      '999:02:28 Mossy': {
        time: '999:02:28',
        residue: 'Mossy',
      },
      // separateTime plays in tandem with castTime
      '2:28 NO LEADING ZERO': {
        time: '2:28',
        residue: 'NO LEADING ZERO',
      },
    };
    Object.keys(timePerformers).forEach((key) => {
      const actual = parserHelper.separateTime(key);
      const actualTime = actual.time;
      const actualPerformer = actual.residue;

      const expectedTime = timePerformers[key].time;
      const expectedPerformer = timePerformers[key].residue;

      expect(actualTime).toBe(expectedTime);
      expect(actualPerformer).toBe(expectedPerformer);
    });
  });
  test('cleanOffTime', () => {
    const performers: { [key: string]: string } = {
      '] Giuseppe': 'Giuseppe',
      '02. Space Manoeuvres': 'Space Manoeuvres',
      '04 Mr. Fluff': 'Mr. Fluff',
      'CJ Bolland': 'CJ Bolland',
      '08) CJ Bolland': 'CJ Bolland',
      '] 03. 8 Ball': '8 Ball',
    };
    Object.keys(performers).forEach((key) => {
      const actual = parserHelper.cleanOffTime(key);
      const expected = performers[key];
      expect(actual).toBe(expected);
    });
  });
  test('castTime', () => {
    const times: { [key: string]: string } = {
      // h:m:s|m:s -> m:s:f
      '999:02:28': '59942:28:00',
      '9999:53': '9999:53:00',
      '3:28': '03:28:00',
      '1:02:28': '62:28:00',
      '56:63': '56:63:00',
      '246:10': '246:10:00',
      '': '00:00:00',
      '00:05:12': '05:12:00',
    };

    Object.keys(times).forEach(function (key) {
      const actual = parserHelper.castTime(key);
      const expected = times[key];
      expect(actual).toBe(expected);
    });
  });
});
