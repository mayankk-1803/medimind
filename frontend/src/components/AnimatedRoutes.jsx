import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import ChatPage from '../pages/ChatPage';
import SymptomChecker from '../pages/SymptomChecker';
import DiseaseSearch from '../pages/DiseaseSearch';
import PageWrapper from './PageWrapper';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/diseases" element={<PageWrapper><DiseaseSearch /></PageWrapper>} />
        
        {/* Protected Routes - Wrapping children with ProtectedRoute locally since it's in App now */}
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/chat" element={<PageWrapper><ChatPage /></PageWrapper>} />
        <Route path="/symptom-checker" element={<PageWrapper><SymptomChecker /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
