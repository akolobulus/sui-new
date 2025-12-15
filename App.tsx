import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

// --- COMPONENTS ---
import Sidebar from './components/Sidebar';

// --- PAGES ---
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Insurance from './pages/Insurance';
import Assistant from './pages/Assistant';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Profile from './pages/Profile';
import DrugVerify from './pages/DrugVerify';
import Vault from './pages/Vault';
import Doctors from './pages/Doctors'; 
import DataDao from './pages/DataDao'; 
import Guardians from './pages/Guardians'; 

// ✅ NEW PROFESSIONAL DASHBOARDS
import DoctorDashboard from './pages/DoctorDashboard';
import LabDashboard from './pages/professional/LabDashboard';
import InsurerDashboard from './pages/professional/InsurerDashboard';

// --- TYPES ---
import { AppView, UserRole, HealthRecord, AccessRequest, InsurancePolicy, Claim, VaultItem } from './types';

// --- MOCK DATA ---
const INITIAL_RECORDS: HealthRecord[] = [
  { id: 'REC-88392', type: 'Diagnosis', date: '2024-05-15', doctor: 'Dr. Amina Bello', hospital: 'Lagos University Teaching Hospital', details: 'Acute Malaria Treatment.', verified: true, attachments: [] },
  { id: 'REC-88210', type: 'Vaccination', date: '2024-01-20', doctor: 'Nurse Joy', hospital: 'Reddington Hospital', details: 'Yellow Fever Booster Shot.', verified: true, attachments: [{ name: 'vaccination_card.pdf', url: '#', type: 'application/pdf' }] },
];
const INITIAL_POLICIES: InsurancePolicy[] = [{ id: 'POL-001', type: 'Device', name: 'iPhone 15 Pro Max Cover', coverageAmount: 1500, premium: 5, expiryDate: '2024-12-31', status: 'Active', icon: 'Smartphone' }];
const INITIAL_VAULT_ITEMS: VaultItem[] = [{ id: 'VLT-101', title: 'National Identity Number (NIN) Slip', category: 'Identity', dateAdded: '2023-09-12', fileSize: '1.2 MB', fileType: 'PDF', isEncrypted: true }];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  
  // ✅ Track User Role
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sui Wallet Hook
  const currentAccount = useCurrentAccount();
  const { mutate: disconnectWallet } = useDisconnectWallet();

  // User Data State
  const [userAddress, setUserAddress] = useState<string>('');
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; picture: string } | null>(null);
  
  // State
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
      setUserInfo({ name: 'Wallet User', email: 'wallet@suicare.app', picture: '' });
      setIsAuthenticated(true);
      setShowLoginPage(false);
      
      // ✅ Force Role Selection if not set
      if (!userRole) {
         setCurrentView(AppView.LOGIN);
      }
    }
  }, [currentAccount]);

  // --- 2. Handle Login Success ---
  const handleAuthSuccess = (data: { address: string; email: string; name: string; picture: string }) => {
    setUserAddress(data.address);
    setUserInfo({ name: data.name, email: data.email, picture: data.picture });
    setIsAuthenticated(true);
    setShowLoginPage(false);
    setCurrentView(AppView.LOGIN); // Go to Role Selection
  };

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    // Route to correct default dashboard for that role
    if (role === UserRole.PATIENT) setCurrentView(AppView.DASHBOARD);
    if (role === UserRole.DOCTOR) setCurrentView(AppView.DOCTOR_DASHBOARD);
    if (role === UserRole.PHARMACIST) setCurrentView(AppView.LAB_DASHBOARD);
    if (role === UserRole.INSURER) setCurrentView(AppView.INSURER_DASHBOARD);
  };

  const handleLogout = () => {
    if (currentAccount) disconnectWallet();
    setIsAuthenticated(false);
    setShowLoginPage(false);
    setUserRole(null);
    setCurrentView(AppView.LANDING);
    setUserAddress('');
    setUserInfo(null);
  };

  const handleShowLogin = () => setShowLoginPage(true);

  // --- Handlers ---
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
      if (userRole === UserRole.PATIENT) setCurrentView(AppView.RECORDS);
    }
  };
  const handleDenyRequest = (id: string) => setAccessRequests(prev => prev.filter(r => r.id !== id));
  const handleAddRecord = (r: any) => setRecords(prev => [{ ...r, id: `REC-${Date.now()}`, verified: false }, ...prev]);
  const handleBuyPolicy = (p: any) => { setWalletBalance(b => b - p.premium); setPolicies(prev => [...prev, { ...p, id: `POL-${Date.now()}`, expiryDate: '2025-01-01', status: 'Active' }]); };
  const handleSubmitClaim = (c: any) => setClaims(prev => [{ ...c, id: `CLM-${Date.now()}`, status: 'Pending' }, ...prev]);
  const handleAddVaultItem = (i: any) => setVaultItems(prev => [{ ...i, id: `VLT-${Date.now()}` }, ...prev]);


  // --- RENDER LOGIC ---

  // 1. Not Authenticated
  if (!isAuthenticated) {
    if (showLoginPage) {
      return <Login onLoginSuccess={handleAuthSuccess} onBack={() => setShowLoginPage(false)} onRoleSelect={handleRoleSelect} />; 
    }
    return <Landing onLogin={handleShowLogin} />;
  }

  // 2. Authenticated but No Role
  if (isAuthenticated && !userRole) {
      return <Login onRoleSelect={handleRoleSelect} />;
  }

  // 3. MAIN APP (Sidebar + Content)
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* ✅ Dynamic Sidebar based on UserRole */}
      <Sidebar 
        currentView={currentView}
        userRole={userRole}
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
          {/* --- PATIENT VIEWS --- */}
          {currentView === AppView.DASHBOARD && <Dashboard accessRequests={accessRequests} onApproveRequest={handleApproveRequest} onDenyRequest={handleDenyRequest} onChangeView={setCurrentView} />}
          {currentView === AppView.RECORDS && <Records records={records} onSimulateRequest={handleSimulateRequest} onAddRecord={handleAddRecord} />}
          {currentView === AppView.VAULT && <Vault items={vaultItems} onAddItem={handleAddVaultItem} />}
          {currentView === AppView.INSURANCE && <Insurance policies={policies} claims={claims} walletBalance={walletBalance} onBuyPolicy={handleBuyPolicy} onSubmitClaim={handleSubmitClaim} />}
          {currentView === AppView.DOCTORS && <Doctors />}
          {currentView === AppView.DATA_DAO && <DataDao />} 
          {currentView === AppView.GUARDIANS && <Guardians />} 
          {currentView === AppView.DRUG_VERIFY && <DrugVerify />}
          {currentView === AppView.ASSISTANT && <Assistant />}
          {currentView === AppView.PROFILE && <Profile walletAddress={userAddress} userInfo={userInfo || undefined} />}

          {/* --- PROFESSIONAL VIEWS --- */}
          {currentView === AppView.DOCTOR_DASHBOARD && <DoctorDashboard />}
          {currentView === AppView.LAB_DASHBOARD && <LabDashboard />}
          {currentView === AppView.INSURER_DASHBOARD && <InsurerDashboard />}
        </main>
      </div>
    </div>
  );
};

export default App;