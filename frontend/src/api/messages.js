import client from './client';

// User endpoints
export const getMessages = () => client.get('/messages');
export const sendMessage = (content) => client.post('/messages', { content });
export const getUnreadCount = () => client.get('/messages/unread-count');

// Admin endpoints
export const getAdminConversations = () => client.get('/messages/admin/conversations');
export const getAdminConversation = (userId) => client.get(`/messages/admin/${userId}`);
export const sendAdminMessage = (userId, content) => client.post(`/messages/admin/${userId}`, { content });
export const getAdminUnreadCount = () => client.get('/messages/admin/unread-count');
