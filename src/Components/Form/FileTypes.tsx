const generateSelectOptions = (options: Array<String>) => {
  return options.map((option) => <option value="{option}" key={option.toString()}>{option}</option>);
};

export default function FileName() {
  const fileTypes = [
    "MP3",
    "AAC",
    "AIFF",
    "ALAC",
    "BINARY",
    "FLAC",
    "MOTOROLA",
    "WAVE",
  ];
  const options = generateSelectOptions(fileTypes);
  return (
    <select tabIndex={4} id="filetype">
      {options}
    </select>
  );
}
