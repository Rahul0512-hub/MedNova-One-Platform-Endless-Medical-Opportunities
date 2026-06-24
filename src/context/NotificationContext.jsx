import React, { createContext, useState, useEffect } from 'react';
import { mockNotifications } from '../data/mockData';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('mednova_notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(mockNotifications);
      localStorage.setItem('mednova_notifications', JSON.stringify(mockNotifications));
    }
  }, []);

  const saveNotifications = (newNotifs) => {
    setNotifications(newNotifs);
    localStorage.setItem('mednova_notifications', JSON.stringify(newNotifs));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    saveNotifications(updated);
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    saveNotifications(updated);
  };

  const addNotification = (title, message, type = 'system') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      time: "Just now",
      unread: true
    };
    const updated = [newNotif, ...notifications];
    saveNotifications(updated);
  };

  const clearNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  const clearReadNotifications = () => {
    const updated = notifications.filter(n => n.unread);
    saveNotifications(updated);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAllAsRead,
      markAsRead,
      addNotification,
      clearNotification,
      clearAllNotifications,
      clearReadNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
