import React, { useState, useMemo } from 'react';
import { FileText, Calendar, User, Building2, Search, Filter, Stethoscope, Plus, X, Save, Share2, Paperclip, Upload, Trash2, File as FileIcon, Link, Copy, Check, Lock } from 'lucide-react';
import { HealthRecord, Attachment } from '../types';

interface RecordsProps {
  records?: HealthRecord[];
  onSimulateRequest?: () => void;
  onAddRecord: (record: Omit<HealthRecord, 'id' | 'verified'>) => void;
}

const RECORD_TYPES = ['Diagnosis', 'Prescription', 'Lab Result', 'Vaccination', 'Other'];

const Records: React.FC<RecordsProps> = ({ records = [], onSimulateRequest, onAddRecord }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recordToShare, setRecordToShare] = useState<HealthRecord | null>(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  
  // Form State for New Record
  const [newRecord, setNewRecord] = useState({
    type: 'Diagnosis',
    date: new Date().toISOString().split('T')[0],
    doctor: '',
    hospital: '',
    details: '',
    attachments: [] as Attachment[]
  });

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = 
        record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === 'All' || record.type === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [records, searchTerm, activeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord(newRecord);
    setIsAddModalOpen(false);
    // Reset form
    setNewRecord({
      type: 'Diagnosis',
      date: new Date().toISOString().split('T')[0],
      doctor: '',
      hospital: '',
      details: '',
      attachments: []
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      files.forEach(file => {
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

  const openShareModal = (record: HealthRecord) => {
    setRecordToShare(record);
    setShareLinkCopied(false);
    setIsShareModalOpen(true);
  };

  const handleCopyLink = () => {
    // In a real app, this would generate a signed URL from the blockchain/backend
    navigator.clipboard.writeText(`https://suicare.app/share/view/${recordToShare?.id}?token=zk-7s8d9f`);
    setShareLinkCopied(true);
    setTimeout(() => setShareLinkCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Medical Records</h2>
          <p className="text-slate-500">Your immutable health history on MyHealthBox.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button 
             onClick={onSimulateRequest}
             className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-100 transition-colors text-sm font-semibold"
           >
             <Stethoscope size={18} /> Demo Request
           </button>
           
           <div className="relative">
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className={`border px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${isFilterOpen || activeFilter !== 'All' ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
             >
               <Filter size={18} /> {activeFilter === 'All' ? 'Filter' : activeFilter}
             </button>
             
             {isFilterOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                 <button onClick={() => { setActiveFilter('All'); setIsFilterOpen(false); }} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700">All Records</button>
                 {RECORD_TYPES.map(type => (
                   <button 
                     key={type}
                     onClick={() => { setActiveFilter(type); setIsFilterOpen(false); }} 
                     className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                   >
                     {type}
                   </button>
                 ))}
               </div>
             )}
           </div>

           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-blue-600 text-sm font-medium"
           >
             <Plus size={18} /> Add External Record
           </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by doctor, hospital, details, or type..." 
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm text-slate-800"
        />
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-xl border border-slate-100 border-dashed">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">No records found</p>
            <p className="text-sm opacity-70">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 animate-in slide-in-from-bottom-2 duration-300 relative group">
              
              {/* Date Block */}
              <div className="flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-0 min-w-[100px] border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                <span className="text-3xl font-bold text-slate-800">{record.date.split('-')[2]}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 uppercase">{new Date(record.date).toLocaleString('default', { month: 'short' })}</span>
                  <span className="text-sm text-slate-400">{record.date.split('-')[0]}</span>
                </div>
              </div>

              {/* Content Block */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{record.type}</h3>
                    <p className="text-slate-600 mt-1">{record.details}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.verified ? (
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded border border-blue-100 flex items-center gap-1">
                        Verified on Sui
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
                        Self-Reported
                      </span>
                    )}
                    
                    <button 
                      onClick={() => openShareModal(record)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors ml-2"
                      title="Share Record"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <User size={16} />
                    <span>{record.doctor || 'Self'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Building2 size={16} />
                    <span>{record.hospital || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <FileText size={16} />
                    <span>ID: {record.id}</span>
                  </div>
                </div>

                {/* Attachments Display */}
                {record.attachments && record.attachments.length > 0 && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-50 overflow-x-auto pb-1">
                    {record.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors group/file cursor-pointer relative pr-8">
                        <Paperclip size={14} className="text-slate-400" />
                        <span className="truncate max-w-[150px]">{att.name}</span>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2" title="Encrypted on IPFS">
                          <Lock size={12} className="text-green-500" />
                        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Add External Record</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                  <select 
                    value={newRecord.type}
                    onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                  >
                    {RECORD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                  <input 
                    type="date"
                    required
                    value={newRecord.date}
                    onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Doctor / Specialist</label>
                <input 
                  type="text"
                  placeholder="e.g. Dr. Okafor"
                  value={newRecord.doctor}
                  onChange={(e) => setNewRecord({...newRecord, doctor: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Hospital / Lab</label>
                <input 
                  type="text"
                  placeholder="e.g. Lagoon Hospital"
                  value={newRecord.hospital}
                  onChange={(e) => setNewRecord({...newRecord, hospital: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Details / Findings</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Enter diagnosis details, prescription info, or test results..."
                  value={newRecord.details}
                  onChange={(e) => setNewRecord({...newRecord, details: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none text-slate-800"
                />
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Attachments (Encrypted)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative">
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <Upload size={24} className="text-slate-300" />
                    <p className="text-sm">Click to upload files</p>
                    <p className="text-xs text-slate-400">Files will be encrypted & stored on IPFS</p>
                  </div>
                </div>
                
                {/* File List */}
                {newRecord.attachments.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {newRecord.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                        <div className="flex items-center gap-2 text-slate-700 truncate">
                          <FileIcon size={14} className="text-slate-400" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeAttachment(idx)} 
                          className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {isShareModalOpen && recordToShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-slate-100 flex justify-between items-start">
               <div>
                 <h3 className="font-bold text-lg text-slate-800">Share Securely</h3>
                 <p className="text-sm text-slate-500">Generate a temporary access link for doctors.</p>
               </div>
               <button onClick={() => setIsShareModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
             </div>
             
             <div className="p-6 space-y-6">
               <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{recordToShare.type}</p>
                    <p className="text-xs text-slate-500">{recordToShare.details.substring(0, 50)}...</p>
                  </div>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase">Access Duration</label>
                 <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none text-slate-800">
                   <option>1 Hour (One-time view)</option>
                   <option>24 Hours</option>
                   <option>7 Days</option>
                 </select>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Secure Link</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-100 border border-slate-200 rounded-xl p-3 text-sm text-slate-500 truncate font-mono">
                      https://suicare.app/share/view/{recordToShare.id}?token=...
                    </div>
                    <button 
                      onClick={handleCopyLink}
                      className="bg-primary hover:bg-blue-600 text-white p-3 rounded-xl transition-colors flex items-center justify-center"
                    >
                      {shareLinkCopied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                  {shareLinkCopied && <p className="text-xs text-green-600 font-medium text-right">Link copied to clipboard!</p>}
               </div>

               <button 
                onClick={() => setIsShareModalOpen(false)}
                className="w-full py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
               >
                 Done
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Records;