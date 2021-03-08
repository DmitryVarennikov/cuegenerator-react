import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('check container element', () => {
  render(<App />);
  const element = screen.getByTestId('container');
  expect(element).toBeInTheDocument();
  expect(element.getAttribute('id')).toBe('container');
});
