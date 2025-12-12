import React, { useState } from 'react';
import { ShieldAlert, UserPlus, HeartPulse, Save, Loader2, Lock, Users } from 'lucide-react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

// ✅ IMPORT CONSTANTS (No more hardcoding!)
import { PACKAGE_ID, MODULE_NAME } from '../pages/constants';

const Guardians: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [activeTab, setActiveTab] = useState<'profile' | 'guardians'>('profile');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form States
  const [profile, setProfile] = useState({
    name: '',
    bloodType: 'O+',
    allergies: '',
    medications: '',
    organDonor: false
  });

  const [guardianAddress, setGuardianAddress] = useState('');

  // --- ACTIONS ---

  const handleCreateProfile = () => {
    if (!currentAccount) return alert("Connect Wallet!");
    setIsProcessing(true);

    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::create_profile`,
        arguments: [
            tx.pure.string(profile.name),
            tx.pure.string(profile.bloodType),
            tx.pure.string(profile.allergies),
            tx.pure.string(profile.medications),
            tx.pure.bool(profile.organDonor)
        ]
    });

    signAndExecute({ transaction: tx }, {
        onSuccess: () => {
            alert("Emergency Profile Created on Blockchain!");
            setIsProcessing(false);
        },
        onError: (err) => { alert("Failed: " + err.message); setIsProcessing(false); }
    });
  };

  const handleAddGuardian = () => {
    if (!currentAccount || !guardianAddress) return alert("Enter address!");
    setIsProcessing(true);

    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::add_guardian`,
        arguments: [
            tx.pure.address(guardianAddress),
            tx.pure.string(profile.name || "Unknown Patient"),
            tx.object('0x6') // Clock
        ]
    });

    signAndExecute({ transaction: tx }, {
        onSuccess: () => {
            alert(`Guardian Pass sent to ${guardianAddress.slice(0,6)}...!`);
            setGuardianAddress('');
            setIsProcessing(false);
        },
        onError: (err) => { alert("Failed: " + err.message); setIsProcessing(false); }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
         <div className="bg-red-100 p-4 rounded-full text-red-600">
             <ShieldAlert size={40} />
         </div>
         <div>
             <h2 className="text-2xl font-bold text-red-900">Emergency & Guardians</h2>
             <p className="text-red-700">Set up your critical medical data and assign trusted family members who can access it in an emergency.</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
              1. My Emergency Profile
          </button>
          <button 
            onClick={() => setActiveTab('guardians')}
            className={`pb-3 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'guardians' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
              2. Manage Guardians
          </button>
      </div>

      {/* Content */}
      {activeTab === 'profile' ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <HeartPulse className="text-red-500" /> Critical Medical Info
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Full Name</label>
                      <input type="text" className="w-full p-3 border rounded-xl bg-slate-50" placeholder="e.g. John Doe" 
                        value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Blood Type</label>
                      <select className="w-full p-3 border rounded-xl bg-slate-50"
                        value={profile.bloodType} onChange={(e) => setProfile({...profile, bloodType: e.target.value})}>
                          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                  </div>
                  <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Allergies</label>
                      <textarea className="w-full p-3 border rounded-xl bg-slate-50" rows={2} placeholder="e.g. Peanuts, Penicillin"
                        value={profile.allergies} onChange={(e) => setProfile({...profile, allergies: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Current Medications</label>
                      <textarea className="w-full p-3 border rounded-xl bg-slate-50" rows={2} placeholder="e.g. Insulin, Aspirin"
                        value={profile.medications} onChange={(e) => setProfile({...profile, medications: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2 bg-slate-50 p-4 rounded-xl">
                      <input type="checkbox" id="donor" className="w-5 h-5 text-primary" 
                        checked={profile.organDonor} onChange={(e) => setProfile({...profile, organDonor: e.target.checked})} />
                      <label htmlFor="donor" className="font-medium text-slate-700">I am an Organ Donor</label>
                  </div>
              </div>

              <button 
                onClick={handleCreateProfile}
                disabled={isProcessing || !profile.name}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  Save Profile to Blockchain
              </button>
          </div>
      ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                  <Users className="text-blue-500" /> Assign Guardians
              </h3>
              <p className="text-sm text-slate-500">
                  Guardians will receive a specialized NFT key that allows them to view your emergency profile if you are incapacitated.
              </p>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <label className="text-xs font-bold text-blue-600 uppercase block mb-1">Guardian Wallet Address</label>
                  <div className="flex gap-2">
                      <input type="text" className="flex-1 p-3 border border-blue-200 rounded-xl" placeholder="0x..." 
                        value={guardianAddress} onChange={(e) => setGuardianAddress(e.target.value)} />
                      <button 
                        onClick={handleAddGuardian}
                        disabled={isProcessing}
                        className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2"
                      >
                          {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <UserPlus size={18} />}
                          Grant Access
                      </button>
                  </div>
              </div>

              <div className="border-t pt-6">
                  <h4 className="font-bold text-slate-700 mb-4">Active Guardians</h4>
                  <div className="space-y-3">
                      {/* Mock list for demo visual */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-3">
                              <div className="bg-green-100 p-2 rounded-full text-green-600"><Lock size={16}/></div>
                              <div>
                                  <p className="font-bold text-slate-800 text-sm">Example Guardian</p>
                                  <p className="text-xs text-slate-500 font-mono">0x123...456</p>
                              </div>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Active</span>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Guardians;