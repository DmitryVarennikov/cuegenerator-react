import React from 'react';

type CounterContext = {
  counter: number;
  setCounter: (value: number) => void;
};
const CounterContext = React.createContext<CounterContext>({ counter: 0, setCounter: (value: number) => {} });
export default CounterContext;
