import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Pages
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { Dashboard } from '../pages/Dashboard';
import { Opportunities } from '../pages/Opportunities';
import { OpportunityDetail } from '../pages/OpportunityDetail';
import { Events } from '../pages/Events';
import { Research } from '../pages/Research';
import { Internships } from '../pages/Internships';
import { CertificateVault } from '../pages/CertificateVault';
import { Profile } from '../pages/Profile';
import { Notifications } from '../pages/Notifications';
import { Settings } from '../pages/Settings';
import { Advisor } from '../pages/Advisor';
import { Community } from '../pages/Community';
import { Mentors } from '../pages/Mentors';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Auth Pages (Login/Signup) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Secured Portal Pages */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:id" element={<OpportunityDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/research" element={<Research />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/vault" element={<CertificateVault />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/community" element={<Community />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
