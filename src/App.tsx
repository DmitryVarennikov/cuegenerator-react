import React from "react";
import "./App.css";
import Form from './Components/Form';

function App() {
  return (
    <div id="container">
      <h1
        id="logo"
        style={{ backgroundImage: `url("/images/CUEgenerator.png")` }}
      >
        <a href=".">CUEgenerator</a>
      </h1>
      <span id="counter">(123)</span>

      <div id="feedback">
        <div className="links">
          <a
            href="https://github.com/dVaffection/cuegenerator/issues"
            target="_blank" rel="noreferrer"
          >
            Leave your feedback on GitHub
          </a>
        </div>
      </div>

      <div className="clear"></div>

      <Form />
    </div>
  );
}

export default App;
