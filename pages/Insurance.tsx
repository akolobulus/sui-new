import React, { useState } from 'react';
import { Shield, Smartphone, BriefcaseMedical, GraduationCap, Plus, Wallet, Loader2 } from 'lucide-react';
import { InsurancePolicy, Device, PolicyPlan, Claim } from '../types';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

// ✅ IMPORT CONSTANTS
import { PACKAGE_ID, MODULE_NAME, INSURANCE_VAULT_ID } from '../pages/constants';

interface InsuranceProps {
  policies: InsurancePolicy[];
  claims: Claim[];
  walletBalance: number;
  onBuyPolicy: (plan: PolicyPlan) => void;
  onSubmitClaim: (claim: Omit<Claim, 'id' | 'status'>) => void;
}

// Low cost plans for testing (0.01 - 0.05 SUI)
const MARKET_PLANS: PolicyPlan[] = [
 // {
   // id: 'PLAN-001',
    //type: 'Device',
    //name: 'Gadget Shield Premium',
    //description: 'Full coverage for accidental damage, theft, and screen cracks.',
    //coverageAmount: 1500,
    //premium: 0.05,
    //durationDays: 30,
    //icon: 'Smartphone',
    //color: 'bg-purple-50 text-purple-600'
  //},
  {
    id: 'PLAN-002',
    type: 'Health',
    name: 'Basic Health Cover',
    description: 'Emergency treatments, malaria, and typhoid coverage.',
    coverageAmount: 500,
    premium: 0.02,
    durationDays: 30,
    icon: 'BriefcaseMedical',
    color: 'bg-red-50 text-red-600'
  },
  // {
  //   id: 'PLAN-003',
  //   type: 'Student Shield',
  //   name: 'Campus Life Bundle',
  //   description: 'Device protection + Accident cover for students.',
  //   coverageAmount: 200,
  //   premium: 0.01,
  //   durationDays: 30,
  //   icon: 'GraduationCap',
  //   color: 'bg-orange-50 text-orange-600'
  // },
  // {
  //   id: 'PLAN-004',
  //   type: 'Travel',
  //   name: 'Transit Safe',
  //   description: 'Goods in transit protection against loss/damage.',
  //   coverageAmount: 1000,
  //   premium: 0.03,
  //   durationDays: 7,
  //   icon: 'Shield',
  //   color: 'bg-blue-50 text-blue-600'
  // }
];

