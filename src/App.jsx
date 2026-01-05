import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LayoutDashboard, LogOut, Plus, Users, CheckCircle, Play, DollarSign, Clock, Wrench, Zap, Hammer, Wind, AlertCircle, FileText, User, Edit, Search, Filter, Briefcase, Bell, Trash2, Menu, X } from 'lucide-react';
import logo from './assets/logo.png';
import Login from './pages/Login';
import Profile from './pages/Profile';
import JobManagement from './pages/JobManagement'; 
import CreateJobModal from './components/CreateJobModal';
import EditJobModal from './components/EditJobModal'; 
import ApplicationModal from './components/ApplicationModal';
import InvoiceModal from './components/InvoiceModal';
import ConfirmationModal from './components/ConfirmationModal';
import API_URL from './config';

const getJobIcon = (type) => {
  switch(type) {
    case 'Plumbing': return <Wrench className="text-blue-500" />;
    case 'Electrical': return <Zap className="text-amber-500" />;
    case 'Carpentry': return <Hammer className="text-orange-500" />;
    case 'HVAC': return <Wind className="text-sky-500" />;
    default: return <AlertCircle className="text-rentr-gold" />;
  }
};

// --- AGENT DASHBOARD ---
const AgentDashboard = ({ jobs, refreshJobs }) => {
  const { user } = useAuth();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState({ open: false, job: null }); 
  const [selectedJob, setSelectedJob] = useState(null); 
  
  const [confirmAssign, setConfirmAssign] = useState({ open: false, job: null, applicant: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, jobId: null });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const openJobs = jobs.filter(j => j.status === 'Open')
    .filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(j => filterType === 'All' || j.type === filterType);

  const totalApplicants = openJobs.reduce((acc, job) => acc + (job.applicants ? job.applicants.length : 0), 0);
  const pendingInvoices = jobs.filter(j => j.status === 'Invoiced').length;

  const executeAssign = async () => {
    const { job, applicant } = confirmAssign;
    await fetch(`${API_URL}/api/jobs/${job.id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicantId: applicant.id, contractorName: applicant.name })
    });
    setConfirmAssign({ open: false, job: null, applicant: null });
    refreshJobs();
  };

  const executeDelete = async () => {
    if (!deleteModal.jobId) return;
    try {
      await fetch(`${API_URL}/api/jobs/${deleteModal.jobId}`, {
        method: 'DELETE',
      });
      refreshJobs();
      setDeleteModal({ open: false, jobId: null });
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-rentr-dark">Agent Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user.name}</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="w-full md:w-auto bg-rentr-gold text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-100 flex items-center justify-center gap-2 hover:bg-[#8e6b4d] transition-all">
          <Plus size={20} /> Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rentr-dark text-white p-6 rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
           <div>
             <div className="text-3xl font-bold mb-1">{totalApplicants}</div>
             <div className="text-sm text-slate-300 font-medium uppercase tracking-wider">Pending Applicants</div>
           </div>
           <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-rentr-gold">
             <Users size={24} />
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <div className="text-3xl font-bold text-rentr-dark mb-1">{pendingInvoices}</div>
             <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Invoices to Pay</div>
           </div>
           <div className="w-12 h-12 bg-rentr-light rounded-xl flex items-center justify-center text-rentr-dark">
             <FileText size={24} />
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
             <div className="text-3xl font-bold text-rentr-dark mb-1">{openJobs.length}</div>
             <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">Active Listings</div>
           </div>
           <div className="w-12 h-12 bg-rentr-light rounded-xl flex items-center justify-center text-rentr-dark">
             <Briefcase size={24} />
           </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search job titles..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-rentr-gold transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-slate-500" />
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-rentr-gold cursor-pointer w-full"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Carpentry">Carpentry</option>
            <option value="HVAC">HVAC</option>
          </select>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-rentr-light p-2 rounded-lg text-rentr-dark"><Users size={20}/></div>
          <h2 className="text-xl font-bold text-slate-800">Job Listings & Applications</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openJobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => setEditOpen({ open: true, job })} className="p-2 text-slate-300 hover:text-rentr-gold hover:bg-rentr-light rounded-lg transition-colors" title="Edit Job">
                  <Edit size={16} />
                </button>
                <button onClick={() => setDeleteModal({ open: true, jobId: job.id })} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Job">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-rentr-light rounded-xl">{getJobIcon(job.type)}</div>
              </div>
              <h3 className="font-bold text-lg text-rentr-dark mb-2 pr-8">{job.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">{job.description}</p>
              
              <div className="flex items-center gap-1 font-bold text-slate-800 mb-4">
                 <span className="text-xs text-slate-400 font-normal uppercase mr-1">Budget:</span>
                 <DollarSign size={16} className="text-green-600"/> {job.budget}
              </div>
              
              <div className="bg-rentr-light p-4 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">Applicants</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold shadow-sm ${
                    job.applicants && job.applicants.length > 0 ? 'bg-rentr-gold text-white' : 'bg-white text-slate-500'
                  }`}>
                    {job.applicants ? job.applicants.length : 0}
                  </span>
                </div>
                {job.applicants && job.applicants.length > 0 ? (
                   <button onClick={() => setSelectedJob(job)} className="w-full py-2 bg-rentr-dark text-white rounded-lg text-sm font-medium hover:bg-[#0a2024] flex items-center justify-center gap-2">
                     <Bell size={14} className="animate-pulse"/> Review Proposals
                   </button>
                ) : <div className="text-xs text-center text-slate-400 py-2">Waiting for bids...</div>}
              </div>
            </div>
          ))}
          {openJobs.length === 0 && <p className="text-slate-400 col-span-3 text-center py-10">No matching jobs found.</p>}
        </div>
      </section>

      <CreateJobModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} onJobCreated={() => { setCreateOpen(false); refreshJobs(); }} />
      <EditJobModal isOpen={isEditOpen.open} job={isEditOpen.job} onClose={() => setEditOpen({ open: false, job: null })} onJobUpdated={refreshJobs} />
      <ConfirmationModal isOpen={confirmAssign.open} title="Confirm Assignment" message={`Hire ${confirmAssign.applicant?.name}?`} onConfirm={executeAssign} onCancel={() => setConfirmAssign({ open: false, job: null, applicant: null })} confirmText="Hire" />
      <ConfirmationModal isOpen={deleteModal.open} title="Delete Job Listing" message="Are you sure you want to delete this job? This cannot be undone." onConfirm={executeDelete} onCancel={() => setDeleteModal({ open: false, jobId: null })} confirmText="Delete" />

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-rentr-dark/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 animate-slide-up m-4">
             <div className="flex justify-between mb-6">
               <h2 className="text-xl font-bold text-rentr-dark">Proposals for: <span className="text-rentr-gold">{selectedJob.title}</span></h2>
               <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">Close</button>
             </div>
             <div className="space-y-3">
               {selectedJob.applicants.map(app => (
                 <div key={app.id} className="border border-slate-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-rentr-light transition-colors group gap-4">
                   <div>
                     <Link to={`/profile/${app.contractor_id}`} className="font-bold text-lg text-rentr-dark group-hover:text-rentr-gold transition-colors hover:underline flex items-center gap-2">
                       {app.name} <span className="text-xs bg-rentr-light text-slate-500 px-2 py-0.5 rounded-full no-underline whitespace-nowrap">View Profile</span>
                     </Link>
                     <p className="text-slate-600 text-sm mt-1 italic">"{app.proposal}"</p>
                   </div>
                   <div className="text-left sm:text-right w-full sm:w-auto">
                     <div className="text-xl font-bold text-green-600 mb-2">${app.bid}</div>
                     <button onClick={() => { setConfirmAssign({ open: true, job: selectedJob, applicant: app }); setSelectedJob(null); }} className="w-full sm:w-auto bg-rentr-dark text-white px-5 py-2 rounded-lg text-sm font-bold shadow hover:bg-rentr-gold transition-colors">Hire</button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CONTRACTOR DASHBOARD ---
const ContractorDashboard = ({ jobs, refreshJobs }) => {
  const [applyModal, setApplyModal] = useState({ open: false, job: null });
  const [invoiceModal, setInvoiceModal] = useState({ open: false, job: null });
  const [confirmAction, setConfirmAction] = useState({ open: false, type: '', job: null });
  const [successModal, setSuccessModal] = useState({ open: false, message: '' });
  
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const [searchTerm, setSearchTerm] = useState(''); 
  const { user } = useAuth();

  const submitApplication = async (jobId, data) => {
    try {
      const response = await fetch(`${API_URL}/api/jobs/${jobId}/apply`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, contractorName: user.name }) 
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to apply");
      }
      
      refreshJobs();
      setSuccessModal({ open: true, message: "Your application has been sent to the agent successfully." });
    } catch (error) {
      console.error("Application Error:", error);
      setErrorModal({ open: true, message: "Could not apply: " + error.message });
    }
  };

  const executeStatusUpdate = async () => {
    const { job, type } = confirmAction;
    const newStatus = type === 'start' ? 'In Progress' : 'Completed';
    await fetch(`${API_URL}/api/jobs/${job.id}/status`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }) 
    });
    refreshJobs();
    setConfirmAction({ open: false, type: '', job: null });
  };

  const submitInvoice = async (jobId, data) => {
    await fetch(`${API_URL}/api/jobs/${jobId}/invoice`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data) 
    });
    refreshJobs();
    setInvoiceModal({ open: false, job: null }); 
    setSuccessModal({ open: true, message: "Invoice submitted successfully!" });
  };

  const myJobs = jobs.filter(j => j.assigned_to === user.name); 
  
  const availableJobs = jobs.filter(j => j.status === 'Open' && !j.applicants?.some(a => a.name === user.name))
                            .filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
         <div>
            <h1 className="text-2xl md:text-3xl font-bold text-rentr-dark">Contractor Hub</h1>
            <p className="text-slate-500">Welcome back, {user.name}</p>
         </div>
         <div className="bg-rentr-light px-4 py-2 rounded-lg">
            <span className="text-sm text-rentr-dark font-medium">Active Jobs: <b>{myJobs.length}</b></span>
         </div>
      </div>

      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><CheckCircle className="text-rentr-gold"/> My Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myJobs.map(job => (
             <div key={job.id} className="bg-white rounded-2xl shadow-lg shadow-slate-100 border border-slate-100 overflow-hidden flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-rentr-light rounded-xl">{getJobIcon(job.type)}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      job.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rentr-light text-rentr-dark'
                    }`}>{job.status}</span>
                  </div>
                  <h3 className="font-bold text-xl text-rentr-dark mb-2">{job.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{job.description}</p>
                </div>
                <div className="bg-rentr-light p-4 border-t border-slate-100">
                  {job.status === 'Assigned' && (
                    <button onClick={() => setConfirmAction({ open: true, type: 'start', job })} className="w-full bg-rentr-dark text-white py-3 rounded-xl font-bold hover:bg-[#0a2024] shadow-md transition-all">Start Work</button>
                  )}
                  {job.status === 'In Progress' && (
                    <button onClick={() => setConfirmAction({ open: true, type: 'complete', job })} className="w-full bg-rentr-gold text-white py-3 rounded-xl font-bold hover:bg-[#8e6b4d] shadow-md transition-all">Mark Complete</button>
                  )}
                  {job.status === 'Completed' && <button onClick={() => setInvoiceModal({ open: true, job })} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md transition-all">Send Invoice</button>}
                  {job.status === 'Invoiced' && <div className="text-center text-sm font-medium text-slate-500 flex items-center gap-2 justify-center"><Clock size={16}/> Processing...</div>}
                  {job.status === 'Paid' && <div className="text-center text-sm font-bold text-emerald-600 flex items-center gap-2 justify-center"><CheckCircle size={16}/> Paid</div>}
                </div>
             </div>
          ))}
          {myJobs.length === 0 && <p className="col-span-3 text-center text-slate-400 py-10">No active projects yet.</p>}
        </div>
      </section>

      <section className="pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Play className="text-rentr-gold"/> New Opportunities</h2>
          <div className="relative w-full md:w-auto">
             <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
             <input type="text" placeholder="Search..." className="w-full md:w-auto pl-9 pr-4 py-2 border rounded-lg text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableJobs.map(job => (
            <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rentr-gold transition-colors group flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-3">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{job.type}</span>
                </div>
                <h3 className="font-bold text-rentr-dark mb-1 group-hover:text-rentr-gold transition-colors">{job.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{job.description}</p>
                <div className="flex items-center gap-1 font-bold text-slate-900 mb-6">
                  <DollarSign size={16} className="text-green-600"/> {job.budget}
                </div>
              </div>
              <button 
                onClick={() => setApplyModal({ open: true, job })}
                className="w-full bg-rentr-light text-rentr-dark font-bold py-2 rounded-xl border border-slate-200 hover:bg-rentr-gold hover:text-white hover:border-rentr-gold transition-all shadow-sm"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      <ApplicationModal isOpen={applyModal.open} job={applyModal.job} onClose={() => setApplyModal({ open: false, job: null })} onSubmit={submitApplication} />
      <InvoiceModal isOpen={invoiceModal.open} job={invoiceModal.job} onClose={() => setInvoiceModal({ open: false, job: null })} onSubmit={submitInvoice} />
      <ConfirmationModal isOpen={confirmAction.open} title={confirmAction.type === 'start' ? "Start Project" : "Complete Project"} message="Are you sure?" onConfirm={executeStatusUpdate} onCancel={() => setConfirmAction({ open: false, type: '', job: null })} confirmText="Confirm" />
      
      <ConfirmationModal 
        isOpen={successModal.open} 
        title="Success" 
        message={successModal.message} 
        onConfirm={() => setSuccessModal({ open: false, message: '' })} 
        onCancel={() => setSuccessModal({ open: false, message: '' })} 
        confirmText="OK"
      />

      <ConfirmationModal 
        isOpen={errorModal.open} 
        title="Application Failed" 
        message={errorModal.message} 
        onConfirm={() => setErrorModal({ open: false, message: '' })} 
        onCancel={() => setErrorModal({ open: false, message: '' })} 
        confirmText="Close"
      />
    </div>
  );
};

// --- APP & LAYOUT (RESPONSIVE SIDEBAR) ---
const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation(); 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-rentr-light flex">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-rentr-dark text-white z-50 p-4 flex justify-between items-center shadow-md">
        <img src={logo} alt="Rentr Logo" className="h-8 w-auto brightness-0 invert" />
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Hidden on mobile unless opened */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-rentr-dark border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-screen
      `}>
        <div className="p-6 border-b border-slate-700 hidden md:block">
          <div className="flex items-center gap-2 mb-2">
             <img src={logo} alt="Rentr Logo" className="h-10 w-auto brightness-0 invert" />
          </div>
          <p className="text-xs text-slate-400 mt-2 uppercase tracking-wider pl-1">{user.role} workspace</p>
        </div>
        
        {/* Mobile Header in Sidebar */}
        <div className="p-6 border-b border-slate-700 md:hidden mt-14">
          <p className="text-xs text-slate-400 uppercase tracking-wider">{user.role} workspace</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link 
            to="/dashboard" 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-slate-800/50 text-rentr-gold border border-slate-700' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          
          <Link 
            to={`/profile/${user.id}`} 
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname.includes('/profile') ? 'bg-slate-800/50 text-rentr-gold border border-slate-700' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <User size={20} /> My Profile
          </Link>
          
          {user.role === 'agent' && (
            <Link 
              to="/job-management" 
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/job-management' ? 'bg-slate-800/50 text-rentr-gold border border-slate-700' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
            >
              <Briefcase size={20} /> Job Management
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-slate-700">
           <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-slate-800 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-rentr-gold flex items-center justify-center text-white font-bold text-xs">{user.name.charAt(0)}</div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate capitalize">{user.role}</p>
              </div>
           </div>
           <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-red-400 text-sm font-medium hover:bg-slate-800 rounded-lg transition-colors"><LogOut size={16}/> Sign Out</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 overflow-x-hidden">
        {children}
      </main>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = () => { 
    fetch(`${API_URL}/api/jobs`)
      .then(res => res.json())
      .then(setJobs)
      .catch(err => console.error("API Fetch Error:", err)); 
  };
  
  useEffect(() => { 
    fetchJobs(); 
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout><DashboardHomeWrapper jobs={jobs} refreshJobs={fetchJobs} /></DashboardLayout>} />
          <Route path="/profile/:id" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/job-management" element={<DashboardLayout><JobManagement jobs={jobs} refreshJobs={fetchJobs} /></DashboardLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const DashboardHomeWrapper = ({ jobs, refreshJobs }) => {
  const { user } = useAuth();
  if (user?.role === 'agent') return <AgentDashboard jobs={jobs} refreshJobs={refreshJobs} />;
  return <ContractorDashboard jobs={jobs} refreshJobs={refreshJobs} />;
};

export default App;