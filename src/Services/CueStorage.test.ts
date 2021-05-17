import CueStorage from './CueStorage';

const mockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

describe('CueStorage', () => {
  it('getPrevCue when no value', () => {
    const cueStorage = new CueStorage();
    // @ts-ignore
    cueStorage.storage = mockStorage;
    mockStorage.getItem.mockReturnValue(null);

    const prevCue = cueStorage.getPrevCue();
    expect(prevCue).toBe(null);
  });
  it('getPrevCue when value is not parsable', () => {
    const cueStorage = new CueStorage();
    // @ts-ignore
    cueStorage.storage = mockStorage;
    mockStorage.getItem.mockReturnValue('a');

    const prevCue = cueStorage.getPrevCue();
    expect(prevCue).toBe(null);
  });
  it('setPrevCue', () => {
    const cueStorage = new CueStorage();
    // @ts-ignore
    cueStorage.storage = mockStorage;

    const cueFormInputs = {
      performer: 'p',
      title: 't',
      fileName: 'fn',
      fileType: 'ft',
      trackList: 'tl',
      regionsList: 'rl',
    };
    cueStorage.setPrevCue(cueFormInputs);
    expect(mockStorage.setItem).toHaveBeenCalled();
  });
});
