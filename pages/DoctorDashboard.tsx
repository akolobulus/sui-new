import React, { useState } from 'react';
import { Calendar, Users, Video, FileText, CheckCircle, Clock, Wallet, Activity, Pill, Loader2, Search, X, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useCurrentAccount, useSuiClientQuery, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULE_NAME } from '../pages/constants';

const DoctorDashboard: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 1. FETCH LIVE DATA ---
  const { data: balanceData } = useSuiClientQuery('getBalance', { 
    owner: currentAccount?.address || '' 
  }, { enabled: !!currentAccount });

  const suiBalance = balanceData ? (parseInt(balanceData.totalBalance) / 1_000_000_000).toFixed(2) : "0.00";

  // --- 2. LOCAL STATE ---
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [formType, setFormType] = useState<'diagnosis' | 'prescription' | 'access' | null>(null);
  const [formData, setFormData] = useState({ details: '', title: '' });

  // Mock Data
  const [appointments] = useState([
    { id: 'APT-1', patient: '0x71a2...9b2c', time: '10:30 AM', reason: 'Malaria Symptoms', status: 'Paid', fullAddress: '0x71a2938475647382910293847564738291029384' },
    { id: 'APT-2', patient: '0x3a11...2f11', time: '11:00 AM', reason: 'Cardio Checkup', status: 'Paid', fullAddress: '0x3a11938475647382910293847564738291029384' },
  ]);

  const [payouts] = useState([
    { id: 1, amount: 50, from: '0x71...9b2c', time: '2 hrs ago' },
    { id: 2, amount: 120, from: '0x3a...2f11', time: '5 hrs ago' },
  ]);

  // --- 3. ACTIONS ---

  // A. Issue Record (Write to Chain)
  const handleIssueRecord = () => {
    if (!currentAccount) return;
    setIsProcessing(true);

    const type = formType === 'prescription' ? 'Verified Prescription' : 'Verified Diagnosis';
    const content = formType === 'prescription' 
      ? `Rx: ${formData.details} - Issued by ${currentAccount.address.slice(0,6)}` 
      : `Diagnosis: ${formData.details}`;

    const tx = new Transaction();
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::add_record`,
      arguments: [
        tx.pure.string(type),
        tx.pure.string("Dr. Chioma (Verified)"),
        tx.pure.string("SuiCare Clinic"),
        tx.pure.string("QmHashEncrypted"), 
        tx.pure.string(content),
        tx.object('0x6')
      ]
    });
    
    signAndExecute({ transaction: tx }, {
      onSuccess: (result) => {
        alert(`✅ ${type} Issued!\nDigest: ${result.digest.slice(0,10)}...`);
        setIsProcessing(false);
        setFormType(null);
        setFormData({ details: '', title: '' });
      },
      onError: (err) => { alert("Failed: " + err.message); setIsProcessing(false); }
    });
  };

  // B. Request Access (The "Handshake")
  const handleRequestAccess = () => {
    if (!currentAccount || !patientSearch) return alert("Enter Patient Address");
    setIsProcessing(true);

    try {
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::request_access`,
            arguments: [
                tx.pure.address(patientSearch), // Target Patient
                tx.pure.string("Dr. Chioma"),   // Doctor Name
                tx.pure.string("Consultation Review"), // Reason
                tx.object('0x6')
            ]
        });

        signAndExecute({ transaction: tx }, {
            onSuccess: () => {
                alert(`📨 Access Request Sent to ${patientSearch.slice(0,6)}...`);
                setIsProcessing(false);
                setFormType(null);
            },
            onError: (err) => { alert("Failed: " + err.message); setIsProcessing(false); }
        });
    } catch (e) {
        console.error(e);
        setIsProcessing(false);
    }
  };

  const handleJoinCall = (id: string) => {
    alert("Launching Encrypted Video Channel via Huddle01...");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* 1. Header & Credentials */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                 <Users size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Doctor Portal 
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-blue-200">
                        <ShieldCheck size={12} /> License Verified
                    </span>
                </h1>
                <p className="text-slate-500 text-sm">
                   {currentAccount ? `ID: ${currentAccount.address.slice(0,6)}...${currentAccount.address.slice(-4)}` : "Welcome back, Doctor."}
                </p>
             </div>
          </div>
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-lg hover:bg-slate-800 transition-colors">
            <Wallet size={20} className="text-green-400" />
            <div>
                <p className="text-[10px] text-slate-400 uppercase font-medium">Wallet Balance</p>
                <p className="text-lg leading-none">{suiBalance} SUI</p>
            </div>
          </div>
        </div>

        {/* 2. Main Workspace */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Appointments & Payouts */}
          <div className="lg:col-span-2 space-y-8">
             
             {/* Appointments */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                  <Calendar className="text-primary" size={20} /> Today's Schedule
                </h3>
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="flex flex-col md:flex-row justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4 mb-4 md:mb-0 w-full md:w-auto">
                        <div className="text-center w-16 shrink-0">
                          <p className="font-bold text-slate-800">{apt.time}</p>
                          <p className="text-xs text-slate-500">{apt.date}</p>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 flex items-center gap-2">
                            {apt.patient}
                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase">Escrow Funded</span>
                          </p>
                          <span className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md mt-1 inline-block">
                            Reason: {apt.reason}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <button onClick={() => handleJoinCall(apt.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800">
                          <Video size={16} /> Call
                        </button>
                        <button onClick={() => { setSelectedPatient(apt.fullAddress); setFormType('diagnosis'); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-100">
                          <FileText size={16} /> Records
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* Recent Payouts */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="text-green-600" size={20} /> Recent Income
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {payouts.map(pay => (
                        <div key={pay.id} className="flex items-center justify-between p-4 bg-green-50/50 rounded-xl border border-green-100">
                            <div>
                                <p className="font-bold text-slate-800 text-lg">+{pay.amount} SUI</p>
                                <p className="text-xs text-slate-500">From: {pay.from}</p>
                            </div>
                            <div className="text-right">
                                <span className="bg-white text-green-700 text-[10px] font-bold px-2 py-1 rounded border border-green-100 uppercase">Consultation</span>
                                <p className="text-[10px] text-slate-400 mt-1">{pay.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          </div>

          {/* Right Column: Tools & Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-fit sticky top-6">
             <h3 className="font-bold text-lg text-slate-800 mb-4">Medical Action Center</h3>
             
             {!formType ? (
               <div className="space-y-3 flex-1">
                 {/* Tool 1: Prescription */}
                 <button 
                    onClick={() => { setSelectedPatient('0x...'); setFormType('prescription'); }}
                    className="w-full p-4 text-left bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 group"
                 >
                   <p className="font-bold text-blue-800 flex items-center justify-between">
                       <span className="flex items-center gap-2"><Pill size={18} /> Mint Prescription</span>
                       <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                   </p>
                   <p className="text-xs text-blue-600 mt-1">Issue verifiable RX NFT to patient.</p>
                 </button>
                 
                 {/* Tool 2: Diagnosis */}
                 <button 
                    onClick={() => { setSelectedPatient('0x...'); setFormType('diagnosis'); }}
                    className="w-full p-4 text-left bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors border border-purple-100 group"
                 >
                   <p className="font-bold text-purple-800 flex items-center justify-between">
                       <span className="flex items-center gap-2"><FileText size={18} /> Issue Diagnosis</span>
                       <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                   </p>
                   <p className="text-xs text-purple-600 mt-1">Create immutable medical record.</p>
                 </button>

                 {/* Tool 3: Request Access (New!) */}
                 <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Request Patient History</p>
                    <div className="flex gap-2 mb-2">
                        <div className="relative flex-1">
                            <input 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
                                placeholder="Patient Address..." 
                                value={patientSearch}
                                onChange={(e) => setPatientSearch(e.target.value)}
                            />
                            <Search size={14} className="absolute left-2.5 top-3 text-slate-400"/>
                        </div>
                    </div>
                    <button 
                        onClick={handleRequestAccess}
                        disabled={isProcessing || !patientSearch}
                        className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="animate-spin mx-auto" size={16}/> : "Send Access Request"}
                    </button>
                 </div>
               </div>
             ) : (
                /* ACTION FORM OVERLAY */
                <div className="animate-in slide-in-from-right-4 duration-200 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                        <h4 className="font-bold text-slate-800">
                            {formType === 'prescription' ? 'New Prescription' : 'New Diagnosis'}
                        </h4>
                        <button onClick={() => setFormType(null)} className="text-slate-400 hover:text-red-500"><X size={20}/></button>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Patient</label>
                            <input className="w-full p-2 bg-slate-50 border rounded-lg text-sm font-mono text-slate-600" value={selectedPatient || ''} readOnly />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">
                                {formType === 'prescription' ? 'Medication Details' : 'Diagnosis Notes'}
                            </label>
                            <textarea 
                                className="w-full p-3 bg-white border rounded-lg text-sm h-32 focus:ring-2 focus:ring-primary/20 outline-none resize-none" 
                                placeholder={formType === 'prescription' ? "e.g. Amoxicillin 500mg, 2x daily..." : "e.g. Malaria Positive, severe..."}
                                value={formData.details}
                                onChange={(e) => setFormData({...formData, details: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleIssueRecord}
                        disabled={isProcessing || !formData.details}
                        className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle size={18}/>}
                        Sign & Mint
                    </button>
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;