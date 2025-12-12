import React, { useState } from 'react';
import { Scan, CheckCircle, AlertTriangle, XCircle, Search, Box, Loader2, Plus, Database, UserCheck } from 'lucide-react';
import { DrugVerificationResult } from '../types';
import { useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

// ✅ IMPORT CONSTANTS (No more hardcoding!)
import { PACKAGE_ID, DRUG_REGISTRY_ID } from '../pages/constants';

// Since the module for drugs might be different than 'vault', we define it here or add to constants if needed.
// Based on your deployment, 'drugs' is a separate module inside the same package.
const DRUG_MODULE_NAME = 'drugs'; 

// Extended type for frontend
interface ExtendedDrugResult extends DrugVerificationResult {
  producerAddress?: string;
}

const DrugVerify: React.FC = () => {
  const client = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [code, setCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ExtendedDrugResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [newDrug, setNewDrug] = useState({ batch: '', name: '', manufacturer: '', expiry: '' });

  // --- VERIFY (READ) ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await client.getDynamicFieldObject({
        parentId: DRUG_REGISTRY_ID,
        name: { type: '0x1::string::String', value: code }
      });

      if (response.data) {
        // Parse fields from Move Struct
        const fields = (response.data.content as any).fields.value.fields;
        
        setResult({
          batchNumber: code,
          productName: fields.product_name,
          manufacturer: fields.manufacturer,
          expiryDate: fields.expiry_date,
          status: 'Valid',
          scanTimestamp: new Date(),
          producerAddress: fields.producer // ✅ Get the producer address
        });
      }
    } catch (error) {
      console.error("Verification Error:", error);
      setResult({
        batchNumber: code,
        productName: 'Unknown Product',
        manufacturer: 'Unknown Source',
        expiryDate: 'N/A',
        status: 'Fake',
        scanTimestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- REGISTER (WRITE) ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::${DRUG_MODULE_NAME}::register_drug`,
      arguments: [
        tx.object(DRUG_REGISTRY_ID),
        tx.pure.string(newDrug.batch),
        tx.pure.string(newDrug.name),
        tx.pure.string(newDrug.manufacturer),
        tx.pure.string(newDrug.expiry),
      ],
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: () => {
        alert(`Batch ${newDrug.batch} Registered!`);
        setNewDrug({ batch: '', name: '', manufacturer: '', expiry: '' });
      },
      onError: (err) => alert("Failed: " + err.message)
    });
  };

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setCode('NG-BATCH-882910'); 
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-slate-800">Drug Authenticity</h2>
          <p className="text-slate-500">Global Registry Lookup</p>
        </div>
        <button onClick={() => setIsAdminMode(!isAdminMode)} className="text-slate-300 hover:text-primary">
          <Database size={20} />
        </button>
      </div>

      {isAdminMode && (
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-6">
          <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2"><Plus size={16}/> Register New Batch</h3>
          <form onSubmit={handleRegister} className="space-y-3">
            <input placeholder="Batch # (e.g. NG-123)" value={newDrug.batch} onChange={e => setNewDrug({...newDrug, batch: e.target.value})} className="w-full p-2 rounded border" required />
            <input placeholder="Product Name" value={newDrug.name} onChange={e => setNewDrug({...newDrug, name: e.target.value})} className="w-full p-2 rounded border" required />
            <input placeholder="Manufacturer" value={newDrug.manufacturer} onChange={e => setNewDrug({...newDrug, manufacturer: e.target.value})} className="w-full p-2 rounded border" required />
            <input type="date" value={newDrug.expiry} onChange={e => setNewDrug({...newDrug, expiry: e.target.value})} className="w-full p-2 rounded border" required />
            <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded font-bold">Register on Chain</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 h-64 relative flex flex-col items-center justify-center text-white">
          {isScanning ? (
            <>
              <div className="absolute inset-0 bg-black/50 z-10"></div>
              <div className="w-64 h-64 border-2 border-primary rounded-3xl relative z-20 animate-pulse">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
              <p className="absolute bottom-8 z-20 font-medium">Scanning...</p>
            </>
          ) : (
            <>
              <Scan size={64} className="opacity-50 mb-4" />
              <button 
                onClick={startScan}
                className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg flex items-center gap-2"
              >
                <Scan size={20} /> Scan QR Code
              </button>
            </>
          )}
        </div>

        <div className="p-8">
          <form onSubmit={handleVerify} className="flex gap-3">
            <div className="relative flex-1">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Batch Number"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading || !code}
              className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Check'}
            </button>
          </form>
        </div>
      </div>

      {result && (
        <div className={`
          rounded-2xl p-6 border-2 animate-in slide-in-from-bottom-4
          ${result.status === 'Valid' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}
        `}>
          <div className="flex items-start gap-4">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center shrink-0
              ${result.status === 'Valid' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
            `}>
              {result.status === 'Valid' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
            </div>
            
            <div className="flex-1 space-y-2">
              <div>
                <h3 className={`font-bold text-lg ${result.status === 'Valid' ? 'text-green-800' : 'text-red-800'}`}>
                  {result.status === 'Valid' ? 'Authentic Product' : 'WARNING: Potential Fake'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {result.status === 'Valid' 
                    ? 'Verified on Sui Blockchain.' 
                    : 'This batch number was not found in the registry.'}
                </p>
              </div>

              <div className="bg-white/50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Product</p>
                  <p className="font-semibold text-slate-800">{result.productName}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Batch #</p>
                  <p className="font-semibold text-slate-800 font-mono">{result.batchNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Manufacturer</p>
                  <p className="font-semibold text-slate-800">{result.manufacturer}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Expiry</p>
                  <p className="font-semibold text-slate-800">{result.expiryDate}</p>
                </div>
                
                {/* NEW: Producer Verification Section */}
                {result.producerAddress && (
                  <div className="col-span-2 border-t border-slate-200 pt-3 mt-1">
                      <p className="text-slate-500 text-xs uppercase font-bold flex items-center gap-1 mb-1">
                        <UserCheck size={12} /> Registered By (On-Chain ID)
                      </p>
                      <p className="font-mono text-xs text-slate-600 bg-slate-100 p-2 rounded break-all">
                        {result.producerAddress}
                      </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugVerify;