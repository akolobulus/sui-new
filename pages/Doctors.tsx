import React, { useState } from 'react';
import { User, Star, Video, ShieldCheck, Wallet, Loader2, XCircle, Info, Clock } from 'lucide-react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
// ✅ IMPORT CONSTANTS
import { PACKAGE_ID, MODULE_NAME } from '../pages/constants';

const MOCK_DOCTORS = [
  { id: 'doc-1', name: 'Dr. Opemipo', specialty: 'Cardiologist', rating: 4.9, fee: 0.05, reviews: 120, address: '0xa744a7218940647e56f01096d67cef8f72581095b83fa375691028009de22dc9' },
  { id: 'doc-2', name: 'Dr.David', specialty: 'General Practitioner', rating: 4.7, fee: 0.02, reviews: 85, address: '0xa744a7218940647e56f01096d67cef8f72581095b83fa375691028009de22dc9' },
];

const Doctors: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [selectedDoctor, setSelectedDoctor] = useState<typeof MOCK_DOCTORS[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingForm, setBookingForm] = useState({ reason: '', duration: 30 });

  // Calculate dynamic fee based on duration
  const totalFee = selectedDoctor ? (selectedDoctor.fee * (bookingForm.duration / 30)) : 0;

  const handleBook = async () => {
    if (!currentAccount || !selectedDoctor) return alert("Connect Wallet!");
    setIsProcessing(true);

    try {
      const tx = new Transaction();
      // Convert SUI to MIST
      const feeInMist = Math.floor(totalFee * 1_000_000_000);
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(feeInMist)]);

      // ⚠️ Calling the NEW function signature with 6 arguments
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::book_appointment`,
        arguments: [
          tx.pure.address(selectedDoctor.address), 
          tx.pure.string(selectedDoctor.name),     
          tx.pure.string(bookingForm.reason),      // Arg 3: Reason
          tx.pure.u64(bookingForm.duration),       // Arg 4: Duration
          coin,                                    // Arg 5: Payment
          tx.object('0x6')                         // Arg 6: Clock
        ],
      });

      signAndExecute({ transaction: tx }, {
        onSuccess: (result) => {
          alert(`Appointment Booked! Digest: ${result.digest}`);
          setIsProcessing(false);
          setSelectedDoctor(null);
        },
        onError: (err) => {
          console.error(err);
          alert("Booking Failed: " + err.message);
          setIsProcessing(false);
        }
      });
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Telemedicine Marketplace</h2>
          <p className="text-slate-500">Secure consultations with automatic refunds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DOCTORS.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
            <div className="flex gap-4 mb-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <User size={32} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">{doc.name}</h3>
                <p className="text-slate-500 text-sm">{doc.specialty}</p>
                <div className="flex items-center gap-1 mt-1 text-sm font-bold text-slate-700">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" /> {doc.rating}
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl text-center mb-4">
               <p className="text-xs text-slate-400 uppercase font-bold">Base Rate (30m)</p>
               <p className="text-lg font-bold text-primary">{doc.fee} SUI</p>
            </div>
            <button 
              onClick={() => setSelectedDoctor(doc)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Video size={18} /> Book Session
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6">
              <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-slate-800">Book Appointment</h3>
                  <button onClick={() => setSelectedDoctor(null)}><XCircle className="text-slate-400" /></button>
              </div>
              <div className="space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                          {[30, 60, 90].map(mins => (
                              <button key={mins} onClick={() => setBookingForm({...bookingForm, duration: mins})}
                                className={`py-2 rounded-lg text-sm font-bold border ${bookingForm.duration === mins ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600'}`}>
                                  {mins} Mins
                              </button>
                          ))}
                      </div>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Reason</label>
                      <textarea className="w-full p-3 border rounded-xl mt-1 text-sm" rows={2} 
                        value={bookingForm.reason} onChange={(e) => setBookingForm({...bookingForm, reason: e.target.value})} />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Total Fee</span>
                      <span className="text-xl font-bold text-slate-900">{totalFee.toFixed(3)} SUI</span>
                  </div>
              </div>
              <button onClick={handleBook} disabled={isProcessing || !bookingForm.reason} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg flex justify-center items-center gap-2">
                {isProcessing ? <Loader2 className="animate-spin" /> : <Wallet size={18} />} Pay & Book
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;