const Insurance: React.FC<InsuranceProps> = ({ policies: mockPolicies, claims: mockClaims, onBuyPolicy, onSubmitClaim }) => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // 1. Get Real SUI Balance
  const { data: balanceData } = useSuiClientQuery(
    'getBalance',
    { owner: currentAccount?.address || '' },
    { enabled: !!currentAccount, refetchInterval: 5000 }
  );
  const realBalance = balanceData ? (parseInt(balanceData.totalBalance) / 1_000_000_000) : 0;

  // 2. Fetch Real Policies
  const { data: policyObjects, refetch: refetchPolicies } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::InsurancePolicy` },
      options: { showContent: true }
    },
    { enabled: !!currentAccount, refetchInterval: 5000 }
  );

  // 3. Fetch Real Claims
  const { data: claimObjects, refetch: refetchClaims } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::Claim` },
      options: { showContent: true }
    },
    { enabled: !!currentAccount, refetchInterval: 5000 }
  );

  const realPolicies: InsurancePolicy[] = policyObjects?.data.map((obj: any) => {
    const fields = obj.data?.content?.fields;
    return {
      id: obj.data?.objectId,
      type: fields?.policy_type,
      name: `${fields?.policy_type} Protection`,
      coverageAmount: parseInt(fields?.coverage_amount),
      premium: parseInt(fields?.premium) / 1_000_000_000,
      expiryDate: new Date(Number(fields?.expiry_date)).toISOString().split('T')[0],
      status: fields?.is_active ? 'Active' : 'Expired',
      icon: fields?.policy_type === 'Device' ? 'Smartphone' : 'Shield'
    };
  }) || [];

  const realClaims: Claim[] = claimObjects?.data.map((obj: any) => {
    const fields = obj.data?.content?.fields;
    return {
        id: obj.data?.objectId,
        policyId: fields?.policy_id,
        policyName: "Policy Claim",
        date: new Date(Number(fields?.date_filed)).toISOString().split('T')[0],
        status: 'Pending', 
        amount: parseInt(fields?.amount)
    };
  }) || [];

  const allPolicies = [...realPolicies, ...mockPolicies];
  const allClaims = [...realClaims, ...mockClaims];

  const [activeTab, setActiveTab] = useState<'my-policies' | 'devices' | 'market' | 'claims'>('my-policies');
  const [isRegisterDeviceOpen, setIsRegisterDeviceOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PolicyPlan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [claimForm, setClaimForm] = useState({
    policyId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    reason: ''
  });

  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'DEV-1',
      name: 'iPhone 15 Pro Max',
      type: 'Phone',
      serialNumber: 'H9283749281',
      imei: '356938035643821',
      purchaseDate: '2023-11-01',
      value: 1500,
      isInsured: false,
    }
  ]);

  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    type: 'Phone',
    name: '',
    serialNumber: '',
    imei: '',
    value: 0
  });

  // --- ACTIONS ---

  const handleBuyPolicySubmit = async () => {
    if (!selectedPlan || !currentAccount) return;

    if (!INSURANCE_VAULT_ID || INSURANCE_VAULT_ID.includes("YOUR_NEW")) {
        alert("⚠️ Update the INSURANCE_VAULT_ID in constants.ts with your new Shared Object ID!");
        return;
    }
    
    setIsProcessing(true);

    try {
      const tx = new Transaction();
      const premiumInMist = Math.floor(selectedPlan.premium * 1_000_000_000);
      const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(premiumInMist)]);

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::buy_policy`,
        arguments: [
          tx.object(INSURANCE_VAULT_ID), 
          paymentCoin,                
          tx.pure.string(selectedPlan.type),
          tx.pure.u64(premiumInMist), 
          tx.pure.u64(selectedPlan.coverageAmount),
          tx.pure.u64(selectedPlan.durationDays * 24 * 60 * 60 * 1000), 
          tx.object('0x6') 
        ],
      });

      signAndExecute({ transaction: tx }, {
        onSuccess: (result) => {
          alert(`Policy Purchased! Transaction ID: ${result.digest}`);
          setIsProcessing(false);
          setSelectedPlan(null);
          setActiveTab('my-policies');
          refetchPolicies();
        },
        onError: (err) => {
          console.error(err);
          alert("Purchase Failed. " + err.message);
          setIsProcessing(false);
        }
      });
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) return alert("Connect Wallet!");
    setIsProcessing(true);

    try {
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::submit_claim`,
            arguments: [
                tx.pure.address(claimForm.policyId), // Pass policy ID
                tx.pure.u64(Number(claimForm.amount)),
                tx.pure.string(claimForm.reason),
                tx.object('0x6')
            ]
        });

        signAndExecute({ transaction: tx }, {
            onSuccess: () => {
                alert("Claim Submitted to Blockchain!");
                setClaimForm({ policyId: '', amount: '', date: '', reason: '' });
                setActiveTab('claims');
                refetchClaims();
                setIsProcessing(false);
            },
            onError: (err) => {
                console.error(err);
                alert("Claim Failed: " + err.message);
                setIsProcessing(false);
            }
        });
    } catch (e) { console.error(e); setIsProcessing(false); }
  };

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
    setActiveTab('devices');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Insurance Hub</h2>
          <p className="text-slate-500">Blockchain-secured protection.</p>
        </div>
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
          <Wallet size={18} className="text-primary" />
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Sui Wallet</p>
            <p className="font-mono font-bold">
                {currentAccount ? `${realBalance.toFixed(3)} SUI` : "Not Connected"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 overflow-x-auto pb-1">
        <button onClick={() => setActiveTab('my-policies')} className={`pb-3 px-1 text-sm font-medium ${activeTab === 'my-policies' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}>My Policies</button>
        <button onClick={() => setActiveTab('devices')} className={`pb-3 px-1 text-sm font-medium ${activeTab === 'devices' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}>Devices</button>
        <button onClick={() => setActiveTab('market')} className={`pb-3 px-1 text-sm font-medium ${activeTab === 'market' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}>Buy Coverage</button>
        <button onClick={() => setActiveTab('claims')} className={`pb-3 px-1 text-sm font-medium ${activeTab === 'claims' ? 'border-b-2 border-primary text-primary' : 'text-slate-500'}`}>Claims</button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        
        {/* MY POLICIES */}
        {activeTab === 'my-policies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPolicies.map((policy) => (
                <div key={policy.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow relative">
                  <div className="bg-primary/5 p-6 flex justify-between items-start">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                      {policy.type === 'Device' && <Smartphone size={24} />}
                      {policy.type === 'Health' && <BriefcaseMedical size={24} />}
                      {policy.type === 'Travel' && <Shield size={24} />}
                      {(!['Device', 'Health', 'Travel'].includes(policy.type)) && <Shield size={24} />}
                    </div>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      {policy.status}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">{policy.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 font-mono truncate">{policy.id}</p>
                    
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

                    {policy.id.startsWith('0x') && (
                        <a 
                          href={`https://suiscan.xyz/testnet/object/${policy.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="block w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:border-primary hover:text-primary transition-colors text-center"
                        >
                          View On-Chain
                        </a>
                    )}
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
                <button onClick={() => setIsRegisterDeviceOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md hover:bg-blue-600"><Plus size={18} /> Register Device</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map((device) => (
                  <div key={device.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                     <div className="flex justify-between items-start mb-4">
                       <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><Smartphone size={24} /></div>
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
                          <p className="text-2xl font-bold text-slate-800">SUI {plan.premium}</p>
                          <p className="text-xs text-slate-500 font-medium">/ 30 days</p>
                      </div>
                    </div>
                    <h4 className="font-bold text-xl text-slate-800 mb-2">{plan.name}</h4>
                    <p className="text-slate-600 text-sm mb-6 flex-1">{plan.description}</p>
                    <button onClick={() => setSelectedPlan(plan)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg">Buy Now</button>
                  </div>
                ))}
             </div>
        )}

        {/* CLAIMS CENTER */}
        {activeTab === 'claims' && (
           <div className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
               <h3 className="text-xl font-bold text-slate-800 mb-6">File a Claim</h3>
               <form onSubmit={handleClaimSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Policy</label>
                    <select required value={claimForm.policyId} onChange={(e) => setClaimForm({...claimForm, policyId: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <option value="">-- Choose Policy --</option>
                      {allPolicies.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Amount (SUI)</label>
                    <input type="number" required value={claimForm.amount} onChange={(e) => setClaimForm({...claimForm, amount: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                    <textarea required value={claimForm.reason} onChange={(e) => setClaimForm({...claimForm, reason: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50" />
                  </div>
                  <button type="submit" disabled={isProcessing} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 shadow-lg flex items-center justify-center gap-2">
                    {isProcessing ? <Loader2 className="animate-spin" /> : <>Submit Claim <Plus size={20} /></>}
                  </button>
               </form>
             </div>
             
             {/* History */}
             <div className="space-y-4">
               <h3 className="font-bold text-slate-800">History</h3>
               {allClaims.map((claim) => (
                   <div key={claim.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-slate-400">{claim.id.startsWith('0x') ? claim.id.slice(0,6) : claim.id}</span>
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${claim.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                         {claim.status}
                       </span>
                     </div>
                     <p className="font-bold text-slate-800 text-sm mb-1">{claim.policyName}</p>
                     <div className="flex justify-between text-xs text-slate-500">
                       <span>{claim.date}</span>
                       <span className="font-medium text-slate-700">SUI {claim.amount}</span>
                     </div>
                   </div>
               ))}
             </div>
           </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6">
              <h3 className="font-bold text-lg text-slate-800 text-center">Confirm Purchase</h3>
              <div className="text-center">
                  <p className="text-slate-500">Premium</p>
                  <p className="text-4xl font-bold text-slate-900">SUI {selectedPlan.premium}</p>
                  <p className="text-sm text-slate-500 mt-2">{selectedPlan.name}</p>
              </div>
              <div className="flex justify-between text-sm bg-slate-50 p-4 rounded-xl">
                 <span>Wallet Balance</span>
                 <span className="font-bold">{realBalance.toFixed(3)} SUI</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedPlan(null)} className="flex-1 py-3 border rounded-xl font-bold text-slate-600">Cancel</button>
                <button 
                    onClick={handleBuyPolicySubmit} 
                    disabled={isProcessing || realBalance < selectedPlan.premium} 
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 className="animate-spin mx-auto"/> : "Pay Now"}
                </button>
              </div>
              {realBalance < selectedPlan.premium && (
                 <p className="text-center text-xs text-red-500">Insufficient Balance</p>
              )}
           </div>
        </div>
      )}

      {/* Device Modal */}
      {isRegisterDeviceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
             <h3 className="font-bold text-lg mb-4">Register Device</h3>
             <form onSubmit={handleRegisterDevice} className="space-y-4">
               <input placeholder="Device Name" value={newDevice.name} onChange={e => setNewDevice({...newDevice, name: e.target.value})} className="w-full p-2 border rounded" required />
               <input placeholder="Serial Number" value={newDevice.serialNumber} onChange={e => setNewDevice({...newDevice, serialNumber: e.target.value})} className="w-full p-2 border rounded" required />
               <button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Register</button>
               <button type="button" onClick={() => setIsRegisterDeviceOpen(false)} className="w-full py-3 border rounded-xl font-bold text-slate-600">Cancel</button>
             </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default Insurance;
