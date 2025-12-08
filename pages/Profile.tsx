import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Smartphone, Bell, Save, Camera, Edit2, Wallet } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  walletAddress?: string;
  userInfo?: {
    name?: string;
    email?: string;
    picture?: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ walletAddress, userInfo }) => {
  // Use passed props or fall back to defaults
  const [name, setName] = useState(userInfo?.name || 'Guest User');
  const [email, setEmail] = useState(userInfo?.email || 'guest@example.com');
  const [phone, setPhone] = useState('+234 801 234 5678');
  const [bloodType, setBloodType] = useState('O+');
  const [isEditing, setIsEditing] = useState(false);

  // Update state when props change (async login)
  useEffect(() => {
    if (userInfo?.name) setName(userInfo.name);
    if (userInfo?.email) setEmail(userInfo.email);
  }, [userInfo]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Profile & Settings</h2>
          <p className="text-slate-500">Manage your identity and preferences.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${isEditing ? 'bg-green-500 text-white' : 'bg-slate-900 text-white'}`}
        >
          {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit2 size={18} /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary to-blue-600"></div>
            <div className="relative mt-8 mb-4 inline-block">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-200 flex items-center justify-center overflow-hidden">
                {/* DISPLAY GOOGLE PICTURE IF AVAILABLE */}
                {userInfo?.picture ? (
                  <img src={userInfo.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-400" />
                )}
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-800">{name}</h3>
            
            <div className="bg-slate-50 rounded-xl p-3 mt-4 border border-slate-100 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Wallet size={16} className="text-primary" />
                <span className="font-mono">{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No Wallet'}</span>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Connected</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-primary" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <input type="text" value={name} disabled={!isEditing} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                <input type="email" value={email} disabled={true} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl opacity-70 cursor-not-allowed" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;