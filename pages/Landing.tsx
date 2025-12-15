import React from 'react';
import { 
  ShieldCheck, Heart, Lock, Zap, Box, Key, Users, Smartphone, 
  FileCheck, Activity, ArrowRight, CheckCircle2, Stethoscope, 
  Gamepad2, Database, Network, Scan, FlaskConical, Building2 
} from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/20">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
               <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">SuiCare</span>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={onLogin}
                className="hidden md:block text-slate-600 font-medium hover:text-primary transition-colors"
            >
                Log In
            </button>
            <button 
                onClick={onLogin}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-24 lg:pb-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-full text-sm font-bold border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap size={16} fill="currentColor" />
              <span>Powered by Sui Network</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              The Future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Decentralized Care.</span>
            </h1>
            
            <p className="text-lg md:text-xl font-medium text-slate-500 max-w-lg">
              A unified ecosystem for Patients, Doctors, and Insurers. Own your data, verify your meds, and get paid instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center lg:justify-start">
              <button 
                onClick={onLogin}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-200/50 flex items-center justify-center gap-2"
              >
                Launch App <ArrowRight size={20} />
              </button>
              <button className="bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                View Demo
              </button>
            </div>
          </div>

          {/* Hero Visual Card (Flat Design - Reliable) */}
          <div className="relative h-[600px] flex items-center justify-center w-full group">
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-gradient-to-tr from-primary/20 to-purple-300/30 rounded-full blur-[80px] opacity-70 animate-pulse"></div>
              
              {/* THE CARD (Flat, Clean, Modern) */}
              <div className="
                  relative bg-white/80 backdrop-blur-xl border border-white/60 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full 
                  transform transition-all duration-500 ease-out 
                  hover:scale-[1.03] hover:shadow-primary/20 hover:-translate-y-2
              ">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Health Vault</h3>
                    <p className="text-sm text-slate-500 font-mono">0x71...9b2c</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-inner">
                    <ShieldCheck size={24} />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Card 1 */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-blue-200 transition-colors">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <Heart size={24} className="fill-blue-500/20" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Medical Records</h4>
                      <p className="text-xs text-slate-500 font-medium">12 Encrypted Files • IPFS</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-purple-200 transition-colors">
                    <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                      <Gamepad2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Health Avatar</h4>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-white bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-0.5 rounded-full">Level 5</span>
                          <span className="text-xs text-slate-500">Lion King</span>
                      </div>
                    </div>
                  </div>

                   {/* Card 3 */}
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:border-orange-200 transition-colors">
                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
                      <Box size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">Data Earnings</h4>
                      <p className="text-xs text-slate-500 font-medium">+12.5 SUI (Ready to Claim)</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Complete Health Infrastructure</h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            We moved the entire healthcare stack to the blockchain. Secure, transparent, and rewarding for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: Stethoscope, 
              color: "text-blue-600 bg-blue-50",
              title: "Telemedicine", 
              desc: "Book verified specialists instantly. Smart contracts hold funds in escrow until the consultation is complete." 
            },
            { 
              icon: Scan, 
              color: "text-purple-600 bg-purple-50",
              title: "PharmaGuard", 
              desc: "Eliminate counterfeits. Scan medicine batch codes to verify authenticity directly on the Drug Registry." 
            },
            { 
              icon: Database, 
              color: "text-orange-600 bg-orange-50",
              title: "Data DAO", 
              desc: "Stop giving data away for free. Stake anonymized records to research pools and earn SUI rewards." 
            },
            { 
              icon: Network, 
              color: "text-indigo-600 bg-indigo-50",
              title: "Guardians", 
              desc: "Break-glass protocol. Grant emergency access to trusted family via multi-sig wallet logic." 
            },
            { 
              icon: Zap, 
              color: "text-yellow-600 bg-yellow-50",
              title: "Auto-Insurance", 
              desc: "Parametric insurance that pays out instantly based on Oracle data triggers. No paperwork." 
            },
            { 
              icon: Gamepad2, 
              color: "text-green-600 bg-green-50",
              title: "Health Avatars", 
              desc: "Gamify wellness. Your dynamic NFT evolves based on your real-world health actions." 
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Ecosystem Section (For Professionals) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px]"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">A Unified Ecosystem</h2>
                  <p className="text-slate-400 text-lg">Built for every stakeholder in the healthcare journey.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                      <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Users size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Patients</h3>
                      <p className="text-slate-400 text-sm">Own data, access global care, and monetize records.</p>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                      <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                          <FlaskConical size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Providers & Labs</h3>
                      <p className="text-slate-400 text-sm">Issue immutable verifications and receive instant payments.</p>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                      <div className="w-16 h-16 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Building2 size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Insurers</h3>
                      <p className="text-slate-400 text-sm">Automate claims processing with AI and on-chain history.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Start Your Journey</h2>
          <p className="text-lg text-slate-600 mb-12">
            Seamlessly bridge your physical health with digital assets.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {[
              "Connect Wallet / zkLogin",
              "Mint Health Avatar",
              "Upload & Encrypt Records",
              "Stake Data for Rewards",
              "Buy Micro-Insurance",
              "Assign Emergency Contacts"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/50 transition-colors">
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                <span className="font-semibold text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-primary to-blue-700 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-6xl font-bold mb-6 tracking-tight">Join the Health Revolution</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Secure your life. Monetize your data. Live healthier. The first health app that pays you back.
            </p>
            <button 
              onClick={onLogin}
              className="bg-white text-primary px-12 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-xl"
            >
              Enter Dashboard
            </button>
          </div>
          
          {/* Background Decorations */}
          <ShieldCheck className="absolute top-[-50px] right-[-50px] w-96 h-96 opacity-10 rotate-12" />
          <Heart className="absolute bottom-[-50px] left-[-50px] w-80 h-80 opacity-10 -rotate-12" />
          <Activity className="absolute top-20 left-20 w-32 h-32 opacity-10 animate-pulse" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900">SuiCare</span>
          </div>
          <p className="text-slate-500 font-medium mb-8">Empowering patients with ownership, privacy, and rewards.</p>
          <div className="flex justify-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
              <a href="#" className="hover:text-slate-600">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;