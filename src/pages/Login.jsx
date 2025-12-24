import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Briefcase, UserCheck, Star, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png'; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT SIDE: Brand & Testimonial */}
      <div className="hidden lg:flex w-1/2 bg-rentr-dark relative flex-col justify-between p-16 text-white overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rentr-gold/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {/* LOGO REPLACEMENT */}
        <div className="relative z-10 animate-fade-in">
          <img src={logo} alt="Rentr Logo" className="h-12 w-auto brightness-0 invert" />
        </div>

        {/* Testimonial Card */}
        <div className="relative z-10 max-w-lg animate-slide-up delay-200">
          <div className="bg-white text-rentr-dark p-8 rounded-3xl shadow-2xl border-l-8 border-rentr-gold">
            <div className="flex gap-1 text-rentr-gold mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <h2 className="text-2xl font-bold mb-4 leading-snug">
              "Finally, the door experience is better. Appreciated the welcome phone call. Strong response times. Keep up the good work."
            </h2>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">A</div>
              <div>
                <p className="font-bold text-sm">August 12th, 2025</p>
                <p className="text-slate-400 text-xs uppercase tracking-wide">Apple App Store Review</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-slate-400 text-sm animate-fade-in delay-300">
          © 2025 Rentr Ltd. Streamlining the entire rental process.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-rentr-light">
        <div className="w-full max-w-md animate-slide-up delay-100">
          <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/60 border border-white">
            <div className="text-center mb-10">
  
              <img src={logo} alt="Rentr" className="h-10 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-rentr-dark mb-2">Welcome Back</h2>
              <p className="text-slate-500">Please select your portal to continue</p>
            </div>

            <div className="space-y-4">
              {/* Contractor Button */}
              <button 
                onClick={() => handleLogin('contractor')}
                className="w-full group relative overflow-hidden p-1 rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-rentr-gold/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rentr-dark to-[#1a444d] transition-all"></div>
                <div className="relative bg-white m-[1px] rounded-[15px] p-4 flex items-center gap-4 group-hover:bg-opacity-95 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-rentr-light flex items-center justify-center group-hover:bg-rentr-gold group-hover:text-white transition-colors duration-300">
                    <Briefcase size={24} className="text-rentr-dark group-hover:text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-lg text-rentr-dark">Contractor Login</h3>
                    <p className="text-sm text-slate-500">Manage jobs & invoices</p>
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:text-rentr-gold -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </button>

              {/* Agent Button */}
              <button 
                onClick={() => handleLogin('agent')}
                className="w-full group relative overflow-hidden p-1 rounded-2xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-rentr-gold/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rentr-gold to-[#c49a72] transition-all"></div>
                <div className="relative bg-white m-[1px] rounded-[15px] p-4 flex items-center gap-4 group-hover:bg-opacity-95 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-rentr-light flex items-center justify-center group-hover:bg-rentr-dark group-hover:text-white transition-colors duration-300">
                    <UserCheck size={24} className="text-rentr-gold group-hover:text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-lg text-rentr-dark">Agent Login</h3>
                    <p className="text-sm text-slate-500">Assign work & approve pay</p>
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:text-rentr-dark -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </button>
            </div>

            <div className="mt-8 text-center text-sm text-slate-400">
              By signing in, you agree to Rentr's Terms & Conditions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;