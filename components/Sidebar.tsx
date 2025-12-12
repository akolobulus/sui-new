import React from 'react';
import { LayoutDashboard, FileText, ShieldCheck, MessageSquareMore, LogOut, X, Scan, UserCircle, Lock, Stethoscope } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, onClose, onLogout }) => {
  const menuItems = [
    { view: AppView.DASHBOARD, label: 'MyHealthBox', icon: LayoutDashboard },
    { view: AppView.RECORDS, label: 'Medical Records', icon: FileText },
    { view: AppView.DOCTORS, label: 'Find Doctor', icon: Stethoscope }, // ✅ NEW: Telemedicine Link
    { view: AppView.VAULT, label: 'Secure Vault', icon: Lock },
    { view: AppView.INSURANCE, label: 'Insurance Hub', icon: ShieldCheck },
    { view: AppView.DRUG_VERIFY, label: 'Drug Verify', icon: Scan },
    { view: AppView.ASSISTANT, label: 'AI Assistant', icon: MessageSquareMore },
    { view: AppView.PROFILE, label: 'Profile & Settings', icon: UserCircle },
  ];

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
          md:translate-x-0 md:static md:shadow-none border-r border-slate-100
        `}
      >
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">SuiCare</h1>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-500">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                onChangeView(item.view);
                onClose(); // Close on mobile selection
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                ${currentView === item.view 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-4">
          <div className="p-4 bg-primary/5 rounded-xl mb-4 border border-primary/10">
            <p className="text-xs text-slate-500 font-semibold mb-1">CONNECTED WALLET</p>
            {/* You can pass the real address via props later if you want */}
            <p className="text-sm font-mono text-slate-700 truncate">0x71a...9b2c</p>
          </div>
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