import React, { createContext, useState, useEffect } from 'react';
import { mockUser } from '../data/mockData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auto-login on mount
    const savedUser = localStorage.getItem('mednova_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Pre-populate with our mock user for testing/demonstration
      setUser(mockUser);
      localStorage.setItem('mednova_user', JSON.stringify(mockUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        if (email && password) {
          const loggedInUser = {
            ...mockUser,
            email: email,
            name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || "Healthcare Expert"
          };
          setUser(loggedInUser);
          localStorage.setItem('mednova_user', JSON.stringify(loggedInUser));
          setLoading(false);
          resolve(loggedInUser);
        } else {
          setLoading(false);
          reject("Please enter valid credentials");
        }
      }, 800);
    });
  };

  const signup = (name, email, password, college, year) => {
    return new Promise((resolve) => {
      setLoading(true);
      setTimeout(() => {
        const newUser = {
          ...mockUser,
          name,
          email,
          college,
          year,
          specialty: `${year} - ${college}`,
          role: `${year} Medical Student`,
          joined: "June 2026",
          stats: {
            opportunitiesApplied: 0,
            eventsAttended: 0,
            researchPapers: 0,
            certificatesEarned: 0
          }
        };
        setUser(newUser);
        localStorage.setItem('mednova_user', JSON.stringify(newUser));
        setLoading(false);
        resolve(newUser);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mednova_user');
  };

  const updateProfile = (updatedData) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem('mednova_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
