import './Header.css';
import Counter from './Heder/Counter';

export default function Header() {
  return (
    <>
      <h1 id="logo" style={{ backgroundImage: `url("/images/CUEgenerator.png")` }}>
        <a href=".">CUEgenerator</a>
      </h1>
      <Counter />

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
