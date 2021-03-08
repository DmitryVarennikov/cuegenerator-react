import './Help.css';

export default function Help() {
  return (
    <div id="help">
      <ul className="table_of_contents">
        <li>
          <a href="#adobe_audition">Adobe Audition</a>
        </li>
        <li>
          <a href="#audacity">Audacity</a>
        </li>
        <li>
          <a href="#sony_sound_forge">Sony Sound Forge</a>
        </li>
        <li>
          <a href="#nero_burning_rom">Nero Burning ROM</a>
        </li>
      </ul>
      <h2 id="adobe_audition">Adobe Audition</h2>
      <img src="images/help/adobe_audition_1.png" width="898" height="561" alt="Set Markers" title="Set Markers" />
      <img
        src="images/help/adobe_audition_2.png"
        width="898"
        height="561"
        alt='Run "Abby Screenshot Reader"'
        title='Run "Abby Screenshot Reader"'
      />
      <img
        src="images/help/adobe_audition_3.png"
        width="898"
        height="561"
        alt="Press Alt+Enter or that button"
        title="Press Alt+Enter or that button"
      />
      <img
        src="images/help/adobe_audition_4.png"
        width="898"
        height="561"
        alt='Select the "Markers" area'
        title='Select the "Markers" area'
      />
      <img src="images/help/adobe_audition_5.png" width="898" height="561" alt="Paste" title="Paste" />

      <div className="delimiter"></div>

      <h2 id="audacity">Audacity</h2>
      <img src="images/help/audacity_1.jpg" width="900" height="600" alt="Set labels" title="Set labels" />
      <img src="images/help/audacity_2.jpg" width="900" height="600" alt="Export labels" title="Export labels" />
      <img
        src="images/help/audacity_3.jpg"
        width="900"
        height="600"
        alt='Copy-paste labels to the "Timings" text area'
        title='Copy-paste labels to the "Timings" text area'
      />

      <div className="delimiter"></div>

      <h2 id="sony_sound_forge">Sony Sound Forge</h2>
      <img src="images/help/1.jpg" width="900" height="600" alt="View Regions List" title="View Regions List" />
      <img
        src="images/help/2.jpg"
        width="900"
        height="600"
        alt="Right click anywhere within Regions List"
        title="Right click anywhere within Regions List"
      />
      <img
        src="images/help/3.jpg"
        width="900"
        height="600"
        alt="Copy/Paste to the regions list field"
        title="Copy/Paste to the regions list field"
      />

      <div className="delimiter"></div>

      <h2 id="nero_burning_rom">Nero Burning ROM</h2>
      <img
        src="images/help/nero_1.jpg"
        width="754"
        height="587"
        alt="Nero Burning ROM timings"
        title="Nero Burning ROM timings"
      />
    </div>
  );
}
