import firebase from 'firebase';
import Analytics, { AnalyticsEvent } from './Analytics';

jest.mock('firebase', () => {
  return {
    initializeApp: jest.fn(),
    analytics: jest.fn(),
  };
});

describe('Analytics', () => {
  it('init firebase when options passed', () => {
    new Analytics({ apiKey: 'apiKey', authDomain: 'authDomain' });

    expect(firebase.initializeApp).toHaveBeenCalled();
    expect(firebase.initializeApp).toHaveBeenCalledWith({ apiKey: 'apiKey', authDomain: 'authDomain' });
    expect(firebase.analytics).toHaveBeenCalled();
  });
  it('no firebase init call when no options passed', () => {
    new Analytics({});

    expect(firebase.initializeApp).toHaveBeenCalledTimes(0);
    expect(firebase.analytics).toHaveBeenCalledTimes(0);
  });
  it('log event when analytics was initialzied', () => {
    const analytics = new Analytics({ non: 'empty' });
    // @ts-ignore
    analytics['analytics'] = {
      logEvent: jest.fn(),
    };

    analytics.logEvent(AnalyticsEvent.CUE_FILE_SAVED);
    expect(analytics['analytics']?.logEvent).toHaveBeenCalled();
    expect(analytics['analytics']?.logEvent).toHaveBeenCalledWith(AnalyticsEvent.CUE_FILE_SAVED);
  });
});
