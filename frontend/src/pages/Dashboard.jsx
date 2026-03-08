import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { showError, showConfirm, showSuccess } from '../utils/alerts';
import { FileText, Clock, FileWarning, Search, Trash2, Activity } from 'lucide-react';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, chatsRes] = await Promise.all([
        api.get('/reports'),
        api.get('/chat')
      ]);
      setReports(reportsRes.data);
      setChats(chatsRes.data);
    } catch (error) {
      showError('Error loading dashboard', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    const result = await showConfirm(
      'Delete Report?',
      'Are you sure you want to delete this report? This action cannot be undone.'
    );
    if (!result.isConfirmed) return;
    
    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter(r => r._id !== id));
      showSuccess('Deleted', 'Report deleted successfully.');
    } catch (error) {
      showError('Failed to delete report', error.message);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Welcome Card (Spans 2 cols) */}
        <div className="col-span-1 md:col-span-2 premium-card flex flex-col justify-center p-8 bg-white dark:bg-[#1A1A1A]">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F0F0F] dark:text-white mb-2 tracking-tight">
            Welcome, {user?.name}
          </h1>
          <p className="text-[#4B4B4B] dark:text-slate-400 text-lg">Your intelligent medical overview is ready.</p>
        </div>

        {/* 2. Quick Action Card */}
        <Link to="/symptom-checker" className="col-span-1 premium-card flex flex-col justify-center items-center text-center group cursor-pointer bg-white dark:bg-[#1A1A1A]">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Activity className="text-black dark:text-white w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-[#0F0F0F] dark:text-white">New Symptom Check</h3>
          <p className="text-sm text-[#4B4B4B] mt-1">Start AI-powered diagnosis</p>
        </Link>

        {/* 3. Medical Reports (Spans 2 cols, taller) */}
        <div className="col-span-1 md:col-span-2 premium-card h-[500px] flex flex-col bg-white dark:bg-[#1A1A1A]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <FileText className="w-5 h-5 text-black dark:text-white" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#0F0F0F] dark:text-white">Recent Reports</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Search className="w-12 h-12 mb-3 opacity-20" />
                <p>No reports found.</p>
              </div>
            ) : (
              reports.map(report => (
                <div key={report._id} className="p-5 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-[#1A1A1A] relative overflow-hidden group">
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        {report.emergencyDetected && (
                          <span className="badge-emergency text-[10px] flex items-center gap-1">
                            <FileWarning className="w-3 h-3" /> CRITICAL
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-gray-200 line-clamp-1 mb-1">{report.symptoms.join(', ')}</p>
                      <p className="text-xs text-[#0F0F0F] dark:text-white font-bold">
                        {report.predictedDiseases?.[0]?.disease || 'Unknown'} 
                        {report.predictedDiseases?.[0] && ` (${report.predictedDiseases[0].probability}%)`}
                      </p>
                    </div>
                    
                    <button onClick={() => deleteReport(report._id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors self-start md:self-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Past Consultations (Spans 1 col) */}
        <div className="col-span-1 premium-card h-[500px] flex flex-col bg-white dark:bg-[#1A1A1A]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Clock className="w-5 h-5 text-black dark:text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#0F0F0F] dark:text-white">Chat History</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Search className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm">No history.</p>
              </div>
            ) : (
              chats.map(chat => (
                <Link to={`/chat?id=${chat._id}`} key={chat._id} className="block p-4 border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-[#1A1A1A]">
                  <h3 className="font-semibold text-sm mb-1 text-[#0F0F0F] dark:text-white line-clamp-1">{chat.title || 'Medical Consultation'}</h3>
                  <span className="text-xs text-[#4B4B4B] dark:text-slate-400">{new Date(chat.createdAt).toLocaleDateString()}</span>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
