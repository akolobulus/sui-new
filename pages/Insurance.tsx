
import React, { useState } from 'react';
import { Shield, Smartphone, BriefcaseMedical, GraduationCap, CheckCircle2, ChevronRight, Plus, Laptop, Bike, Box, X, Camera, Wallet, Loader2 } from 'lucide-react';
import { InsurancePolicy, Device, PolicyPlan, Claim } from '../types';

interface InsuranceProps {
  policies: InsurancePolicy[];
  claims: Claim[];
  walletBalance: number;
  onBuyPolicy: (plan: PolicyPlan) => void;
  onSubmitClaim: (claim: Omit<Claim, 'id' | 'status'>) => void;
}

const MOCK_DEVICES: Device[] = [
  {
    id: 'DEV-1',
    name: 'iPhone 15 Pro Max',
    type: 'Phone',
    serialNumber: 'H9283749281',
    imei: '356938035643821',
    purchaseDate: '2023-11-01',
    value: 1500, // SUI
    isInsured: true,
  }
];

const MARKET_PLANS: PolicyPlan[] = [
  {
    id: 'PLAN-001',
    type: 'Device',
    name: 'Gadget Shield Premium',
    description: 'Full coverage for accidental damage, theft, and screen cracks.',
    coverageAmount: 1500,
    premium: 5,
    durationDays: 30,
    icon: 'Smartphone',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    id: 'PLAN-002',
    type: 'Health',
    name: 'Basic Health Cover',
    description: 'Emergency treatments, malaria, and typhoid coverage.',
    coverageAmount: 500,
    premium: 2.5,
    durationDays: 30,
    icon: 'BriefcaseMedical',
    color: 'bg-red-50 text-red-600'
  },
  {
    id: 'PLAN-003',
    type: 'Student Shield',
    name: 'Campus Life Bundle',
    description: 'Device protection + Accident cover for students.',
    coverageAmount: 200,
    premium: 1,
    durationDays: 30,
    icon: 'GraduationCap',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    id: 'PLAN-004',
    type: 'Travel',
    name: 'Transit Safe',
    description: 'Goods in transit protection against loss/damage.',
    coverageAmount: 1000,
    premium: 1.5,
    durationDays: 7,
    icon: 'Shield',
    color: 'bg-blue-50 text-blue-600'
  }
];

