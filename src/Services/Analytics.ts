import firebase from 'firebase';
import _ from 'lodash';

export enum AnalyticsEvent {
  CUE_FILE_SAVED = 'cue_file_saved',
  PREV_CUE_LOADED = 'prev_cue_loaded',
}

export default class Analytics {
  private analytics;
  constructor(options: Object) {
    // enable only when non-empty options are passed
    if (Analytics.areOptions(options)) {
      firebase.initializeApp(options);
      this.analytics = firebase.analytics();
    }
  }

  // check if every option value is not empty
  private static areOptions = (options: Object) => !Object.values(options).every(_.isEmpty);

  logEvent(event: AnalyticsEvent) {
    if (this.analytics) {
      this.analytics.logEvent(event.toString());
    }
  }
}
