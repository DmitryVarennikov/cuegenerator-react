import Formatter from './Formatter';
import Parser, { ParserHelper } from './Parser';

const newParser = new Parser(new ParserHelper());
const newFormatter = new Formatter();

export default class FormHandler {
  private parser: Parser;
  private formatter: Formatter;
  constructor(parser: Parser = newParser, formatter: Formatter = newFormatter) {
    this.parser = parser;
    this.formatter = formatter;
  }

  createCue(
    performer: string,
    title: string,
    fileName: string,
    fileType: string,
    trackList: string,
    regionsList: string
  ) {
    const formattedPerformer = this.formatter.formatPerformer(this.parser.parsePerformer(performer));
    const formattedTitle = this.formatter.formatTitle(this.parser.parseTitle(title));
    const formattedFileName = this.formatter.formatFilename(this.parser.parseFileName(fileName), fileType);
    const formattedTracklist = this.formatter.formatTracklist(
      this.parser.parseTrackList(trackList),
      this.parser.parseRegionsList(regionsList),
      performer
    );

    return formattedPerformer + formattedTitle + formattedFileName + formattedTracklist;
  }
}
