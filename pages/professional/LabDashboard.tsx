import React, { useState } from 'react';
import { Scan, FileText, CheckCircle, Search, User, FlaskConical, Loader2, Plus, Upload, Package, AlertTriangle, X, Trash2 } from 'lucide-react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MODULE_NAME } from '../constants';

// Mock Type for Inventory Items
interface InventoryItem {
  id: string;
  batch: string;
  name: string;
  quantity: number;
  expiry: string;
  verified: boolean;
}

const LabDashboard: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [activeTab, setActiveTab] = useState<'inventory' | 'issue'>('inventory');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- INVENTORY STATE ---
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 'INV-1', batch: 'NG-229', name: 'Amoxicillin 500mg', quantity: 50, expiry: '2025-12', verified: true },
    { id: 'INV-2', batch: 'NG-881', name: 'Malaria Tabs', quantity: 200, expiry: '2024-08', verified: true },
  ]);
  const [scanCode, setScanCode] = useState('');
  const [scanResult, setScanResult] = useState<{valid: boolean, msg: string, product?: string} | null>(null);

  // --- ISSUE RESULT STATE ---
  const [patientAddr, setPatientAddr] = useState('');
  const [testDetails, setTestDetails] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- ACTIONS: INVENTORY ---

  const handleScanProduct = () => {
    if (!scanCode) return;
    setIsProcessing(true);
    setScanResult(null);

    // Simulation of checking the On-Chain DrugRegistry
    setTimeout(() => {
        const isValid = scanCode.startsWith("NG"); // Mock validation logic
        setScanResult({
            valid: isValid,
            msg: isValid ? "✅ Authentic Batch Verified" : "❌ Warning: Batch Not Found or Suspicious",
            product: isValid ? "Amoxicillin 500mg (Pfizer)" : undefined
        });
        setIsProcessing(false);
    }, 1500);
  };

  const handleAddToInventory = () => {
    if (scanResult?.valid && scanResult.product) {
        const newItem: InventoryItem = {
            id: `INV-${Date.now()}`,
            batch: scanCode,
            name: scanResult.product,
            quantity: 100, // Default for demo
            expiry: '2026-01',
            verified: true
        };
        setInventory([newItem, ...inventory]);
        setScanCode('');
        setScanResult(null);
        alert("Product added to Local Inventory!");
    }
  };

  // --- ACTIONS: ISSUE RECORD ---

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
      // Simulate upload progress
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
            if (prev >= 100) { clearInterval(interval); return 100; }
            return prev + 20;
        });
      }, 200);
    }
  };

  const handleIssueResult = async () => {
    if (!currentAccount || !patientAddr) return alert("Enter Patient Address");
    setIsProcessing(true);

    // 1. Simulate IPFS Upload
    let ipfsCid = "No Attachment";
    if (attachedFile) {
        console.log("Uploading file to IPFS...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        ipfsCid = "Qm" + Math.random().toString(36).substring(7) + "ResultPDF"; // Mock CID
    }

    const tx = new Transaction();
    // Using standard add_record. 
    // In a real "Enterprise" contract, you would use a function like `mint_to_patient` 
    // that takes the recipient address as an argument.
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::add_record`,
        arguments: [
            tx.pure.string("Lab Result (Verified)"), // Type
            tx.pure.string("SuiCare Pathology"),     // Doctor/Issuer
            tx.pure.string("Main Lab"),              // Hospital
            tx.pure.string(ipfsCid),                 // ✅ Real IPFS CID would go here
            tx.pure.string(testDetails),             // Details
            tx.object('0x6')
        ]
    });

    signAndExecute({ transaction: tx }, {
        onSuccess: (result) => {
            alert(`✅ Record Minted Successfully!\n\nTarget Patient: ${patientAddr.slice(0,6)}...\nFile CID: ${ipfsCid}\nDigest: ${result.digest.slice(0,10)}...`);
            setIsProcessing(false);
            setTestDetails('');
            setPatientAddr('');
            setAttachedFile(null);
            setUploadProgress(0);
        },
        onError: (err) => { alert("Failed: " + err.message); setIsProcessing(false); }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-purple-900 text-white p-8 rounded-3xl flex justify-between items-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Lab & Pharmacy Portal</h1>
            <p className="text-purple-200">Manage inventory, verify supplies, and issue certified results.</p>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md relative z-10">
            <FlaskConical size={32} className="text-purple-300" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('inventory')} className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 ${activeTab === 'inventory' ? 'border-b-2 border-purple-600 text-purple-700' : 'text-slate-500'}`}>
            <Package size={18} /> Inventory & Verify
        </button>
        <button onClick={() => setActiveTab('issue')} className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 ${activeTab === 'issue' ? 'border-b-2 border-purple-600 text-purple-700' : 'text-slate-500'}`}>
            <FileText size={18} /> Issue Patient Results
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Functional Area */}
        <div className="md:col-span-2 space-y-6">
            
            {/* --- TAB 1: INVENTORY & VERIFICATION --- */}
            {activeTab === 'inventory' && (
                <div className="space-y-8">
                    {/* Scanner Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Scan className="text-purple-600" /> Supply Chain Verification
                        </h3>
                        <p className="text-slate-500 text-sm mb-6">Scan incoming medicine batch codes to verify authenticity on Sui.</p>
                        
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Enter Batch ID (e.g. NG-229)" 
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-purple-500/20 outline-none"
                                    value={scanCode}
                                    onChange={(e) => setScanCode(e.target.value)}
                                />
                            </div>
                            <button onClick={handleScanProduct} disabled={isProcessing || !scanCode} className="bg-purple-600 text-white px-8 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors">
                                {isProcessing ? <Loader2 className="animate-spin"/> : "Verify"}
                            </button>
                        </div>
                        
                        {scanResult && (
                            <div className={`p-4 rounded-xl border flex justify-between items-center ${scanResult.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                <div>
                                    <p className={`font-bold text-lg ${scanResult.valid ? 'text-green-800' : 'text-red-800'}`}>{scanResult.msg}</p>
                                    {scanResult.product && <p className="text-sm text-slate-600 font-medium">{scanResult.product}</p>}
                                </div>
                                {scanResult.valid && (
                                    <button onClick={handleAddToInventory} className="bg-white text-green-700 border border-green-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-100">
                                        + Add to Stock
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Inventory List */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h4 className="font-bold text-slate-800 mb-4">Current Verified Stock</h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Product</th>
                                        <th className="px-4 py-3">Batch #</th>
                                        <th className="px-4 py-3">Qty</th>
                                        <th className="px-4 py-3">Expiry</th>
                                        <th className="px-4 py-3 rounded-r-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                                            <td className="px-4 py-3 font-mono text-slate-500">{item.batch}</td>
                                            <td className="px-4 py-3">{item.quantity}</td>
                                            <td className="px-4 py-3">{item.expiry}</td>
                                            <td className="px-4 py-3">
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                                                    <CheckCircle size={10} /> Verified
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB 2: ISSUE RESULT --- */}
            {activeTab === 'issue' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <FileText className="text-purple-600" /> Mint Verified Lab Report
                    </h3>
                    
                    <div className="space-y-6">
                        {/* Patient Address Input */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Patient Wallet Address (Recipient)</label>
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3 focus-within:ring-2 focus-within:ring-purple-500/20">
                                <User size={18} className="text-slate-400"/>
                                <input 
                                    className="bg-transparent flex-1 outline-none text-sm font-mono" 
                                    placeholder="0x..." 
                                    value={patientAddr} 
                                    onChange={e => setPatientAddr(e.target.value)} 
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">The minted record will be transferred to this address.</p>
                        </div>

                        {/* Test Details */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Test Results / Diagnosis Details</label>
                            <textarea 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none" 
                                placeholder="e.g. Blood Test confirmed malaria parasite levels at..." 
                                value={testDetails} 
                                onChange={e => setTestDetails(e.target.value)} 
                            />
                        </div>

                        {/* File Upload Attachment */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Attach Scan / PDF (Optional)</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                {attachedFile ? (
                                    <div className="flex items-center justify-center gap-2 text-purple-700 bg-purple-50 p-2 rounded-lg inline-block">
                                        <FileText size={20} />
                                        <span className="font-medium text-sm">{attachedFile.name}</span>
                                        <button onClick={(e) => {e.preventDefault(); setAttachedFile(null); setUploadProgress(0);}} className="p-1 hover:bg-purple-100 rounded-full"><X size={14}/></button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <Upload size={24} />
                                        <p className="text-sm font-medium">Click to upload X-Ray, PDF, or Lab Report</p>
                                    </div>
                                )}
                            </div>
                            {/* Fake Progress Bar */}
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            )}
                            {uploadProgress === 100 && <p className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1"><CheckCircle size={12}/> Ready to IPFS</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button 
                                onClick={handleIssueResult} 
                                disabled={isProcessing || !patientAddr || !testDetails} 
                                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : <><CheckCircle size={20}/> Mint & Send Record</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* RIGHT COLUMN: Sidebar Stats */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-700 mb-4">Lab Queue</h4>
                <div className="space-y-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-sm">
                                <p className="font-bold text-slate-800">Order #L-{400+i}</p>
                                <p className="text-xs text-slate-500">Full Blood Count</p>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">Pending</span>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 text-center text-purple-600 text-sm font-bold hover:underline">View All Requests</button>
            </div>

            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2"><AlertTriangle size={18}/> Low Stock Alert</h4>
                <p className="text-sm text-purple-700 mb-3">Paracetamol 500mg is below threshold (Qty: 12).</p>
                <button className="bg-white text-purple-700 border border-purple-200 px-4 py-2 rounded-lg text-xs font-bold w-full hover:bg-purple-100">Reorder</button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LabDashboard;