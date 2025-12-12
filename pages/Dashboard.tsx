import React, { useState, useMemo } from 'react';
import { 
  Shield, FileText, AlertCircle, QrCode, UserPlus, Check, X, Phone, User, 
  Loader2, Wallet, Plus, Search, Gamepad2, Stethoscope, Activity, Zap, Database, ShieldAlert 
} from 'lucide-react'; 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { AppView } from '../types';
// ✅ IMPORT CONSTANTS
import { PACKAGE_ID, MODULE_NAME } from '../pages/constants';

// Adjust the extensions (.png, .jpg) if your images are different
import lionLevel1 from './img/lion.png';       
import lionLevel2 from './img/lion (1).png';   
import lionLevel3 from './img/lion (2).png';   
import lionLevel4 from './img/lion (2).png';   // Using (3) as level 4 based on your previous file names

const chartData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 75 },
  { name: 'Thu', score: 72 },
  { name: 'Fri', score: 85 },
  { name: 'Sat', score: 82 },
  { name: 'Sun', score: 90 },
];

// --- 🦁 AVATAR EVOLUTION LOGIC ---
const getAvatarImage = (level: number) => {
  if (level >= 4) return lionLevel4; 
  if (level === 3) return lionLevel3; 
  if (level === 2) return lionLevel2; 
  return lionLevel1; 
};

const getAvatarTitle = (level: number) => {
  if (level >= 4) return "Celestial King";
  if (level === 3) return "Mystic Elder";
  if (level === 2) return "Pride Leader";
  return "Little Cub";
};

