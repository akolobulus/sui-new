import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Insurance from './pages/Insurance';
import Assistant from './pages/Assistant';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import DrugVerify from './pages/DrugVerify';
import Vault from './pages/Vault';
import { AppView, HealthRecord, AccessRequest, InsurancePolicy, PolicyPlan, Claim, VaultItem } from './types';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

// ... (KEEP ALL MOCK DATA CONSTANTS: INITIAL_RECORDS, ETC. HERE) ...
// (I am omitting the mock data block to save space, but DO NOT DELETE IT from your file)
const INITIAL_RECORDS: HealthRecord[] = [
  { id: 'REC-88392', type: 'Diagnosis', date: '2024-05-15', doctor: 'Dr. Amina Bello', hospital: 'Lagos University Teaching Hospital', details: 'Acute Malaria Treatment. Prescribed Artemether-Lumefantrine.', verified: true, attachments: [] },
  { id: 'REC-88210', type: 'Vaccination', date: '2024-01-20', doctor: 'Nurse Joy', hospital: 'Reddington Hospital', details: 'Yellow Fever Booster Shot.', verified: true, attachments: [{ name: 'vaccination_card.pdf', url: '#', type: 'application/pdf' }] },
  { id: 'REC-77421', type: 'Lab Result', date: '2023-11-05', doctor: 'Lab Tech. Okon', hospital: 'Me Cure Healthcare', details: 'Complete Blood Count (CBC) - Normal parameters.', verified: true, attachments: [{ name: 'blood_test_results.jpg', url: '#', type: 'image/jpeg' }] },
];
const INITIAL_POLICIES: InsurancePolicy[] = [{ id: 'POL-001', type: 'Device', name: 'iPhone 15 Pro Max Cover', coverageAmount: 1500, premium: 5, expiryDate: '2024-12-31', status: 'Active', icon: 'Smartphone' }];
const INITIAL_VAULT_ITEMS: VaultItem[] = [{ id: 'VLT-101', title: 'National Identity Number (NIN) Slip', category: 'Identity', dateAdded: '2023-09-12', fileSize: '1.2 MB', fileType: 'PDF', isEncrypted: true }, { id: 'VLT-102', title: 'Property Deed - Lekki', category: 'Legal', dateAdded: '2023-11-30', fileSize: '4.5 MB', fileType: 'PDF', isEncrypted: true }];


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sui Wallet Hook
  const currentAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();

  // User Data State
  const [userAddress, setUserAddress] = useState<string>('');
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; picture: string } | null>(null);
  
  const [walletBalance, setWalletBalance] = useState(50);
  const [records, setRecords] = useState<HealthRecord[]>(INITIAL_RECORDS);
  const [policies, setPolicies] = useState<InsurancePolicy[]>(INITIAL_POLICIES);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(INITIAL_VAULT_ITEMS);

  // --- 1. Handle Sui Wallet Login ---
  useEffect(() => {
    if (currentAccount) {
      console.log("🔌 Wallet Connected:", currentAccount.address);
      setUserAddress(currentAccount.address);
      // For wallet users, we don't have name/email, so set defaults
      setUserInfo({
        name: 'Wallet User',
        email: 'wallet@suicare.app',
        picture: '' 
      });
      setIsAuthenticated(true);
      setShowLoginPage(false);
      setCurrentView(AppView.DASHBOARD);
    }
  }, [currentAccount]);

  // --- 2. Handle zkLogin (Google) ---
  const handleAuthSuccess = (data: { address: string; email: string; name: string; picture: string }) => {
    setUserAddress(data.address);
    setUserInfo({
      name: data.name,
      email: data.email,
      picture: data.picture
    });
    setIsAuthenticated(true);
    setShowLoginPage(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    // Check if connected via wallet and disconnect
    if (currentAccount) {
      disconnectWallet();
    }
    
    setIsAuthenticated(false);
    setShowLoginPage(false);
    setCurrentView(AppView.LANDING);
    
    // Reset State
    setUserAddress('');
    setUserInfo(null);
    setAccessRequests([]);
    setRecords(INITIAL_RECORDS);
  };

  const handleShowLogin = () => setShowLoginPage(true);

  // ... (Keep existing demo handler functions: handleSimulateRequest, handleApproveRequest, etc.) ...
  // ... (Paste your handleSimulateRequest, handleApproveRequest, handleDenyRequest, handleAddRecord, handleBuyPolicy, handleSubmitClaim, handleAddVaultItem here) ...
  // To keep this response clean, I assume you kept the logic functions from the previous App.tsx. 
  // If you need them pasted again, let me know!
  
  const handleSimulateRequest = () => {
    const newRequest: AccessRequest = { id: `REQ-${Math.floor(Math.random() * 10000)}`, doctorName: 'Dr. Chioma Adebayo', hospital: 'First Cardiology Consultants', purpose: 'Update consultation notes.', timestamp: new Date() };
    setAccessRequests(prev => [newRequest, ...prev]);
    alert("Notification: Dr. Chioma Adebayo is requesting access.");
  };
  const handleApproveRequest = (requestId: string) => {
    const request = accessRequests.find(r => r.id === requestId);
    if (request) {
      setRecords(prev => [{ id: `REC-${Math.floor(Math.random() * 90000)}`, type: 'Diagnosis', date: new Date().toISOString().split('T')[0], doctor: request.doctorName, hospital: request.hospital, details: 'Checkup Complete.', verified: true, attachments: [] }, ...prev]);
      setAccessRequests(prev => prev.filter(r => r.id !== requestId));
      setCurrentView(AppView.RECORDS);
    }
  };
  const handleDenyRequest = (id: string) => setAccessRequests(prev => prev.filter(r => r.id !== id));
  const handleAddRecord = (r: any) => setRecords(prev => [{ ...r, id: `REC-${Date.now()}`, verified: false }, ...prev]);
  const handleBuyPolicy = (p: any) => { setWalletBalance(b => b - p.premium); setPolicies(prev => [...prev, { ...p, id: `POL-${Date.now()}`, expiryDate: '2025-01-01', status: 'Active' }]); };
  const handleSubmitClaim = (c: any) => setClaims(prev => [{ ...c, id: `CLM-${Date.now()}`, status: 'Pending' }, ...prev]);
  const handleAddVaultItem = (i: any) => setVaultItems(prev => [{ ...i, id: `VLT-${Date.now()}` }, ...prev]);


  // --- Render ---

  if (!isAuthenticated) {
    if (showLoginPage) {
      return <Login onLoginSuccess={handleAuthSuccess} onBack={() => setShowLoginPage(false)} />;
    }
    return <Landing onLogin={handleShowLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView}
        onChangeView={setCurrentView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white p-4 flex items-center justify-between border-b border-slate-100 md:hidden z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-slate-800">SuiCare</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {currentView === AppView.DASHBOARD && (
            <Dashboard 
              accessRequests={accessRequests}
              onApproveRequest={handleApproveRequest}
              onDenyRequest={handleDenyRequest}
            />
          )}
          {currentView === AppView.RECORDS && (
            <Records 
              records={records} 
              onSimulateRequest={handleSimulateRequest}
              onAddRecord={handleAddRecord}
            />
          )}
          {currentView === AppView.VAULT && (
            <Vault items={vaultItems} onAddItem={handleAddVaultItem} />
          )}
          {currentView === AppView.INSURANCE && (
            <Insurance 
              policies={policies}
              claims={claims}
              walletBalance={walletBalance}
              onBuyPolicy={handleBuyPolicy}
              onSubmitClaim={handleSubmitClaim}
            />
          )}
          {currentView === AppView.DRUG_VERIFY && <DrugVerify />}
          {currentView === AppView.ASSISTANT && <Assistant />}
          
          {currentView === AppView.PROFILE && (
            <Profile 
              walletAddress={userAddress} 
              userInfo={userInfo || undefined} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;