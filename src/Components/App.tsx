import React, { useState } from 'react';
import './App.css';
import Form from './Form';
import Help from './Help';
import Header from './Header';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CounterContext from './CounterContext';

export default function App() {
  const [counter, setCounter] = useState<number>(0);

  return (
    <div id="container" data-testid={'container'}>
      <CounterContext.Provider value={{ counter, setCounter }}>
        <Header />
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Form} exact />
            <Route path="/help" component={Help} />
            {/* <Route component={Error} /> */}
          </Switch>
        </BrowserRouter>
      </CounterContext.Provider>
    </div>
  );
}
