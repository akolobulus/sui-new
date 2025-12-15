import React from 'react';
import { 
  LayoutDashboard, FileText, Shield, Stethoscope, MessageSquareMore, 
  LogOut, X, Scan, UserCircle, Lock, Database, Users, Building2 
} from 'lucide-react';
import { AppView, UserRole } from '../types';

interface SidebarProps {
  currentView: AppView;
  userRole?: UserRole | null; // ✅ New Prop
  onChangeView: (view: AppView) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, userRole, onChangeView, isOpen, onClose, onLogout }) => {
  
  // --- DEFINE MENUS FOR EACH ROLE ---

  const PATIENT_MENU = [
    { view: AppView.DASHBOARD, label: 'MyHealthBox', icon: LayoutDashboard },
    { view: AppView.RECORDS, label: 'Medical Records', icon: FileText },
    { view: AppView.VAULT, label: 'Secure Vault', icon: Lock },
    { view: AppView.INSURANCE, label: 'Insurance Hub', icon: Shield },
    { view: AppView.DOCTORS, label: 'Find Doctor', icon: Stethoscope },
    { view: AppView.DATA_DAO, label: 'Monetize Data', icon: Database },
    { view: AppView.GUARDIANS, label: 'Guardians', icon: Users },
    { view: AppView.DRUG_VERIFY, label: 'Drug Verify', icon: Scan },
    { view: AppView.ASSISTANT, label: 'AI Assistant', icon: MessageSquareMore },
    { view: AppView.PROFILE, label: 'Profile', icon: UserCircle },
  ];

  const DOCTOR_MENU = [
    { view: AppView.DOCTOR_DASHBOARD, label: 'Doctor Portal', icon: LayoutDashboard },
    { view: AppView.RECORDS, label: 'Patient Records', icon: FileText }, // Shared view
    { view: AppView.PROFILE, label: 'Profile Settings', icon: UserCircle },
  ];

  const LAB_MENU = [
    { view: AppView.LAB_DASHBOARD, label: 'Lab Dashboard', icon: LayoutDashboard },
    { view: AppView.DRUG_VERIFY, label: 'Inventory Check', icon: Scan },
    { view: AppView.PROFILE, label: 'Settings', icon: UserCircle },
  ];

  const INSURER_MENU = [
    { view: AppView.INSURER_DASHBOARD, label: 'Admin Dashboard', icon: Building2 },
    { view: AppView.DATA_DAO, label: 'Risk Data', icon: Database },
    { view: AppView.PROFILE, label: 'Settings', icon: UserCircle },
  ];

  // Select the correct menu based on role
  let menuItems = PATIENT_MENU; // Default
  if (userRole === UserRole.DOCTOR) menuItems = DOCTOR_MENU;
  if (userRole === UserRole.PHARMACIST) menuItems = LAB_MENU;
  if (userRole === UserRole.INSURER) menuItems = INSURER_MENU;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:shadow-none border-r border-slate-100 flex flex-col
        `}
      >
        <div className="p-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-200/50">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">SuiCare</h1>
                {userRole && <p className="text-[10px] uppercase font-bold text-primary tracking-widest">{userRole}</p>}
            </div>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-500">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onChangeView(item.view);
                onClose(); // Close on mobile selection
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                ${currentView === item.view 
                  ? 'bg-primary text-white shadow-md shadow-blue-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Disconnect
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;