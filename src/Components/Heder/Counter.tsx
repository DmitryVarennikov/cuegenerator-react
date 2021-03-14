import { useEffect, useState } from 'react';
import { api } from '../../Services';

export default function Counter() {
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const fetchCounter = async () => {
      const counter = await api.getCounter();
      if (counter) {
        setCounter(counter);
      }
    };
    fetchCounter();
  }, []);

  return <span id="counter">{counter}</span>;
}
