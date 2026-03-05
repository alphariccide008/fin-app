import client from './client';

export const login = (email, password) =>
  client.post('/auth/login', { email, password });

export const register = (data) =>
  client.post('/auth/register', data);

export const getMe = () =>
  client.get('/auth/me');

export const updateMyBalance = (data) =>
  client.put('/auth/me/balance', data);

export const lookupUser = (identifier) =>
  client.get(`/auth/lookup?identifier=${encodeURIComponent(identifier)}`);
