import React, { useState } from 'react';
import { Database, Coins, Lock, Share2, Loader2, CheckCircle2, Info, Plus } from 'lucide-react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

// ✅ IMPORT CONSTANTS (No more hardcoding!)
import { PACKAGE_ID, MODULE_NAME, RESEARCH_POOL_ID } from '../pages/constants';

const DataDao: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Fetch My Records (Available to Stake)
  const { data: recordObjects, refetch: refetchRecords } = useSuiClientQuery('getOwnedObjects', {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::HealthRecord` },
      options: { showContent: true }
    }, { enabled: !!currentAccount });

  // 2. Fetch My Active Stakes (Receipts)
  const { data: stakeObjects, refetch: refetchStakes } = useSuiClientQuery('getOwnedObjects', {
      owner: currentAccount?.address || '',
      filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::DataStake` },
      options: { showContent: true }
    }, { enabled: !!currentAccount });

  const myRecords = recordObjects?.data.map((obj: any) => ({
      id: obj.data?.objectId,
      type: obj.data?.content?.fields?.record_type || 'General Record',
      date: new Date(Number(obj.data?.content?.fields?.date_added || 0)).toLocaleDateString()
  })) || [];

  const myStakes = stakeObjects?.data.map((obj: any) => ({
      id: obj.data?.objectId,
      recordId: obj.data?.content?.fields?.record_id,
      reward: 0.1 // Reward is fixed for this demo
  })) || [];

  // --- ACTIONS ---

  // Helper: Create a dummy record so you have something to stake
  const handleCreateTestRecord = () => {
    if (!currentAccount) return alert("Connect Wallet");
    setIsProcessing(true);
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::add_record`,
        arguments: [
            tx.pure.string("Research Data Set"), 
            tx.pure.string("Dr. Test"),          
            tx.pure.string("Sui Lab"),           
            tx.pure.string("QmHash"),            
            tx.pure.string("Anonymized Data"),   
            tx.object('0x6')                     
        ]
    });
    signAndExecute({ transaction: tx }, {
        onSuccess: () => {
            alert("Test Record Created! You can now stake it.");
            refetchRecords();
            setIsProcessing(false);
        },
        onError: (err) => { alert("Create Failed: " + err.message); setIsProcessing(false); }
    });
  };

  const handleStake = (recordId: string) => {
    if (!currentAccount) return;
    setIsProcessing(true);
    try {
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::stake_record`,
            arguments: [
                tx.object(RESEARCH_POOL_ID),
                tx.pure.address(recordId), // Pass ID as address
                tx.object('0x6')
            ]
        });

        signAndExecute({ transaction: tx }, {
            onSuccess: () => {
                alert("Staked Successfully! You are now earning rewards.");
                refetchRecords(); // Update lists
                refetchStakes();
                setIsProcessing(false);
            },
            onError: (err) => { 
                console.error(err);
                alert("Stake Failed: " + err.message); 
                setIsProcessing(false); 
            }
        });
    } catch (e) {
        console.error(e);
        setIsProcessing(false);
    }
  };

  const handleClaim = (stakeId: string) => {
    if (!currentAccount) return;
    setIsProcessing(true);
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::claim_rewards`,
        arguments: [
            tx.object(RESEARCH_POOL_ID),
            tx.object(stakeId) // Burn the stake receipt
        ]
    });

    signAndExecute({ transaction: tx }, {
        onSuccess: () => {
            alert("Rewards Claimed! 0.1 SUI sent to wallet.");
            refetchStakes();
            setIsProcessing(false);
        },
        onError: (err) => { alert("Claim Failed: " + err.message); setIsProcessing(false); }
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Data DAO</h2>
           <p className="text-slate-500">Stake your anonymized records to earn SUI from research pools.</p>
        </div>
        
        {/* Pool Info Badge */}
        <div className="flex gap-3">
            <button 
                onClick={handleCreateTestRecord}
                disabled={isProcessing}
                className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2"
            >
                <Plus size={16} /> Create Test Data
            </button>
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-green-100 shadow-sm">
                <Coins size={20}/> 
                <span>Pool Rate: 0.1 SUI</span>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          
          {/* LEFT: Available to Stake */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                  <Database size={20} className="text-blue-500"/> 
                  Your Wallet Records
              </h3>
              
              <div className="space-y-3 flex-1">
                  {myRecords.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-slate-400 text-sm">No records found.</p>
                          <button onClick={handleCreateTestRecord} className="text-blue-600 text-xs font-bold mt-2 hover:underline">Mint one to test</button>
                      </div>
                  ) : (
                      myRecords.map((rec: any) => (
                          <div key={rec.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                              <div>
                                  <p className="font-bold text-slate-700">{rec.type}</p>
                                  <p className="text-xs text-slate-500 font-mono mt-1">{rec.id.slice(0,10)}...</p>
                              </div>
                              <button 
                                onClick={() => handleStake(rec.id)}
                                disabled={isProcessing}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                              >
                                  {isProcessing ? <Loader2 className="animate-spin" size={16} /> : "Stake"}
                              </button>
                          </div>
                      ))
                  )}
              </div>
          </div>

          {/* RIGHT: Active Stakes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800">
                  <Lock size={20} className="text-orange-500"/> 
                  Staked Data (Earning)
              </h3>
              
              <div className="space-y-3 flex-1">
                  {myStakes.length === 0 ? (
                      <div className="text-center py-10 bg-orange-50/50 rounded-xl border border-dashed border-orange-100">
                          <Info className="mx-auto text-orange-300 mb-2" />
                          <p className="text-orange-400 text-sm">You haven't staked any data yet.</p>
                      </div>
                  ) : (
                      myStakes.map((stake: any) => (
                          <div key={stake.id} className="flex justify-between items-center p-4 bg-orange-50 border border-orange-100 rounded-xl">
                              <div>
                                  <p className="font-bold text-slate-800 text-sm">Active Stake</p>
                                  <p className="text-xs text-orange-600 font-bold mt-1 flex items-center gap-1">
                                      <Coins size={12} /> Reward Ready: {stake.reward} SUI
                                  </p>
                              </div>
                              <button 
                                onClick={() => handleClaim(stake.id)}
                                disabled={isProcessing}
                                className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-700 shadow-md flex items-center gap-2"
                              >
                                  {isProcessing ? <Loader2 className="animate-spin" size={16}/> : "Claim"}
                              </button>
                          </div>
                      ))
                  )}
              </div>
          </div>

      </div>
    </div>
  );
};

export default DataDao;