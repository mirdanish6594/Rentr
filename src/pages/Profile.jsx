import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Briefcase, ArrowLeft, Mail, Phone, ShieldCheck, MapPin } from 'lucide-react';
import API_URL from '../config';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Default to ID 101 if none provided
    const contractorId = id || 101; 

    fetch(`${API_URL}/api/contractors/${contractorId}`)
      .then(res => {
        if (!res.ok) throw new Error("Profile not found");
        return res.json();
      })
      .then(data => {
        // --- DATA ADAPTER ---
        // We transform the backend data to match this specific UI's needs
        const adaptedProfile = {
          ...data,
          // Map 'completed_jobs' (backend) to 'jobsCompleted' (frontend UI)
          jobsCompleted: data.completed_jobs || 0,
          // Ensure 'history' exists so the map function doesn't crash
          history: data.history || [] 
        };
        
        setProfile(adaptedProfile);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading profile:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-rentr-light">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 bg-rentr-gold rounded-full mb-4"></div>
        <p className="text-rentr-dark font-medium">Loading Profile...</p>
      </div>
    </div>
  );

  if (!profile) return <div className="p-10 text-center">Profile not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-2 text-slate-500 hover:text-rentr-gold transition-colors duration-300"
      >
        <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="font-medium">Back to Dashboard</span>
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden animate-slide-up">
        {/* Brand Header Background */}
        <div className="h-40 bg-rentr-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rentr-gold/10 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row justify-between items-end -mt-16 mb-8 gap-6">
            <div className="flex items-end gap-6">
              {/* Avatar with Gold Border */}
              <div className="w-36 h-36 rounded-full border-[6px] border-white bg-slate-100 flex items-center justify-center text-5xl font-bold text-rentr-dark shadow-lg">
                {profile.name ? profile.name.charAt(0) : 'U'}
              </div>
              <div className="mb-2">
                <h1 className="text-4xl font-bold text-rentr-dark tracking-tight">{profile.name}</h1>
                <p className="text-rentr-gold font-bold flex items-center gap-2 mt-1">
                  <Briefcase size={18} className="stroke-[2.5px]" /> {profile.role}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 w-full md:w-auto">
               <button className="flex-1 md:flex-none px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                 <Mail size={18}/> Message
               </button>
               <button className="flex-1 md:flex-none px-6 py-3 bg-rentr-gold text-white rounded-xl text-sm font-bold hover:bg-[#8e6b4d] shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2">
                 <Phone size={18}/> Contact
               </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 pt-8">
            <div className="flex flex-col items-center justify-center p-4 bg-rentr-light/50 rounded-2xl hover:bg-rentr-light transition-colors duration-300">
              {/* Updated to use the variable we mapped in useEffect */}
              <div className="text-3xl font-bold text-rentr-dark">{profile.jobsCompleted}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Jobs Completed</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-rentr-light/50 rounded-2xl hover:bg-rentr-light transition-colors duration-300 border-x-0 md:border-x border-white">
              <div className="text-3xl font-bold text-rentr-gold flex items-center gap-2">
                {profile.rating} <Star size={24} fill="currentColor" />
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Client Rating</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-rentr-light/50 rounded-2xl hover:bg-rentr-light transition-colors duration-300">
              <div className="text-3xl font-bold text-emerald-600 flex items-center gap-2">
                <ShieldCheck size={28} /> 100%
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Verified Pro</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up delay-100">
        {/* Left Column: Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="font-bold text-rentr-dark mb-4 text-lg">About Me</h3>
            <p className="text-slate-600 text-sm leading-7">{profile.bio}</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-xl transition-shadow duration-300">
            <h3 className="font-bold text-rentr-dark mb-4 text-lg">Credentials</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">Licensed</span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">Insured</span>
              <span className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">5+ Years Exp</span>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="font-bold text-sm text-slate-800 mb-2">Service Area</h4>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin size={16} className="text-rentr-gold" />
                <span>Greater New York Area</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Work History */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100 h-full">
            <h3 className="font-bold text-rentr-dark mb-6 text-lg">Recent Work History</h3>
            <div className="space-y-4">
              {/* Safely map over history even if it's empty */}
              {profile.history.map((job, idx) => (
                <div 
                  key={idx} 
                  className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-rentr-gold/50 hover:shadow-md hover:bg-slate-50 transition-all duration-300 cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rentr-light flex items-center justify-center text-rentr-dark group-hover:bg-rentr-gold group-hover:text-white transition-colors duration-300">
                    <Briefcase size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800 text-lg group-hover:text-rentr-dark transition-colors">{job.title}</h4>
                      <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">{job.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                         <Star key={i} size={14} className={i < job.rating ? "text-rentr-gold fill-current" : "text-slate-200"} />
                      ))}
                      <span className="text-xs text-slate-400 ml-2 font-medium">Verified Client</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* This message will appear since history is empty in the backend currently */}
              {profile.history.length === 0 && (
                <div className="text-center py-12 bg-rentr-light/30 rounded-2xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400">No work history available yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;