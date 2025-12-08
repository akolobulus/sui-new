
import React, { useState } from 'react';
import { Scan, CheckCircle, AlertTriangle, XCircle, Search, Box, Loader2 } from 'lucide-react';
import { DrugVerificationResult } from '../types';

const DrugVerify: React.FC = () => {
  const [code, setCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<DrugVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    
    // Simulate Blockchain Verification
    setTimeout(() => {
      setIsLoading(false);
      // Demo Logic: if code contains "FAKE", return fake, else valid
      if (code.toUpperCase().includes('FAKE')) {
        setResult({
          batchNumber: code,
          productName: 'Amartem Softgel (Counterfeit)',
          manufacturer: 'Unknown Source',
          expiryDate: 'N/A',
          status: 'Fake',
          scanTimestamp: new Date()
        });
      } else {
        setResult({
          batchNumber: code,
          productName: 'Amartem Softgel',
          manufacturer: 'Elbe Pharma Nigeria',
          expiryDate: '2025-12-01',
          status: 'Valid',
          scanTimestamp: new Date()
        });
      }
    }, 1500);
  };

  const startScan = () => {
    setIsScanning(true);
    // In a real app, this would trigger the camera
    // Here we simulate a scan after 2 seconds
    setTimeout(() => {
      setCode('NG-BATCH-882910');
      setIsScanning(false);
      handleVerify({ preventDefault: () => {} } as React.FormEvent);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Drug Authenticity Scanner</h2>
        <p className="text-slate-500">Verify medications instantly against the Sui blockchain registry.</p>
      </div>

      {/* Main Action Area */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        
        {/* Scanner View / Placeholder */}
        <div className="bg-slate-900 h-64 relative flex flex-col items-center justify-center text-white">
          {isScanning ? (
            <>
              <div className="absolute inset-0 bg-black/50 z-10"></div>
              <div className="w-64 h-64 border-2 border-primary rounded-3xl relative z-20 animate-pulse">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 animate-[scan_2s_ease-in-out_infinite]"></div>
              </div>
              <p className="absolute bottom-8 z-20 font-medium">Position code within frame</p>
            </>
          ) : (
            <>
              <Scan size={64} className="opacity-50 mb-4" />
              <button 
                onClick={startScan}
                className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                <Scan size={20} /> Tap to Scan QR
              </button>
            </>
          )}
        </div>

        {/* Manual Input */}
        <div className="p-8">
          <form onSubmit={handleVerify} className="flex gap-3">
            <div className="relative flex-1">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Or enter Batch Number (e.g. NG-882)"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-800 font-medium"
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

      {/* Result Card */}
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
                    ? 'This product has been verified on the Sui blockchain registry.' 
                    : 'This batch number does not exist or has been flagged.'}
                </p>
              </div>

              <div className="bg-white/50 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm mt-2">
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Product Name</p>
                  <p className="font-semibold text-slate-800">{result.productName}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Batch Number</p>
                  <p className="font-semibold text-slate-800 font-mono">{result.batchNumber}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Manufacturer</p>
                  <p className="font-semibold text-slate-800">{result.manufacturer}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Expiry Date</p>
                  <p className="font-semibold text-slate-800">{result.expiryDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugVerify;
