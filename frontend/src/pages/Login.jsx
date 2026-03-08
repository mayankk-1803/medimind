import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/alerts';
import { HeartPulse, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      showSuccess('Login Successful', 'Welcome back to MediMind AI');
      navigate('/dashboard');
    } catch (err) {
      showError('Login Failed', err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans bg-gradient-to-br from-[#F8F4EC] via-[#FFFFFF] to-[#EFE8DD] dark:from-[#0F0F0F] dark:via-[#151515] dark:to-[#0F0F0F]">
      
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-white/60 dark:bg-white/5 rounded-full blur-[100px] mix-blend-overlay pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-[#EFE8DD]/80 dark:bg-black/50 rounded-full blur-[100px] mix-blend-overlay pointer-events-none"></div>

      <div className="premium-card max-w-md w-full space-y-8 p-10 mt-10 relative z-10 bg-white dark:bg-[#1A1A1A]">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <HeartPulse className="h-8 w-8 text-white dark:text-black" />
          </div>
          <h2 className="mt-2 text-3xl font-display font-bold text-[#0F0F0F] dark:text-white tracking-tight">Sign in to your account</h2>
          <p className="mt-3 text-sm text-[#4B4B4B] dark:text-gray-400 font-medium">
            Or <Link to="/register" className="font-bold text-black dark:text-white hover:underline transition-all">register for a new account</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field pl-12 bg-slate-50 dark:bg-slate-800 shadow-inner"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field pl-12 bg-slate-50 dark:bg-slate-800 shadow-inner"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-lg py-4"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
