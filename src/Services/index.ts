import { apiUrl, firebaseConfig } from '../Config';
import API from './API';
import Analytics from './Analytics';
import CueStorage from './CueStorage';

export const api = new API(apiUrl);
export const analytics = new Analytics(firebaseConfig);
export const cueStorage = new CueStorage();
