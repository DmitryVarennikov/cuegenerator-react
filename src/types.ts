export type TrackList = Array<{ track: number; performer: string; title: string; time: string }>;
export type RegionsList = Array<string>;
export type CueFormInputs = {
  performer: string;
  title: string;
  fileName: string;
  fileType: string;
  trackList: string;
  regionsList: string;
};