interface DashboardProps {
  onChangeView?: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView }) => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [showEmergencyID, setShowEmergencyID] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 1. FETCH REAL DATA FROM SUI ---
  
  const { data: balanceData } = useSuiClientQuery('getBalance', { owner: currentAccount?.address || '' }, { enabled: !!currentAccount });
  const suiBalance = balanceData ? (parseInt(balanceData.totalBalance) / 1_000_000_000).toFixed(2) : "0.00";

  const { data: requestObjects, refetch: refetchRequests } = useSuiClientQuery('getOwnedObjects', {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::AccessRequest` },
      options: { showContent: true }
    }, { enabled: !!currentAccount, refetchInterval: 5000 });

  const { data: policyObjects } = useSuiClientQuery('getOwnedObjects', {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::InsurancePolicy` },
      options: { showContent: true }
    }, { enabled: !!currentAccount });

  const { data: recordObjects } = useSuiClientQuery('getOwnedObjects', {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::HealthRecord` },
      options: { showContent: true }
    }, { enabled: !!currentAccount });

  const { data: avatarObjects, refetch: refetchAvatar } = useSuiClientQuery('getOwnedObjects', {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::HealthAvatar` },
      options: { showContent: true }
    }, { enabled: !!currentAccount });

  // --- 2. PROCESS DATA ---

  const myRequests = useMemo(() => requestObjects?.data.map((obj: any) => ({
      id: obj.data?.objectId,
      requester: obj.data?.content?.fields?.requester,
      doctorName: obj.data?.content?.fields?.requester_name,
      purpose: obj.data?.content?.fields?.reason,
      status: obj.data?.content?.fields?.status,
  })).filter((r: any) => r.status === 0) || [], [requestObjects]);

  const activePoliciesCount = policyObjects?.data?.length || 0;
  const recordsCount = recordObjects?.data?.length || 0;
  
  const myAvatar = avatarObjects?.data?.[0] ? {
      id: avatarObjects.data[0].data?.objectId,
      name: (avatarObjects.data[0].data?.content as any)?.fields?.name,
      level: parseInt((avatarObjects.data[0].data?.content as any)?.fields?.level),
      xp: parseInt((avatarObjects.data[0].data?.content as any)?.fields?.xp),
      image: getAvatarImage(parseInt((avatarObjects.data[0].data?.content as any)?.fields?.level)) 
  } : null;

  // --- 3. ACTIONS ---

  const handleMintAvatar = () => {
    if (!currentAccount) return;
    setIsProcessing(true);
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::mint_avatar`,
        arguments: [ tx.pure.string("Simba") ]
    });
    signAndExecute({ transaction: tx }, {
        onSuccess: () => {
            alert("Cub Minted! Start training to evolve.");
            refetchAvatar();
            setIsProcessing(false);
        },
        onError: (err) => { alert("Mint Failed: " + err.message); setIsProcessing(false); }
    });
  };

  const handleTrainAvatar = () => {
    if (!currentAccount || !myAvatar) return;
    setIsProcessing(true);
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::level_up`,
        arguments: [ tx.object(myAvatar.id) ]
    });
    signAndExecute({ transaction: tx }, {
        onSuccess: () => {
            alert(`Training Complete! +100 XP.`);
            refetchAvatar();
            setIsProcessing(false);
        },
        onError: (err) => { alert("Training Failed: " + err.message); setIsProcessing(false); }
    });
  };

  const handleResolveRequest = (requestId: string, status: number) => {
    if (!currentAccount) return;
    setIsProcessing(true);
    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::resolve_request`,
      arguments: [ tx.object(requestId), tx.pure.u8(status) ],
    });
    signAndExecute({ transaction: tx }, {
      onSuccess: () => { refetchRequests(); setIsProcessing(false); },
      onError: (err) => { console.error(err); setIsProcessing(false); }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            {currentAccount 
              ? `Welcome back, ${currentAccount.address.slice(0, 6)}...${currentAccount.address.slice(-4)}`
              : "Welcome to SuiCare. Please connect your wallet."}
          </p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setShowEmergencyID(true)} className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
             <QrCode size={18} /> Emergency ID
           </button>
           <div className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg flex items-center gap-2">
             <Wallet size={18} className="text-primary" /> <span>{suiBalance} SUI</span>
           </div>
        </div>
      </div>

      {/* 2. AVATAR & STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* AVATAR CARD */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[200px] border border-white/10">
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2 text-yellow-400">
                        <Gamepad2 size={20} /> {myAvatar ? getAvatarTitle(myAvatar.level) : "No Avatar"}
                    </h3>
                    <p className="text-indigo-200 text-xs">Evolution Stage: {myAvatar ? myAvatar.level : 0}</p>
                </div>
                {myAvatar && (
                    <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/50">
                        Level {myAvatar.level}
                    </span>
                )}
            </div>

            {myAvatar ? (
                <div className="relative z-10 mt-6">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-500/30 shadow-lg bg-white/10 p-2 flex items-center justify-center backdrop-blur-sm">
                                <img 
                                    src={myAvatar.image} 
                                    alt="Avatar" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            {myAvatar.level >= 3 && (
                                <div className="absolute -top-2 -right-2 bg-purple-500 text-white p-1.5 rounded-full shadow-lg animate-pulse">
                                    <Zap size={14} fill="currentColor"/>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between text-xs mb-2 font-medium text-indigo-200">
                                <span>XP Progress</span>
                                <span>{myAvatar.xp}/100</span>
                            </div>
                            <div className="w-full bg-black/40 rounded-full h-3 border border-white/10 overflow-hidden">
                                <div 
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(250,204,21,0.5)]" 
                                    style={{ width: `${myAvatar.xp}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-indigo-300 mt-2 italic">
                                {myAvatar.level === 1 && "Just a Cub. Needs training."}
                                {myAvatar.level === 2 && "Growing strong. Mane appearing."}
                                {myAvatar.level === 3 && "Wisdom attained. White mane."}
                                {myAvatar.level >= 4 && "Apex Predator. Fully evolved."}
                            </p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleTrainAvatar}
                        disabled={isProcessing}
                        className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16} className="text-yellow-400 fill-yellow-400" />}
                        Train (+100 XP / Level Up)
                    </button>
                </div>
            ) : (
                <div className="relative z-10 mt-6 text-center">
                    <button 
                        onClick={handleMintAvatar}
                        disabled={isProcessing || !currentAccount}
                        className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold shadow-xl hover:bg-indigo-50 transition-colors w-full disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="animate-spin inline mr-2"/> : null}
                        Mint Lion Cub
                    </button>
                    <p className="text-xs text-indigo-300 mt-3">Start your journey.</p>
                </div>
            )}
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full"></div>
            <Gamepad2 className="absolute -bottom-6 -right-6 w-48 h-48 text-white opacity-5 rotate-12" />
        </div>

        {/* Live Stats Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center hover:border-purple-200 transition-colors">
                <div className="p-3 bg-purple-50 text-purple-500 rounded-full mb-2"><Shield size={24} /></div>
                <p className="text-3xl font-bold text-slate-800">{activePoliciesCount}</p>
                <p className="text-xs text-slate-500 uppercase font-bold">Active Policies</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center hover:border-green-200 transition-colors">
                <div className="p-3 bg-green-50 text-green-500 rounded-full mb-2"><FileText size={24} /></div>
                <p className="text-3xl font-bold text-slate-800">{recordsCount}</p>
                <p className="text-xs text-slate-500 uppercase font-bold">Health Records</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center hover:border-orange-200 transition-colors">
                <div className="p-3 bg-orange-50 text-orange-500 rounded-full mb-2"><AlertCircle size={24} /></div>
                <p className="text-3xl font-bold text-slate-800">{myRequests.length}</p>
                <p className="text-xs text-slate-500 uppercase font-bold">Pending Actions</p>
            </div>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions Grid (ALL 5 FEATURES) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
             <button 
               onClick={() => onChangeView && onChangeView(AppView.RECORDS)}
               className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
             >
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors"><Plus size={20} /></div>
                <p className="font-bold text-slate-800 text-sm">Add Record</p>
             </button>
             <button 
               onClick={() => onChangeView && onChangeView(AppView.INSURANCE)}
               className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
             >
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors"><Shield size={20} /></div>
                <p className="font-bold text-slate-800 text-sm">Buy Policy</p>
             </button>
             <button 
               onClick={() => onChangeView && onChangeView(AppView.DOCTORS)}
               className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
             >
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors"><Stethoscope size={20} /></div>
                <p className="font-bold text-slate-800 text-sm">Find Doctor</p>
             </button>
             
             {/* Feature 3: Data DAO */}
             <button 
               onClick={() => onChangeView && onChangeView(AppView.DATA_DAO)}
               className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
             >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Database size={20} /></div>
                <p className="font-bold text-slate-800 text-sm">Monetize Data</p>
             </button>

             {/* Feature 4: Guardians */}
             <button 
               onClick={() => onChangeView && onChangeView(AppView.GUARDIANS)}
               className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group"
             >
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition-colors"><ShieldAlert size={20} /></div>
                <p className="font-bold text-slate-800 text-sm">Emergency Guardians</p>
             </button>
          </div>

          {/* Pending Requests Alert */}
          {myRequests.length > 0 ? (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><UserPlus size={20}/></div>
                <h3 className="font-bold text-slate-800">Doctor Access Requests</h3>
              </div>
              <div className="space-y-3">
                {myRequests.map((req: any) => (
                  <div key={req.id} className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-bold text-slate-800">{req.doctorName}</p>
                      <p className="text-xs text-slate-500">{req.requester}</p>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded mt-1 inline-block">Reason: {req.purpose}</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={() => handleResolveRequest(req.id, 2)} disabled={isProcessing} className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50">Deny</button>
                      <button onClick={() => handleResolveRequest(req.id, 1)} disabled={isProcessing} className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
                        {isProcessing ? <Loader2 className="animate-spin" size={14}/> : <Check size={14}/>} Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Chart (Placeholder for Wellness Trends)
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800 text-lg">Wellness Trends</h3>
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">+12% vs last month</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* 4. Sidebar (Activity Feed) */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Latest Activity</h3>
              <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:h-full before:w-[2px] before:bg-slate-100">
                 <div className="relative flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-50 shadow-sm flex items-center justify-center text-primary z-10"><Wallet size={16} /></div>
                    <div><p className="text-sm font-bold text-slate-800">Wallet Connected</p><span className="text-[10px] text-slate-400 mt-1 block">Online</span></div>
                 </div>
                 {activePoliciesCount > 0 && (
                   <div className="relative flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-50 shadow-sm flex items-center justify-center text-purple-600 z-10"><Shield size={16} /></div>
                      <div><p className="text-sm font-bold text-slate-800">Insurance Active</p><span className="text-[10px] text-slate-400 mt-1 block">Ongoing</span></div>
                   </div>
                 )}
                 {myAvatar && (
                   <div className="relative flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-50 shadow-sm flex items-center justify-center text-indigo-600 z-10"><Gamepad2 size={16} /></div>
                      <div><p className="text-sm font-bold text-slate-800">Avatar Minted</p><span className="text-[10px] text-slate-400 mt-1 block">Level {myAvatar.level}</span></div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Emergency ID Modal */}
      {showEmergencyID && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-in zoom-in-95 duration-200">
             <button onClick={() => setShowEmergencyID(false)} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full text-slate-500 hover:bg-slate-200 z-10"><X size={20} /></button>
             <div className="bg-red-500 p-6 pt-8 text-white text-center relative overflow-hidden">
               <div className="relative z-10"><h3 className="text-2xl font-bold uppercase tracking-wider">Emergency ID</h3><p className="text-red-100 text-sm font-medium mt-1">SuiCare Medical Network</p></div>
               <Activity className="absolute -bottom-6 -left-6 w-32 h-32 text-red-400 opacity-50" />
             </div>
             <div className="p-6 space-y-6">
                <div className="text-center -mt-12 mb-6">
                     <div className="w-20 h-20 bg-slate-200 rounded-full border-4 border-white mx-auto flex items-center justify-center text-slate-400 shadow-md overflow-hidden"><User size={40} /></div>
                     <h2 className="text-xl font-bold text-slate-900 mt-2">{currentAccount ? "Sui User" : "Guest"}</h2>
                     {currentAccount && <p className="text-slate-500 text-xs font-mono mt-1 px-4 truncate">{currentAccount.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center"><p className="text-xs font-bold text-red-500 uppercase">Blood Type</p><p className="text-2xl font-black text-slate-800">O+</p></div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 text-center"><p className="text-xs font-bold text-red-500 uppercase">Genotype</p><p className="text-2xl font-black text-slate-800">AA</p></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0"><Phone size={20} /></div>
                     <div><p className="text-xs font-bold text-slate-400 uppercase">Emergency Contact</p><p className="font-bold text-slate-800">Local Emergency</p><p className="text-slate-600 text-sm font-mono">112 / 911</p></div>
                </div>
                <div className="text-center pt-2">
                    <div className="bg-slate-900 p-4 rounded-xl inline-block shadow-lg"><QrCode className="text-white w-24 h-24" /></div>
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