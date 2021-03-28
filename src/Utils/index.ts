import path from 'path';

export const replaceFileExt = (fileName: string, ext: string) => {
  const baseName = path.basename(fileName, path.extname(fileName));
  return baseName + ext;
};

export const makeCueFileName = (soundFileName: string) => {
  if (soundFileName) {
    return replaceFileExt(soundFileName, '.cue');
  }
  return 'Untitled.cue';
};
