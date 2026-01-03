import React, { useState } from 'react';
import { X, FileCheck } from 'lucide-react';
import API_URL from '../config';

const InvoiceModal = ({ isOpen, onClose, job, onSubmit }) => {
  const [amount, setAmount] = useState(job?.budget || '');
  const [notes, setNotes] = useState('');

  if (!isOpen || !job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(job.id, { amount, notes, date: new Date().toISOString() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileCheck className="text-emerald-600" /> Generate Invoice
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600">
            Confirmed completed work for <strong>{job.title}</strong>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Final Invoice Amount ($)</label>
            <input 
              required
              type="number"
              className="w-full mt-1 p-2 border rounded-lg"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Completion Notes</label>
            <textarea 
              className="w-full mt-1 p-2 border rounded-lg"
              rows="2"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700">
            Send Invoice to Agent
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;