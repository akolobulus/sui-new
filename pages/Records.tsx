import React, { useState, useMemo } from 'react';
import { FileText, User, Building2, Search, Filter, Stethoscope, Plus, X, Save, Share2, Paperclip, Upload, Trash2, File as FileIcon, Lock, Loader2, ExternalLink, Copy, Check } from 'lucide-react';
import { HealthRecord, Attachment } from '../types';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

// ✅ IMPORT CONSTANTS (No more hardcoding!)
import { PACKAGE_ID, MODULE_NAME } from '../pages/constants';

const STRUCT_NAME = 'HealthRecord';

interface RecordsProps {
  records?: HealthRecord[];
  onSimulateRequest?: () => void;
  onAddRecord: (record: Omit<HealthRecord, 'id' | 'verified'>) => void;
}

const RECORD_TYPES = ['Diagnosis', 'Prescription', 'Lab Result', 'Vaccination', 'Other'];

const Records: React.FC<RecordsProps> = ({ records: mockRecords = [], onSimulateRequest, onAddRecord }) => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // 1. Fetch Real On-Chain Records
  const { data: suiObjects, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::${STRUCT_NAME}` },
      options: { showContent: true }
    },
    { enabled: !!currentAccount, refetchInterval: 5000 }
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Modals & Processing State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [recordToShare, setRecordToShare] = useState<HealthRecord | null>(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  
  // Form State
  const [newRecord, setNewRecord] = useState({
    type: 'Diagnosis',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    hospital: '',
    details: '',
    attachments: [] as Attachment[] // ✅ Correctly typed array
  });

  // 2. Transform Blockchain Data
  const realRecords: HealthRecord[] = suiObjects?.data.map((obj: any) => {
    const fields = obj.data?.content?.fields;
    const hasAttachment = fields?.ipfs_cid && fields.ipfs_cid.length > 5 && !fields.ipfs_cid.includes("No Attachment");
    
    return {
      id: obj.data?.objectId,
      type: fields?.record_type || 'Unknown',
      date: new Date(Number(fields?.date_added || 0)).toISOString().split('T')[0],
      doctor: fields?.doctor || 'Unknown',
      hospital: fields?.hospital || 'Unknown',
      details: fields?.details_encrypted || "Encrypted Content",
      verified: fields?.is_verified || false,
      // If there is a CID, we show it as a generic attachment
      attachments: hasAttachment ? [{ name: 'Encrypted Document (IPFS)', url: '#', type: 'application/pdf' }] : []
    };
  }) || [];

  const allRecords = [...realRecords, ...mockRecords];

  const filteredRecords = useMemo(() => {
    return allRecords.filter(record => {
      const matchesSearch = 
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === 'All' || record.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allRecords, searchTerm, activeFilter]);

  // --- HANDLERS ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // ✅ FIX: Added ': File' to explicitly type the variable
      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewRecord(prev => ({
            ...prev,
            attachments: [...prev.attachments, {
              name: file.name,
              url: reader.result as string,
              type: file.type
            }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAttachment = (index: number) => {
    setNewRecord(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) return alert("⚠️ Please connect your Sui Wallet first!");
    
    setIsProcessing(true);

    try {
      // 1. Generate Mock CID for attachments
      let uploadedCid = "No Attachment";
      if (newRecord.attachments.length > 0) {
        // In prod, you would upload to IPFS/Walrus here
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate upload delay
        uploadedCid = "Qm" + Math.random().toString(36).substring(7) + "Encrypted";
      }

      // 2. Build Transaction
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::add_record`,
        arguments: [
          tx.pure.string(newRecord.type),
          tx.pure.string(newRecord.doctor),
          tx.pure.string(newRecord.hospital),
          tx.pure.string(uploadedCid), 
          tx.pure.string(newRecord.details), 
          tx.object('0x6') // Clock
        ],
      });

      // 3. Execute
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            // Optimistic UI Update
            onAddRecord({ ...newRecord, details: newRecord.details });
            
            // Cleanup
            setIsAddModalOpen(false);
            setNewRecord({
              type: 'Diagnosis',
              date: new Date().toISOString().split('T')[0],
              doctor: '',
              hospital: '',
              details: '',
              attachments: []
            });
            refetch();
            setIsProcessing(false);
          },
          onError: (err) => {
            console.error(err);
            alert(`Transaction Failed: ${err.message}`);
            setIsProcessing(false);
          }
        }
      );
    } catch (error) {
      console.error("Error:", error);
      setIsProcessing(false);
    }
  };

  const openShareModal = (record: HealthRecord) => {
    setRecordToShare(record);
    setShareLinkCopied(false);
    setIsShareModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://suicare.app/share/view/${recordToShare?.id}?token=zk-7s8d9f`);
    setShareLinkCopied(true);
    setTimeout(() => setShareLinkCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Medical Records</h2>
          <p className="text-slate-500">
             {currentAccount ? `Viewing records for ${currentAccount.address.slice(0,6)}...` : "Your immutable health history on MyHealthBox."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button onClick={onSimulateRequest} className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-100 text-sm font-semibold">
             <Stethoscope size={18} /> Demo Request
           </button>
           
           <div className="relative">
             <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`border px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${isFilterOpen || activeFilter !== 'All' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
               <Filter size={18} /> {activeFilter === 'All' ? 'Filter' : activeFilter}
             </button>
             {isFilterOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden">
                 <button onClick={() => { setActiveFilter('All'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">All Records</button>
                 {RECORD_TYPES.map(type => (
                   <button key={type} onClick={() => { setActiveFilter(type); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">{type}</button>
                 ))}
               </div>
             )}
           </div>

           <button onClick={() => setIsAddModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-600 text-sm font-medium">
             <Plus size={18} /> Add External Record
           </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search records..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-100 border-dashed">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No records found</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
              
              {/* Date */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-2 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4 min-w-[100px]">
                <span className="text-3xl font-bold text-slate-800">{record.date.split('-')[2]}</span>
                <span className="text-sm font-medium text-slate-500 uppercase">{new Date(record.date).toLocaleString('default', { month: 'short' })}</span>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{record.type}</h3>
                    <p className="text-slate-600 mt-1">{record.details}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded border ${record.verified ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {record.verified ? 'Verified on Sui' : 'Self-Reported'}
                    </span>
                    <button onClick={() => openShareModal(record)} className="p-2 text-slate-400 hover:text-primary rounded-full"><Share2 size={18} /></button>
                    {record.id.startsWith('0x') && <a href={`https://suiscan.xyz/testnet/object/${record.id}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-primary"><ExternalLink size={18} /></a>}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500"><User size={16} /><span>{record.doctor}</span></div>
                  <div className="flex items-center gap-2 text-sm text-slate-500"><Building2 size={16} /><span>{record.hospital}</span></div>
                  <div className="flex items-center gap-2 text-sm text-slate-500"><FileText size={16} /><span className="font-mono">{record.id.slice(0, 10)}...</span></div>
                </div>

                {/* ✅ ATTACHMENTS RESTORED */}
                {record.attachments && record.attachments.length > 0 && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-50 overflow-x-auto pb-1">
                    {record.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer relative pr-8">
                        <Paperclip size={14} className="text-slate-400" />
                        <span className="truncate max-w-[150px]">{att.name}</span>
                        <Lock size={12} className="text-green-500 absolute right-2 top-1/2 -translate-y-1/2" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800">Add External Record</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                  <select value={newRecord.type} onChange={(e) => setNewRecord({...newRecord, type: e.target.value})} className="w-full p-2 border rounded-xl">
                    {RECORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                  <input type="date" value={newRecord.date} onChange={(e) => setNewRecord({...newRecord, date: e.target.value})} className="w-full p-2 border rounded-xl" required />
                </div>
              </div>

              <input type="text" placeholder="Doctor / Specialist" value={newRecord.doctor} onChange={(e) => setNewRecord({...newRecord, doctor: e.target.value})} className="w-full p-2 border rounded-xl" />
              <input type="text" placeholder="Hospital / Lab" value={newRecord.hospital} onChange={(e) => setNewRecord({...newRecord, hospital: e.target.value})} className="w-full p-2 border rounded-xl" />
              <textarea placeholder="Details / Findings" value={newRecord.details} onChange={(e) => setNewRecord({...newRecord, details: e.target.value})} className="w-full p-2 border rounded-xl" rows={3} required />

              {/* ✅ ATTACHMENT UPLOAD RESTORED */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Attachments</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                  <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex flex-col items-center gap-1 text-slate-500">
                    <Upload size={20} />
                    <p className="text-sm">Click to upload</p>
                  </div>
                </div>
                {/* File List */}
                {newRecord.attachments.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {newRecord.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm border">
                        <span className="truncate">{file.name}</span>
                        <button type="button" onClick={() => removeAttachment(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 border rounded-xl font-bold text-slate-600">Cancel</button>
                <button type="submit" disabled={isProcessing} className="flex-1 py-2 bg-primary text-white rounded-xl font-bold">
                  {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && recordToShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
             <div className="flex justify-between items-center border-b pb-4">
               <h3 className="font-bold text-lg">Share Securely</h3>
               <button onClick={() => setIsShareModalOpen(false)}><X size={20} className="text-slate-400" /></button>
             </div>
             <div className="bg-blue-50 p-4 rounded-xl flex gap-3 items-center">
                <FileText className="text-blue-500" />
                <div><p className="font-bold text-sm">{recordToShare.type}</p><p className="text-xs text-slate-500">Encrypted Access</p></div>
             </div>
             <div className="flex gap-2">
               <div className="flex-1 bg-slate-100 p-2 rounded text-xs font-mono truncate">https://suicare.app/s/...</div>
               <button onClick={handleCopyLink} className="bg-primary text-white p-2 rounded hover:bg-blue-600">{shareLinkCopied ? <Check size={16}/> : <Copy size={16}/>}</button>
             </div>
             <button onClick={() => setIsShareModalOpen(false)} className="w-full py-2 border rounded font-bold text-slate-600">Done</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Records;