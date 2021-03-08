import React from 'react';
import './App.css';
import Form from './Form';
import Help from './Help';
import Header from './Header';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

export default function App() {
  return (
    <div id="container" data-testid={'container'}>
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
