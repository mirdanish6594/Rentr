import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import API_URL from '../config';

const CreateJobModal = ({ isOpen, onClose, onJobCreated }) => {
  const [loading, setLoading] = useState(false);
  
  // 1. Updated State to match Backend Schema
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'General', 
    budget: ''       
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Prepare Data: Convert 'budget' to Number
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        budget: parseInt(formData.budget) || 0 // Force conversion to Integer
      };

      const response = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) // Send the fixed payload
      });

      if (response.ok) {
        const newJob = await response.json();
        onJobCreated(newJob);
        setFormData({ title: '', description: '', type: 'General', budget: '' }); // Reset
        onClose();
      } else {
        // Handle server errors (like 422)
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Failed to create job', error);
      alert("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rentr-dark/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-slide-up">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-rentr-dark">Post New Task</h2>
            <p className="text-sm text-slate-500">Contractual / One-time gig</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rentr-dark transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Task Title</label>
            <input
              required
              type="text"
              placeholder="e.g., Fix Bathroom Tile"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-rentr-gold transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* New Field: Type Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Category</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-rentr-gold bg-white"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="General">General</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC</option>
              <option value="Carpentry">Carpentry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
            <textarea
              required
              rows="3"
              placeholder="Brief details about the work required..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-rentr-gold transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Estimated Budget ($)</label>
            <input
              required
              type="number"
              placeholder="150"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-rentr-gold transition-all"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-rentr-gold hover:bg-[#8e6b4d] text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Post Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;