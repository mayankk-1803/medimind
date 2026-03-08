import React, { useState, useRef } from 'react';
import api from '../services/api';
import { showError, showEmergency } from '../utils/alerts';
import html2pdf from 'html2pdf.js';
import { Download, AlertTriangle, CheckCircle, Search, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const commonSymptoms = [
  "Fever", "Cough", "Headache", "Fatigue", "Nausea", 
  "Vomiting", "Chest pain", "Shortness of breath", 
  "Dizziness", "Abdominal pain", "Muscle ache", "Sore throat"
];

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef();

  const handleSymptomSelect = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms(prev => [...prev, symptom]);
    }
  };

  const handleCustomAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const val = e.target.value.trim();
      if (!selectedSymptoms.includes(val)) {
         setSelectedSymptoms(prev => [...prev, val]);
      }
      e.target.value = '';
    }
  };

  const checkSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      return showError("No Symptoms", "Please select or type at least one symptom.");
    }
    setLoading(true);
    try {
      const { data } = await api.post('/diseases/check', { symptoms: selectedSymptoms });
      setReport(data);
      if (data.emergencyDetected) {
        showEmergency('Possible Medical Emergency Detected', 'Please contact emergency services (e.g., 911) immediately.');
      }
    } catch (error) {
      showError('Analysis Failed', error.response?.data?.message || 'Error communicating with AI predictor.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = reportRef.current;
    if (!element) return;
    
    // Create a deep clone for PDF to remove hidden classes
    const clonedObj = element.cloneNode(true);
    clonedObj.classList.add('p-8', 'bg-white', 'text-black');
    
    const opt = {
      margin:       1,
      filename:     `Medical_Report_${new Date().getTime()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'mild': return 'text-success bg-success/10 border-success/20';
      case 'moderate': return 'text-warning bg-warning/10 border-warning/20';
      case 'critical': return 'text-emergency bg-emergency/10 border-emergency/20';
      default: return 'text-slate-500 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {!report ? (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-textMain dark:text-black mb-4">Symptom Checker</h1>
            <p className="text-lg text-gray-900 dark:text-gray-900">
              Select your symptoms below or type them in. Our AI will analyze your symptoms and predict potential conditions.
            </p>
          </div>

          <div className="premium-card mb-8 bg-white dark:bg-[#1A1A1A]">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-textMain dark:text-gray-100">
              <Search className="w-5 h-5 text-primary dark:text-white" />
              Specify Symptoms
            </h2>
            <input 
              type="text" 
              className="input-field mb-6 text-lg bg-slate-50 dark:bg-slate-800" 
              placeholder="Type a custom symptom and press Enter..."
              onKeyDown={handleCustomAdd}
            />

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[#4B4B4B] uppercase tracking-wider mb-3">Common Symptoms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {commonSymptoms.map(symptom => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <motion.button
                      key={symptom}
                      onClick={() => handleSymptomSelect(symptom)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${
                        isSelected 
                          ? 'bg-black border-black shadow-lg dark:bg-white dark:border-white' 
                          : 'bg-white dark:bg-[#1A1A1A] border-slate-200 dark:border-slate-800 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      <div>
                        <p className={`font-medium ${isSelected ? 'text-white dark:text-black' : 'text-[#0F0F0F] dark:text-gray-300'}`}>
                          {symptom}
                        </p>
                      </div>
                      <AnimatePresence>
                         {isSelected && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="w-6 h-6 rounded-full bg-white dark:bg-black flex items-center justify-center flex-shrink-0"
                            >
                              <CheckCircle className="w-4 h-4 text-black dark:text-white" />
                            </motion.div>
                         )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {selectedSymptoms.length > 0 && (
               <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Selected Symptoms</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedSymptoms.map(symp => (
                      <span key={symp} className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F0F0F] dark:text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-sm">
                        {symp}
                        <button onClick={() => handleSymptomSelect(symp)} className="hover:text-red-500 font-bold transition-colors">&times;</button>
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={checkSymptoms} 
                    disabled={loading}
                    className="btn-primary w-full text-lg py-4"
                  >
                    {loading ? 'Analyzing Symptoms...' : 'Analyze Symptoms'}
                  </button>
               </div>
            )}
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-md">
            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-0.5 animate-pulse" />
            <p className="text-sm text-black-900 dark:text-black-200/90 font-medium">
               If you are experiencing severe chest pain, extreme difficulty breathing, sudden numbness, or heavy bleeding, call emergency services immediately.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => setReport(null)} className="text-primary hover:underline font-medium">&larr; Back to Checker</button>
            <button onClick={downloadPDF} className="btn-primary flex items-center gap-2">
              <Download className="w-4 h-4" /> Download PDF Report
            </button>
          </div>

          <div ref={reportRef} className="premium-card bg-white dark:bg-[#1A1A1A] p-8 md:p-12 print:shadow-none print:border-none">
             
             {/* Print Header */}
             <div className="text-center mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
               <h1 className="text-3xl font-extrabold text-[#0F0F0F] dark:text-white mb-2">Medical Analysis Report</h1>
               <div className="text-[#4B4B4B] flex justify-center gap-4 text-sm mt-3">
                 <span>Date: {new Date(report.createdAt).toLocaleDateString()}</span>
                 <span>Time: {new Date(report.createdAt).toLocaleTimeString()}</span>
               </div>
             </div>

             {report.emergencyDetected && (
               <div className="mb-8 bg-red-100 border-l-4 border-emergency p-6 rounded-r-lg flex gap-4 items-start print:bg-red-50">
                 <ShieldAlert className="w-8 h-8 text-emergency flex-shrink-0" />
                 <div>
                   <h3 className="text-xl font-bold text-emergency mb-1">POSSIBLE MEDICAL EMERGENCY</h3>
                   <p className="text-red-900 text-sm font-medium">Critical symptoms detected. Do not wait. Please seek emergency medical assistance immediately.</p>
                 </div>
               </div>
             )}

             <div className="mb-10">
               <h3 className="text-lg font-bold mb-3 border-b-2 border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-2">
                 <CheckCircle className="w-5 h-5 text-primary" /> Reported Symptoms
               </h3>
               <div className="flex flex-wrap gap-2 mt-4">
                 {report.symptoms.map(s => (
                   <span key={s} className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm font-medium">{s}</span>
                 ))}
               </div>
             </div>

             <div className="mb-10">
               <h3 className="text-lg font-bold mb-4 border-b-2 border-slate-100 dark:border-slate-700 pb-2">Predicted Conditions</h3>
               <div className="space-y-4">
                 {report.predictedDiseases.map((cond, i) => (
                   <div key={i} className={`p-4 rounded-xl border ${getSeverityColor(cond.severity)}`}>
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="text-xl font-bold">{cond.disease}</h4>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getSeverityColor(cond.severity)}`}>
                         {cond.severity}
                       </span>
                     </div>
                     <div className="w-full bg-black/10 rounded-full h-2.5 mb-2 mt-3">
                        <div className="bg-current h-2.5 rounded-full" style={{ width: `${cond.probability}%` }}></div>
                     </div>
                     <p className="text-sm font-medium mt-1">Probability Match: {cond.probability}%</p>
                   </div>
                 ))}
               </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8 mb-6">
               <div className="p-6 bg-blue-50 dark:bg-slate-900/50 rounded-xl">
                 <h3 className="text-lg font-bold mb-4 text-primary">Recommended Actions & Precautions</h3>
                 <ul className="space-y-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                   {report.precautions.map((p, i) => <li key={i}>{p}</li>)}
                 </ul>
               </div>

               <div className="p-6 bg-emerald-50 dark:bg-slate-900/50 rounded-xl">
                 <h3 className="text-lg font-bold mb-4 text-success">Recommended Specialists</h3>
                 <ul className="space-y-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                   {report.recommendedDoctors.map((p, i) => <li key={i} className="font-medium">{p}</li>)}
                 </ul>
               </div>
             </div>
             
             <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                <p className="text-xs text-gray-400 font-medium">Auto-generated by MediMind AI. This report is for informational purposes only.</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
