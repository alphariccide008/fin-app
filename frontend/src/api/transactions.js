import client from './client';

export const getTransactions = () =>
  client.get('/transactions');

export const transfer = (data) =>
  client.post('/transactions/transfer', data);

export const externalTransfer = (data) =>
  client.post('/transactions/external-transfer', data);

export const mobileDeposit = (data) =>
  client.post('/transactions/mobile-deposit', data);
