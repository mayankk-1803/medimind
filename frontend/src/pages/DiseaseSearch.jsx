import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import { showError } from '../utils/alerts';
import { Search, Info, Activity } from 'lucide-react';

const DiseaseSearch = () => {
  const [diseases, setDiseases] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiseases();
  }, []);

  const fetchDiseases = async (searchKeyword = '') => {
    setLoading(true);
    try {
      const { data } = await api.get(`/diseases?keyword=${searchKeyword}`);
      setDiseases(data);
    } catch (error) {
      showError('Search Failed', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDiseases(keyword);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-textMain dark:text-black mb-4">Medical Knowledge Base</h1>
        <p className="text-lg text-gray-600 dark:text-gray-900 max-w-2xl mx-auto mb-8">
          Search through our comprehensive database of diseases to learn about symptoms, treatments, and precautions.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <input
            type="text"
            className="input-field pl-12 py-4 text-lg shadow-sm"
            placeholder="Search for a disease... e.g., Diabetes, Hypertension"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
             <Search className="w-6 h-6" />
          </button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : diseases.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          No diseases found matching your search.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((disease) => (
            <div key={disease._id} className="premium-card flex flex-col hover:-translate-y-1 transition-transform border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-3">{disease.name}</h2>
              <p className="text-sm text-[#4B4B4B] dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
                {disease.description}
              </p>
              
              <div className="space-y-3">
                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-black dark:text-white" />
                    <span className="text-xs font-bold uppercase tracking-wide text-black dark:text-white">Symptoms</span>
                  </div>
                  <p className="text-sm font-medium">{disease.symptoms?.slice(0, 3).join(', ')} {disease.symptoms?.length > 3 && '...'}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Info className="w-4 h-4 text-[#4B4B4B]" />
                  <span className="text-gray-500">See <span className="font-semibold text-textMain dark:text-gray-200">{disease.recommendedSpecialization}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiseaseSearch;
