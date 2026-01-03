import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter, Bell } from 'lucide-react';
import InvoiceViewModal from '../components/InvoiceViewModal';
import ConfirmationModal from '../components/ConfirmationModal';
import API_URL from '../config';

const JobManagement = ({ jobs, refreshJobs }) => {
  const [invoiceView, setInvoiceView] = useState({ open: false, job: null });
  const [confirmPay, setConfirmPay] = useState({ open: false, job: null });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter Logic
  // 1. Show jobs if they are NOT Open OR if they are Open but have APPLICANTS (New Bids)
  // 2. Filter by search
  // 3. Filter by specific status dropdown
  const filteredJobs = jobs
    .filter(j => j.status !== 'Open' || j.applicants.length > 0) 
    .filter(j => 
      j.title.toLowerCase().includes(search.toLowerCase()) || 
      j.assignedTo?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(j => statusFilter === 'All' || j.status === statusFilter);

  const executePay = async () => {
    await fetch(`${API_URL}/api/jobs/${confirmPay.job.id}/pay`, { method: 'POST' });
    setConfirmPay({ open: false, job: null });
    refreshJobs();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-rentr-dark">All Jobs Manager</h1>
          <p className="text-slate-500">Track contracts, bids, and payments</p>
        </div>
      </div>

      {/* Toolbar: Search + Sort/Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rentr-gold transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-500" />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-rentr-gold cursor-pointer font-medium text-slate-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Stages</option>
            <option value="Open">New Bids</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Invoiced">Invoiced</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No jobs found matching your criteria.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-rentr-light text-rentr-dark font-bold text-sm uppercase">
              <tr>
                <th className="p-4">Job Title</th>
                <th className="p-4">Contractor</th>
                <th className="p-4">Current Stage</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map(job => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{job.title}</td>
                  
                  {/* Contractor Column */}
                  <td className="p-4">
                    {job.assignedTo ? (
                      <Link to="/profile/101" className="text-rentr-gold hover:underline font-medium">
                        {job.assignedTo}
                      </Link>
                    ) : (
                      <span className="text-slate-400 italic text-sm">Not Assigned</span>
                    )}
                  </td>

                  {/* Status Badges */}
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      job.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                      job.status === 'Invoiced' ? 'bg-blue-100 text-blue-700' : 
                      job.status === 'Completed' ? 'bg-orange-100 text-orange-700' :
                      job.status === 'Open' ? 'bg-rentr-gold text-white shadow-sm' : // Highlight for Open with Bids
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {job.status === 'Open' ? 'New Bids' : job.status}
                    </span>
                  </td>

                  {/* Action Column */}
                  <td className="p-4 text-right">
                    {job.status === 'Invoiced' && (
                      <button onClick={() => setInvoiceView({open: true, job})} className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-bold shadow hover:bg-green-700">
                        Pay Invoice
                      </button>
                    )}
                    {job.status === 'Paid' && (
                      <button onClick={() => setInvoiceView({open: true, job})} className="text-slate-400 hover:text-rentr-gold text-sm font-medium flex items-center gap-1 justify-end ml-auto">
                        <FileText size={16}/> View Receipt
                      </button>
                    )}
                    {job.status === 'Open' && (
                      <Link to="/dashboard" className="text-rentr-gold hover:text-rentr-dark text-sm font-bold flex items-center gap-1 justify-end ml-auto">
                        <Bell size={16} /> Review
                      </Link>
                    )}
                    {['Assigned', 'In Progress', 'Completed'].includes(job.status) && (
                      <span className="text-slate-400 text-sm italic">Tracking...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <InvoiceViewModal isOpen={invoiceView.open} job={invoiceView.job} onClose={() => setInvoiceView({ ...invoiceView, open: false })} onPay={() => { setInvoiceView({ ...invoiceView, open: false }); setConfirmPay({ open: true, job: invoiceView.job }); }} isAgent={true} />
      <ConfirmationModal isOpen={confirmPay.open} title="Approve Payment" message={`Release $${confirmPay.job?.invoice?.amount} to contractor?`} onConfirm={executePay} onCancel={() => setConfirmPay({ open: false, job: null })} confirmText="Pay Now" />
    </div>
  );
};

export default JobManagement;