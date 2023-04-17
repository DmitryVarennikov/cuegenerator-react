export type TrackList = Array<{ track: number; performer: string; title: string; time: string }>;
export type TimeEntry = { mn: number; sc: number; fr: number };
export type Timings = Array<TimeEntry>;
export type CueFormInputs = {
  performer: string;
  title: string;
  fileName: string;
  fileType: string;
  trackList: string;
  regionsList: string;
};
