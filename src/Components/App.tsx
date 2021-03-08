import React from 'react';
import './App.css';
import Form from './Form';
import Help from './Help';
import Header from './Header';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <div id="container">
      <Header />
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Form} exact />
          <Route path="/help" component={Help} />
          {/* <Route component={Error} /> */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
