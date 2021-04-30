import React from 'react';
import API from './API';

describe('API', () => {
  it('no uncaught promise when API is down', async () => {
    const api = new API('/');
    const counter = await api.getCounter();
    expect(counter).toBe(undefined);
  });
});
