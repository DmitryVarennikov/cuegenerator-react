import './Header.css';

export default function Header() {
  return (
    <>
      <h1 id="logo" style={{ backgroundImage: `url("/images/CUEgenerator.png")` }}>
        <a href=".">CUEgenerator</a>
      </h1>
      <span id="counter">(123)</span>

      <div id="feedback">
        <div className="links">
          <a href="https://github.com/DmitryVarennikov/cuegenerator-react" target="_blank" rel="noreferrer">
            Leave your feedback on GitHub
          </a>
        </div>
      </div>

      <div className="clear"></div>
    </>
  );
}
