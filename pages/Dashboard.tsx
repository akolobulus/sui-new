
import React, { useState } from 'react';
import { Activity, Shield, Pill, AlertCircle, QrCode, UserPlus, Check, X, Phone, User } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AccessRequest } from '../types';

interface DashboardProps {
  accessRequests?: AccessRequest[];
  onApproveRequest?: (id: string) => void;
  onDenyRequest?: (id: string) => void;
}

const data = [
  { name: 'Jan', score: 65 },
  { name: 'Feb', score: 68 },
  { name: 'Mar', score: 75 },
  { name: 'Apr', score: 72 },
  { name: 'May', score: 85 },
  { name: 'Jun', score: 82 },
  { name: 'Jul', score: 90 },
];

const Dashboard: React.FC<DashboardProps> = ({ accessRequests = [], onApproveRequest, onDenyRequest }) => {
  const [showEmergencyID, setShowEmergencyID] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hello, David 👋</h2>
          <p className="text-slate-500">Your health identity is secure on Sui.</p>
        </div>
        <button 
          onClick={() => setShowEmergencyID(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          <QrCode size={18} />
          <span>Show Emergency ID</span>
        </button>
      </div>

      {/* Access Requests (Conditional Rendering) */}
      {accessRequests.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <UserPlus size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800">Pending Access Request</h3>
              <p className="text-slate-600 text-sm mt-1">
                A doctor is requesting permission to view and update your records on the blockchain.
              </p>
              
              <div className="mt-4 space-y-3">
                {accessRequests.map((req) => (
                  <div key={req.id} className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="font-bold text-slate-800">{req.doctorName}</p>
                      <p className="text-sm text-slate-500">{req.hospital}</p>
                      <p className="text-xs text-orange-600 mt-1 font-medium">{req.purpose}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={() => onDenyRequest?.(req.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                      >
                        <X size={16} /> Deny
                      </button>
                      <button 
                        onClick={() => onApproveRequest?.(req.id)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 font-medium transition-colors shadow-sm"
                      >
                        <Check size={16} /> Approve Access
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Heart Rate</p>
            <p className="text-xl font-bold text-slate-800">72 bpm</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Insurance</p>
            <p className="text-xl font-bold text-slate-800">Active</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-500 rounded-xl">
            <Pill size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Prescriptions</p>
            <p className="text-xl font-bold text-slate-800">2 Active</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Next Checkup</p>
            <p className="text-xl font-bold text-slate-800">3 Days</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Score Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Wellness Score History</h3>
            <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">+12% vs last month</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4DA2FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4DA2FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                  cursor={{stroke: '#4DA2FF', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="score" stroke="#4DA2FF" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Recent Updates</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 bg-primary rounded-full shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-slate-800">Claim Approved</p>
                <p className="text-xs text-slate-500">Your phone screen repair claim was auto-verified.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 bg-green-500 rounded-full shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-slate-800">Lab Results Added</p>
                <p className="text-xs text-slate-500">Lagos University Teaching Hospital updated your record.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">1 day ago</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 bg-orange-500 rounded-full shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-slate-800">Policy Renewal</p>
                <p className="text-xs text-slate-500">Student Shield expires in 14 days.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">3 days ago</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 text-sm text-primary font-medium border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
            View All Activity
          </button>
        </div>
      </div>

      {/* Emergency ID Modal */}
      {showEmergencyID && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200">
             {/* Close button */}
             <button 
               onClick={() => setShowEmergencyID(false)}
               className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors z-10"
             >
               <X size={20} />
             </button>

             {/* Red Header */}
             <div className="bg-red-500 p-6 pt-8 text-white text-center relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold uppercase tracking-wider">Emergency ID</h3>
                 <p className="text-red-100 text-sm font-medium mt-1">SuiCare Medical Network</p>
               </div>
               <Activity className="absolute -bottom-6 -left-6 w-32 h-32 text-red-400 opacity-50" />
             </div>

             {/* Content */}
             <div className="p-6 space-y-6">
                {/* Profile Pic & Name */}
                <div className="text-center -mt-12 mb-6">
                     <div className="w-20 h-20 bg-slate-200 rounded-full border-4 border-white mx-auto flex items-center justify-center text-slate-400 shadow-md overflow-hidden">
                         <User size={40} />
                     </div>
                     <h2 className="text-xl font-bold text-slate-900 mt-2">David Okon</h2>
                     <p className="text-slate-500 text-sm">Born 12 May 1998</p>
                </div>

                {/* Critical Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                        <p className="text-xs font-bold text-red-500 uppercase">Blood Type</p>
                        <p className="text-2xl font-black text-slate-800">O+</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                        <p className="text-xs font-bold text-red-500 uppercase">Genotype</p>
                        <p className="text-2xl font-black text-slate-800">AA</p>
                    </div>
                </div>

                {/* Allergies */}
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Allergies & Conditions</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold border border-red-200">Peanuts</span>
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold border border-red-200">Penicillin</span>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                         <Phone size={20} />
                     </div>
                     <div>
                         <p className="text-xs font-bold text-slate-400 uppercase">Emergency Contact</p>
                         <p className="font-bold text-slate-800">Mrs. Okon (Mother)</p>
                         <p className="text-slate-600 text-sm font-mono">+234 809 111 2222</p>
                     </div>
                </div>

                {/* QR Code Placeholder */}
                <div className="text-center pt-2">
                    <div className="bg-slate-900 p-4 rounded-xl inline-block shadow-lg">
                        <QrCode className="text-white w-24 h-24" />
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Scan by Paramedics for full history</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
