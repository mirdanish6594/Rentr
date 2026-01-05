import React from 'react';
import html2pdf from 'html2pdf.js';
import { X, Download } from 'lucide-react';
import logo from '../assets/logo.png'; 

const InvoiceViewModal = ({ isOpen, onClose, job, onPay, isAgent }) => {
  if (!isOpen || !job || !job.invoice) return null;

  const handleDownload = () => {
    const element = document.getElementById('invoice-content');
    const opt = {
      margin: 0.5,
      filename: `Rentr-Invoice-${job.invoice.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-rentr-dark/60 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl my-8 animate-slide-up">
        
        {/* Toolbar */}
        <div className="flex justify-between items-center p-4 border-b bg-rentr-light rounded-t-xl">
          <h2 className="font-bold text-rentr-dark">Invoice Review</h2>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700">
              <Download size={16}/> PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X size={20}/></button>
          </div>
        </div>

        {/* INVOICE TEMPLATE (This part gets printed) */}
        <div id="invoice-content" className="p-12 bg-white text-slate-900">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-extrabold text-rentr-dark tracking-tight">INVOICE</h1>
              <p className="text-slate-500 mt-1 font-medium">#{job.invoice.id}</p>
            </div>
            <div className="text-right">
              {/* LOGO REPLACEMENT */}
              <img src={logo} alt="Rentr" className="h-10 ml-auto mb-2" />
              <p className="text-sm text-slate-500">Rentr Ltd, 23 The Atrium, Clemens Street,</p>
              <p className="text-sm text-slate-500">Leamington Spa, Warwickshire, CV31 2DW</p>
              <p className="text-sm text-slate-500">Company number 09201246</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Bill To</p>
              <p className="font-bold text-lg text-rentr-dark">Agent / Property Manager</p>
              <p className="text-slate-600">Rentr Management Corp</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">From</p>
              <p className="font-bold text-lg text-rentr-dark">{job.assignedTo}</p>
              <p className="text-slate-600">Professional Contractor</p>
              <p className="text-slate-600 text-sm mt-2 font-medium">Date: {new Date(job.invoice.date).toLocaleDateString()}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-rentr-dark text-left">
                <th className="py-3 font-bold text-sm uppercase text-rentr-dark tracking-wide">Description</th>
                <th className="py-3 font-bold text-sm uppercase text-right text-rentr-dark tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-4">
                  <p className="font-bold text-slate-800">{job.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{job.description}</p>
                  {job.invoice.notes && (
                    <p className="text-sm text-slate-500 italic mt-2 bg-rentr-light p-2 rounded inline-block">
                      Note: {job.invoice.notes}
                    </p>
                  )}
                </td>
                <td className="py-4 text-right font-bold text-lg text-slate-800">${job.invoice.amount}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-800">${job.invoice.amount}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Platform Fee (0%)</span>
                <span className="font-bold text-slate-800">$0.00</span>
              </div>
              <div className="flex justify-between py-4 align-middle">
                <span className="text-xl font-bold text-rentr-dark">Total Due</span>
                <span className="text-2xl font-bold text-rentr-gold">${job.invoice.amount}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
            Thank you for your business. Payment is due within 30 days.
          </div>
        </div>

        {/* Footer Action (Pay Button) */}
        {isAgent && job.status === 'Invoiced' && (
          <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end rounded-b-xl">
             <button 
               onClick={onPay}
               className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center gap-2"
             >
               Confirm & Pay Invoice
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceViewModal;