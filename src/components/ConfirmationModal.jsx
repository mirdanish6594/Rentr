import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", isDangerous = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rentr-dark/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 transform scale-100 transition-all animate-slide-up">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-full mb-4 bg-rentr-light text-rentr-gold">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-rentr-dark mb-2">{title}</h3>
          <p className="text-slate-500 mb-6 text-sm">{message}</p>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={onCancel} 
              className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              className={`flex-1 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                isDangerous 
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-100' // Keep red for dangerous (like deleting), or use Gold if preferred
                  : 'bg-rentr-gold hover:bg-[#8e6b4d] shadow-orange-100'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;