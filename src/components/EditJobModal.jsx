import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Wrench, Clock, DollarSign } from 'lucide-react';
import API_URL from '../config';

const EditJobModal = ({ isOpen, onClose, job, onJobUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', type: 'Plumbing', description: '', budget: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        type: job.type,
        description: job.description,
        budget: job.budget
      });
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${API_URL}/api/jobs/${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    onJobUpdated();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rentr-dark/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-rentr-dark">Edit Job Order</h2>
          <button onClick={onClose}><X className="text-slate-400 hover:text-rentr-dark" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
            <input type="text" className="w-full border p-2 rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                <select className="w-full border p-2 rounded-lg bg-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option>Plumbing</option><option>Electrical</option><option>Carpentry</option><option>HVAC</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Budget ($)</label>
                <input type="number" className="w-full border p-2 rounded-lg" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
             </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <textarea rows="3" className="w-full border p-2 rounded-lg" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-rentr-gold text-white py-3 rounded-xl font-bold hover:bg-[#8e6b4d] flex justify-center items-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;