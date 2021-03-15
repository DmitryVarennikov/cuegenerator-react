import { useContext, useEffect, useState } from 'react';
import { api } from '../../Services';
import CounterContext from '../CounterContext';

export default function Counter() {
  const { counter, setCounter } = useContext(CounterContext);

  useEffect(() => {
    const fetchCounter = async () => {
      const counter = await api.getCounter();
      if (counter) setCounter(counter);
    };
    fetchCounter();
  }, []);

  return <span id="counter">({counter})</span>;
}