const Insurance: React.FC<InsuranceProps> = ({ policies, claims, walletBalance, onBuyPolicy, onSubmitClaim }) => {
  const [activeTab, setActiveTab] = useState<'my-policies' | 'devices' | 'market' | 'claims'>('my-policies');
  const [isRegisterDeviceOpen, setIsRegisterDeviceOpen] = useState(false);
  
  // Payment Modal
  const [selectedPlan, setSelectedPlan] = useState<PolicyPlan | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Claim Form
  const [claimForm, setClaimForm] = useState({
    policyId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    type: 'Phone',
    name: '',
    serialNumber: '',
    imei: '',
    value: 0
  });

  const handleRegisterDevice = (e: React.FormEvent) => {
    e.preventDefault();
    const device: Device = {
      id: `DEV-${Date.now()}`,
      name: newDevice.name || 'Unknown Device',
      type: newDevice.type as any,
      serialNumber: newDevice.serialNumber || '',
      imei: newDevice.imei,
      purchaseDate: new Date().toISOString().split('T')[0],
      value: newDevice.value || 0,
      isInsured: false
    };
    setDevices([...devices, device]);
    setIsRegisterDeviceOpen(false);
    setNewDevice({ type: 'Phone', name: '', serialNumber: '', imei: '', value: 0 });
  };

  const confirmPurchase = () => {
    if (!selectedPlan) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      onBuyPolicy(selectedPlan);
      setIsProcessingPayment(false);
      setSelectedPlan(null);
      setActiveTab('my-policies');
    }, 2000);
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const policy = policies.find(p => p.id === claimForm.policyId);
    if (!policy) return;

    onSubmitClaim({
      policyId: policy.id,
      policyName: policy.name,
      amount: parseFloat(claimForm.amount),
      date: claimForm.date,
    });
    setClaimForm({ policyId: '', amount: '', date: '' }); // Reset form
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Insurance Hub</h2>
          <p className="text-slate-500">Blockchain-secured protection for what matters most.</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
          <Wallet size={18} className="text-primary" />
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Sui Wallet</p>
            <p className="font-mono font-bold">SUI {walletBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto pb-1">
        <button 
          onClick={() => setActiveTab('my-policies')}
          className={`pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'my-policies' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}
        >
          My Policies
        </button>
        <button 
          onClick={() => setActiveTab('devices')}
          className={`pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'devices' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}
        >
          Registered Devices
        </button>
        <button 
          onClick={() => setActiveTab('market')}
          className={`pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'market' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}
        >
          Buy Coverage
        </button>
        <button 
          onClick={() => setActiveTab('claims')}
          className={`pb-3 px-1 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'claims' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}
        >
          Claims Center
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        
        {/* MY POLICIES */}
        {activeTab === 'my-policies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {policies.map((policy) => (
               <div key={policy.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                 <div className="bg-primary/5 p-6 flex justify-between items-start">
                   <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                     {policy.type === 'Device' && <Smartphone size={24} />}
                     {policy.type === 'Student Shield' && <GraduationCap size={24} />}
                     {policy.type === 'Health' && <BriefcaseMedical size={24} />}
                     {policy.type === 'Travel' && <Shield size={24} />}
                   </div>
                   <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                     {policy.status}
                   </span>
                 </div>
                 <div className="p-6">
                   <h3 className="font-bold text-slate-800 text-lg mb-1">{policy.name}</h3>
                   <p className="text-sm text-slate-500 mb-4">{policy.id}</p>
                   
                   <div className="space-y-2 mb-6">
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-500">Coverage</span>
                       <span className="font-medium text-slate-800">SUI {policy.coverageAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-500">Expires</span>
                       <span className="font-medium text-slate-800">{policy.expiryDate}</span>
                     </div>
                   </div>

                   <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:border-primary hover:text-primary transition-colors">
                     View Certificate
                   </button>
                 </div>
               </div>
             ))}
             
             <button onClick={() => setActiveTab('market')} className="flex flex-col items-center justify-center h-full min-h-[300px] border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all gap-3">
               <Plus size={32} />
               <span className="font-medium">Add New Policy</span>
             </button>
          </div>
        )}

        {/* DEVICES */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h3 className="font-bold text-slate-800">My Gadgets & Assets</h3>
               <button 
                 onClick={() => setIsRegisterDeviceOpen(true)}
                 className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md hover:bg-blue-600 transition-colors"
               >
                 <Plus size={18} /> Register New Device
               </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {devices.map((device) => (
                 <div key={device.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                        {device.type === 'Phone' && <Smartphone size={24} />}
                        {device.type === 'Laptop' && <Laptop size={24} />}
                        {device.type === 'Bike' && <Bike size={24} />}
                        {device.type === 'Other' && <Box size={24} />}
                      </div>
                      {device.isInsured ? (
                        <span className="bg-green-50 text-green-600 text-[10px] uppercase font-bold px-2 py-1 rounded-full border border-green-100">Insured</span>
                      ) : (
                        <span className="bg-orange-50 text-orange-600 text-[10px] uppercase font-bold px-2 py-1 rounded-full border border-orange-100">Uninsured</span>
                      )}
                    </div>
                    
                    <h4 className="font-bold text-slate-800 text-lg">{device.name}</h4>
                    <p className="text-sm text-slate-500 mb-4">{device.serialNumber}</p>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex justify-between text-sm py-2 border-t border-slate-50">
                        <span className="text-slate-500">Value</span>
                        <span className="font-medium text-slate-800">SUI {device.value.toLocaleString()}</span>
                      </div>
                      {!device.isInsured && (
                        <button onClick={() => setActiveTab('market')} className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                          Buy Insurance
                        </button>
                      )}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* MARKETPLACE */}
        {activeTab === 'market' && (
          <div className="space-y-8">
             <div className="bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden">
               <div className="relative z-10 max-w-xl">
                 <h3 className="text-3xl font-bold mb-4">Micro-Insurance starting at 0.1 SUI/day</h3>
                 <p className="mb-6 opacity-90">Instant coverage for your gadgets, health emergencies, and travel. Powered by smart contracts for automatic payouts.</p>
                 <div className="flex gap-4 text-sm font-medium bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                   <Wallet size={20} />
                   <span>Your Wallet Balance: SUI {walletBalance.toLocaleString()}</span>
                 </div>
               </div>
               <Shield className="absolute right-[-20px] bottom-[-40px] w-64 h-64 text-white opacity-10 rotate-12" />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {MARKET_PLANS.map((plan) => (
                  <div key={plan.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${plan.color}`}>
                        {plan.type === 'Device' && <Smartphone size={28} />}
                        {plan.type === 'Health' && <BriefcaseMedical size={28} />}
                        {plan.type === 'Student Shield' && <GraduationCap size={28} />}
                        {plan.type === 'Travel' && <Shield size={28} />}
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-bold text-slate-800">SUI {plan.premium.toLocaleString()}</p>
                         <p className="text-xs text-slate-500 font-medium">/ {plan.durationDays} days</p>
                      </div>
                    </div>

                    <h4 className="font-bold text-xl text-slate-800 mb-2">{plan.name}</h4>
                    <p className="text-slate-600 text-sm mb-6 flex-1">{plan.description}</p>

                    <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Coverage Limit</span>
                        <span className="font-bold text-slate-800">SUI {plan.coverageAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Deductible</span>
                        <span className="font-bold text-slate-800">SUI {(plan.coverageAmount * 0.05).toLocaleString()} (5%)</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* CLAIMS CENTER */}
        {activeTab === 'claims' && (
           <div className="grid lg:grid-cols-3 gap-8">
             {/* Submission Form */}
             <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
               <div className="text-center mb-8">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                   <CheckCircle2 size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800">File a New Claim</h3>
                 <p className="text-slate-500 mt-2">Our smart contracts verify evidence and payout instantly.</p>
               </div>

               <form onSubmit={handleClaimSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Policy</label>
                    <select 
                      required
                      value={claimForm.policyId}
                      onChange={(e) => setClaimForm({...claimForm, policyId: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                    >
                      <option value="">-- Choose Policy --</option>
                      {policies.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Coverage: SUI {p.coverageAmount.toLocaleString()})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Claim Amount (SUI)</label>
                    <input 
                      type="number" 
                      required
                      value={claimForm.amount}
                      onChange={(e) => setClaimForm({...claimForm, amount: e.target.value})}
                      placeholder="e.g. 50"
                      step="0.1"
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Incident Date</label>
                    <input 
                      type="date" 
                      required
                      value={claimForm.date}
                      onChange={(e) => setClaimForm({...claimForm, date: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Evidence (Photo/Report)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors">
                      <p className="text-sm text-slate-500">Tap to upload or take a photo</p>
                      <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, PDF</p>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                    Submit Claim to Blockchain <ChevronRight size={20} />
                  </button>
               </form>
             </div>

             {/* Claim History */}
             <div className="space-y-4">
               <h3 className="font-bold text-slate-800">Recent Claims</h3>
               {claims.length === 0 ? (
                 <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-400">
                   <p className="text-sm">No claims submitted yet.</p>
                 </div>
               ) : (
                 claims.map((claim) => (
                   <div key={claim.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-slate-400">{claim.id}</span>
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${claim.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {claim.status}
                       </span>
                     </div>
                     <p className="font-bold text-slate-800 text-sm mb-1">{claim.policyName}</p>
                     <div className="flex justify-between text-xs text-slate-500">
                       <span>{claim.date}</span>
                       <span className="font-medium text-slate-700">SUI {claim.amount.toLocaleString()}</span>
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>
        )}
      </div>

      {/* Device Registration Modal */}
      {isRegisterDeviceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Register New Device</h3>
              <button onClick={() => setIsRegisterDeviceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRegisterDevice} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Device Type</label>
                  <select 
                    value={newDevice.type}
                    onChange={(e) => setNewDevice({...newDevice, type: e.target.value as any})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                  >
                    <option value="Phone">Smartphone</option>
                    <option value="Laptop">Laptop / PC</option>
                    <option value="Bike">Electric Bike</option>
                    <option value="Other">Other Electronics</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Est. Value (SUI)</label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 500"
                    value={newDevice.value || ''}
                    onChange={(e) => setNewDevice({...newDevice, value: parseFloat(e.target.value)})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Device Name / Model</label>
                <input 
                  type="text"
                  placeholder="e.g. Samsung Galaxy S24 Ultra"
                  required
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">IMEI / Serial Number</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Enter unique identifier"
                    required
                    value={newDevice.imei || newDevice.serialNumber}
                    onChange={(e) => setNewDevice({...newDevice, imei: e.target.value, serialNumber: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded">
                    Unique ID
                  </div>
                </div>
                <p className="text-[10px] text-slate-400">Dial *#06# to get your IMEI on phones.</p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Proof of Ownership</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                  <Camera size={20} className="mb-2" />
                  <span className="text-sm">Upload Receipt or Device Photo</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsRegisterDeviceOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                >
                  Register Object
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-lg text-slate-800">Confirm Purchase</h3>
               <button onClick={() => setSelectedPlan(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
               </button>
             </div>
             
             <div className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-slate-500 mb-1">Total Premium</p>
                  <p className="text-4xl font-bold text-slate-900">SUI {selectedPlan.premium.toLocaleString()}</p>
                  <p className="text-sm text-slate-500 mt-2">{selectedPlan.name}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-sm">
                   <div className="flex justify-between">
                     <span className="text-slate-500">Wallet Balance</span>
                     <span className="font-medium text-slate-800">SUI {walletBalance.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between border-t border-slate-200 pt-3">
                     <span className="text-slate-500">Remaining after</span>
                     <span className={`font-bold ${walletBalance >= selectedPlan.premium ? 'text-green-600' : 'text-red-500'}`}>
                       SUI {(walletBalance - selectedPlan.premium).toLocaleString()}
                     </span>
                   </div>
                </div>

                <button 
                  onClick={confirmPurchase}
                  disabled={isProcessingPayment || walletBalance < selectedPlan.premium}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Confirm Payment
                    </>
                  )}
                </button>
                {walletBalance < selectedPlan.premium && (
                  <p className="text-center text-xs text-red-500 font-medium">Insufficient funds in Sui Wallet.</p>
                )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Insurance;
