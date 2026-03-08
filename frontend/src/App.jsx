import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'animate.css';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import SymptomChecker from './pages/SymptomChecker';
import DiseaseSearch from './pages/DiseaseSearch';

import { AnimatePresence } from 'framer-motion';
import AnimatedRoutes from './components/AnimatedRoutes';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/*" element={
               <AnimatedRoutesWithProtection />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Inline component to use useLocation to power AnimatePresence natively while respecting Contexts
import { useLocation } from 'react-router-dom';
import PageWrapper from './components/PageWrapper';

const AnimatedRoutesWithProtection = () => {
    const location = useLocation();
    const { user } = useAuth();

    const Proteced = ({children}) => {
       return user ? children : <Navigate to="/login" />;
    }

    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
          <Route path="/diseases" element={<PageWrapper><DiseaseSearch /></PageWrapper>} />
          
          <Route path="/dashboard" element={<Proteced><PageWrapper><Dashboard /></PageWrapper></Proteced>} />
          <Route path="/chat" element={<Proteced><PageWrapper><ChatPage /></PageWrapper></Proteced>} />
          <Route path="/symptom-checker" element={<Proteced><PageWrapper><SymptomChecker /></PageWrapper></Proteced>} />
        </Routes>
      </AnimatePresence>
    )
}

export default App;
