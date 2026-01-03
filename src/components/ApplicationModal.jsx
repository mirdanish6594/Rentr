import React, { useState } from 'react';
import { X } from 'lucide-react';
import API_URL from '../config';

const ApplicationModal = ({ isOpen, onClose, job, onSubmit }) => {
  const [proposal, setProposal] = useState('');
  const [bid, setBid] = useState(job?.budget || '');

  if (!isOpen || !job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(job.id, { proposal, bid });
    onClose();
    setProposal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rentr-dark/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-rentr-dark">Submit Proposal</h2>
            <p className="text-sm text-slate-500">Apply for: <span className="font-semibold text-rentr-gold">{job.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rentr-dark transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Your Bid Amount ($)</label>
            <input 
              type="number" 
              required 
              value={bid} 
              onChange={e => setBid(e.target.value)} 
              className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:border-rentr-gold focus:ring-1 focus:ring-rentr-gold transition-all font-bold text-lg text-rentr-dark"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Why are you the best fit?</label>
            <textarea 
              required 
              rows="4"
              value={proposal} 
              onChange={e => setProposal(e.target.value)} 
              className="w-full border border-slate-300 p-3 rounded-xl focus:outline-none focus:border-rentr-gold focus:ring-1 focus:ring-rentr-gold transition-all text-slate-600 resize-none"
              placeholder="Describe your experience, approach, or availability..."
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-rentr-gold text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-orange-100 hover:bg-[#8e6b4d] transition-all active:scale-[0.98]"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;