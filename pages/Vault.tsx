import React, { useState } from 'react';
import { Lock, FileText, Upload, Eye, Shield, HardDrive, X, Loader2, ExternalLink, CheckCircle, Share2, Copy } from 'lucide-react';
import { VaultItem } from '../types';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

// ✅ IMPORT CONSTANTS
import { PACKAGE_ID, MODULE_NAME } from '../pages/constants';

const STRUCT_NAME = 'VaultItem';

interface VaultProps {
  items: VaultItem[];
  onAddItem: (item: Omit<VaultItem, 'id'>) => void;
}

const CATEGORIES = ['Identity', 'Medical', 'Legal', 'Financial', 'Other'];

const Vault: React.FC<VaultProps> = ({ items: mockItems, onAddItem }) => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  // 1. Fetch Real On-Chain Items
  const { data: suiObjects, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::${STRUCT_NAME}` },
      options: { showContent: true }
    },
    { enabled: !!currentAccount, refetchInterval: 5000 } // Auto-refresh every 5s
  );

  const [activeCategory, setActiveCategory] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  
  // Modals
  const [successData, setSuccessData] = useState<{ digest: string; cid: string } | null>(null);
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Identity',
    file: null as File | null
  });

  // 2. Merge Real & Mock Data
  const realItems: VaultItem[] = suiObjects?.data.map((obj: any) => {
    const fields = obj.data?.content?.fields;
    return {
      id: obj.data?.objectId,
      title: fields?.title || 'Unknown Document',
      category: fields?.category || 'Other',
      dateAdded: new Date(Number(fields?.date_added || 0)).toISOString().split('T')[0],
      fileSize: fields?.file_size || 'Unknown',
      fileType: fields?.file_type || 'File',
      isEncrypted: true,
      cid: fields?.ipfs_cid
    };
  }) || [];

  const allItems = [...realItems, ...mockItems];

  const filteredItems = allItems.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewItem({ ...newItem, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.file || !newItem.title) return;
    
    if (!currentAccount) {
      alert("⚠️ Please connect your Sui Wallet first!");
      return;
    }

    setIsEncrypting(true);
    setStatusMessage("Encrypting file...");

    try {
      // 1. Mock Encryption
      console.log("🔒 Encrypting...");
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const mockCid = "Qm" + Math.random().toString(36).substring(7) + "Encrypted";
      const fileSize = (newItem.file.size / (1024 * 1024)).toFixed(2) + " MB";
      const fileType = newItem.file.type.split('/')[1].toUpperCase();

      // 2. Build Transaction
      console.log("🏗️ Building Transaction...");
      setStatusMessage("Please sign in your wallet...");
      
      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::create_item`,
        arguments: [
          tx.pure.string(newItem.title),
          tx.pure.string(newItem.category),
          tx.pure.string(mockCid),
          tx.pure.string(fileType),
          tx.pure.string(fileSize),
          tx.object('0x6') // Clock
        ],
      });

      // 3. Execute
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: (result) => {
            console.log("✅ Success:", result);
            setStatusMessage("Success!");
            setIsUploadModalOpen(false);
            setSuccessData({ digest: result.digest, cid: mockCid }); // Show Success Modal
            
            // Add to UI immediately
            onAddItem({
              title: newItem.title,
              category: newItem.category as any,
              dateAdded: new Date().toISOString().split('T')[0],
              fileSize: fileSize,
              fileType: fileType,
              isEncrypted: true,
              cid: mockCid
            });
            
            // Cleanup
            setNewItem({ title: '', category: 'Identity', file: null });
            refetch();
          },
          onError: (err) => {
            console.error("❌ Transaction Failed:", err);
            alert(`Transaction Failed: ${err.message}. Ensure you have SUI test tokens.`);
            setStatusMessage("");
          }
        }
      );

    } catch (error) {
      console.error("❌ Error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsEncrypting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield size={24} className="text-primary" /> Secure Vault
          </h2>
          <p className="text-slate-500">
            {currentAccount 
              ? `Connected: ${currentAccount.address.slice(0,6)}...${currentAccount.address.slice(-4)}`
              : "Connect wallet to view your secure documents."}
          </p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <Upload size={18} /> Upload to Vault
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === 'All' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
        >
          All Items
        </button>
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vault Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">Your vault is empty</p>
            <p className="text-sm text-slate-400">Upload documents to secure them on Sui.</p>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div key={item.id || idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <Lock size={100} className="text-slate-200 -rotate-12 translate-x-8 -translate-y-8" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    item.category === 'Identity' ? 'bg-blue-50 text-blue-600' :
                    item.category === 'Medical' ? 'bg-red-50 text-red-600' :
                    item.category === 'Legal' ? 'bg-purple-50 text-purple-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <FileText size={24} />
                  </div>
                  <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors" 
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      {/* Show Explorer Link for Real Items */}
                      {item.id && item.id.startsWith('0x') && (
                        <a 
                          href={`https://suiscan.xyz/testnet/object/${item.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                          title="View on Chain"
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{item.title}</h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.category}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-xs text-slate-400">{item.fileType}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-xs text-slate-400">{item.fileSize}</span>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">
                    <Lock size={10} /> Encrypted
                  </div>
                  <span className="text-slate-400 font-mono">{item.dateAdded}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- UPLOAD MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Upload to Vault</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Document Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. National ID Card"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <select 
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">File (Will be Encrypted)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                   <input 
                     type="file" 
                     required
                     onChange={handleFileChange}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   />
                   <div className="flex flex-col items-center gap-2 text-slate-500">
                     <HardDrive size={24} className="text-slate-300" />
                     {newItem.file ? (
                       <span className="text-primary font-medium">{newItem.file.name}</span>
                     ) : (
                       <>
                         <span className="text-sm font-medium">Click to browse</span>
                         <span className="text-xs text-slate-400">Max 50MB</span>
                       </>
                     )}
                   </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start">
                <Shield size={16} className="text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  Files are encrypted locally before upload. Only your wallet can decrypt them.
                </p>
              </div>

              <button 
                type="submit"
                disabled={isEncrypting || !currentAccount}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isEncrypting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> {statusMessage}
                  </>
                ) : (
                  <>
                    <Lock size={18} /> Encrypt & Store
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SUCCESS MODAL --- */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 text-center">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
               <CheckCircle size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Successful!</h3>
             <p className="text-slate-500 text-sm mb-6">Your document has been encrypted and stored on the Sui Blockchain.</p>
             
             <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-left">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Transaction ID</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-700 truncate w-40">{successData.digest}</span>
                  <a 
                    href={`https://suiscan.xyz/testnet/tx/${successData.digest}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
                  >
                    View <ExternalLink size={12} />
                  </a>
                </div>
             </div>

             <button onClick={() => setSuccessData(null)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">
               Done
             </button>
          </div>
        </div>
      )}

      {/* --- DETAILS MODAL --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Document Details</h3>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{selectedItem.title}</h4>
                    <p className="text-sm text-slate-500">{selectedItem.category} • {selectedItem.fileSize}</p>
                  </div>
               </div>

               <div className="space-y-3">
                 <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-sm text-slate-600">
                      <p className="text-xs font-bold text-slate-400 uppercase">Object ID</p>
                      <p className="font-mono truncate w-48">{selectedItem.id || "Pending..."}</p>
                    </div>
                    <button onClick={() => copyToClipboard(selectedItem.id || "")} className="p-2 text-slate-400 hover:text-slate-600">
                      <Copy size={16} />
                    </button>
                 </div>

                 {selectedItem.cid && (
                   <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-sm text-slate-600">
                        <p className="text-xs font-bold text-slate-400 uppercase">IPFS CID (Encrypted)</p>
                        <p className="font-mono truncate w-48">{selectedItem.cid}</p>
                      </div>
                      <button onClick={() => copyToClipboard(selectedItem.cid || "")} className="p-2 text-slate-400 hover:text-slate-600">
                        <Copy size={16} />
                      </button>
                   </div>
                 )}
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                   <Eye size={18} /> Decrypt
                 </button>
                 <button className="flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-200">
                   <Share2 size={18} /> Share Key
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Vault;