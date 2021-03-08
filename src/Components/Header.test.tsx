import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('check feedback link', () => {
  render(<Header />);
  const linkElement = screen.getByText(/Leave your feedback on GitHub/i);
  expect(linkElement).toBeInTheDocument();
  expect(linkElement.getAttribute('href')).toBe('https://github.com/DmitryVarennikov/cuegenerator-react');
});
