import client from './client';

export const getAdminUsers = () => client.get('/admin/users');
export const getAdminUserDetail = (id) => client.get(`/admin/users/${id}`);
export const updateUserInfo = (id, data) => client.put(`/admin/users/${id}`, data);
export const updateUserStatus = (id, status) => client.put(`/admin/users/${id}/status`, { status });
export const updateUserBalance = (id, data) => client.put(`/admin/users/${id}/balance`, data);
export const getAdminTransactions = () => client.get('/admin/transactions');
export const addAdminTransaction = (data) => client.post('/admin/transactions', data);
export const deleteTransaction = (id) => client.delete(`/admin/transactions/${id}`);
export const getAdminStats = () => client.get('/admin/stats');
