import React, { useState, useEffect } from 'react';
import { X, Loader2, Trash2 } from 'lucide-react';
import API_URL from '../config';

const EditJobModal = ({ isOpen, job, onClose, onJobUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    budget: ''
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        description: job.description,
        type: job.type,
        budget: job.budget
      });
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        onJobUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Error updating job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/jobs/${job.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        onJobUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rentr-dark/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-slide-up">
        
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-rentr-dark">Edit Listing</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
            <input type="text" className="w-full px-3 py-2 border rounded-xl" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <textarea rows="3" className="w-full px-3 py-2 border rounded-xl" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-1">Budget ($)</label>
             <input type="number" className="w-full px-3 py-2 border rounded-xl" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} required />
          </div>

          <div className="pt-4 flex gap-3">
             {/* DELETE BUTTON */}
             <button type="button" onClick={handleDelete} disabled={deleteLoading} className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2">
               {deleteLoading ? <Loader2 className="animate-spin" size={18}/> : <Trash2 size={18}/>}
             </button>
             
             <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
             <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-rentr-gold text-white rounded-xl font-bold hover:bg-[#8e6b4d] flex items-center justify-center gap-2">
               {loading ? <Loader2 className="animate-spin" size={18}/> : 'Save Changes'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobModal;