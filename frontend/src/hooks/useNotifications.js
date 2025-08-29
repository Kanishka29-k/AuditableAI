import { useState, useCallback } from 'react';
import { NOTIFICATION_TYPES } from '../utils/constants';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = NOTIFICATION_TYPES.SUCCESS, duration = 4000) => {
    setNotification({ message, type });
    
    setTimeout(() => {
      setNotification(null);
    }, duration);
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};