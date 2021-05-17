import { CueFormInputs } from '../types';

export default class CueStorage {
  private static PREV_CUE_KEY = 'prev-cue';
  private storage = localStorage;

  getPrevCue(): CueFormInputs | null {
    const value = this.storage.getItem(CueStorage.PREV_CUE_KEY);

    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Error while pasring storage value', e);
      }
    }

    return null;
  }
  hasPrevCue(): boolean {
    return this.getPrevCue() != null;
  }
  setPrevCue(cueFormInputs: CueFormInputs): void {
    const value = JSON.stringify(cueFormInputs);
    this.storage.setItem(CueStorage.PREV_CUE_KEY, value);
  }
}
