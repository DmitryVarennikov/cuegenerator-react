import "./Form.css";
import FileTypes from "./Form/FileTypes";

export default function Form() {
  return (
    <form>
      <input
        type="submit"
        name="save"
        id="save"
        value="Save Cue to File"
      />
      <div className="clear"></div>

      <div id="cue_fields">
        <div className="field">
          <label htmlFor="performer">Performer:</label>
          <input
            tabIndex={1}
            autoComplete="off"
            type="text"
            id="performer"
            name="performer"
            value=""
          />
        </div>
        <div className="field">
          <label htmlFor="title">Title:</label>
          <input
            tabIndex={2}
            autoComplete="off"
            type="text"
            id="title"
            name="title"
            value=""
          />
        </div>
        <div className="field">
          <label htmlFor="filename">File name:</label>
          <input
            tabIndex={3}
            autoComplete="off"
            type="text"
            id="filename"
            name="filename"
            value=""
          />
        </div>
        <div className="field">
          <label htmlFor="filetype">File type:</label>
          {FileTypes()}
        </div>
        <div className="field">
          <label htmlFor="tracklist">Tracklist:</label>
          <textarea
            tabIndex={5}
            id="tracklist"
            name="tracklist"
            rows={5}
            cols={10}
            value=""
          ></textarea>
        </div>
        <div className="field">
          <label htmlFor="tracklist">
            Timings:{" "}
            <sup>
              <a href="help.html" target="new">
                Help
              </a>
            </sup>
          </label>
          <textarea
            tabIndex={6}
            id="regions_list"
            name="regions_list"
            rows={5}
            cols={10}
            value=""
          ></textarea>
        </div>
      </div>
      <div id="cue_ready">
        <input type="hidden" name="generate" id="generate" />
        <textarea
          id="cue"
          name="cue"
          rows={5}
          cols={10}
          readOnly={true}
          style={{ backgroundImage: `url("/images/read-only.gif")` }}
        ></textarea>
      </div>
    </form>
  );
}
