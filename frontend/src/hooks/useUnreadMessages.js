import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUnreadCount, getAdminUnreadCount } from '../api/messages';

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      if (user.role === 'admin') {
        const { data } = await getAdminUnreadCount();
        setCount(data.count);
      } else {
        const { data } = await getUnreadCount();
        setCount(data.count);
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [refresh]);

  return { count, refresh };
};
