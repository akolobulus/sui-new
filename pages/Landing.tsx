import React from 'react';
import { ShieldCheck, Heart, Lock, Zap, Box, Key, Users, Smartphone, FileCheck, Activity, ArrowRight, CheckCircle2, Stethoscope, Gamepad2, Database, Network } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-800">SuiCare</span>
          </div>
          <button 
            onClick={onLogin}
            className="bg-primary hover:bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-lg shadow-blue-200"
          >
            Connect Wallet / zkLogin
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-blue-100">
              <Zap size={16} fill="currentColor" />
              <span>Powered by Sui Blockchain</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1]">
              The Future of <br/>
              <span className="text-primary">Decentralized Care.</span>
            </h1>
            
            <p className="text-lg md:text-xl font-medium text-slate-800">
              Health. Insurance. Data Ownership. All on Sui.
            </p>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
              SuiCare is the first comprehensive ecosystem combining telemedicine, insurance, and data monetization. Own your records, earn from your data, and protect your family with automated smart contracts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center md:justify-start">
              <button 
                onClick={onLogin}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-blue-200"
              >
                Launch App
              </button>
              <button className="bg-white text-slate-700 px-8 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                Read Whitepaper
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center w-full">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-gradient-to-tr from-primary/30 to-purple-200 rounded-full blur-[60px] md:blur-[100px] opacity-60"></div>
             
             <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm md:max-w-md w-full transform rotate-3 hover:rotate-0 transition-duration-500">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800">My Health Vault</h3>
                    <p className="text-sm md:text-base text-slate-500">DID: sui::0x71...9b2c</p>
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                      <Heart size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-slate-800">Health Records</h4>
                      <p className="text-[10px] md:text-xs text-slate-500">Encrypted on IPFS</p>
                    </div>
                  </div>

                  <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center shrink-0">
                      <Gamepad2 size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-slate-800">Health Avatar</h4>
                      <p className="text-[10px] md:text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">Level 5 • Healthy</p>
                    </div>
                  </div>

                   <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center shrink-0">
                      <Box size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-slate-800">Data Rewards</h4>
                      <p className="text-[10px] md:text-xs text-slate-500">+12.5 SUI Earned</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">Ecosystem Features</div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Built for the Next Generation</h2>
          <p className="text-slate-500 mt-4">Leveraging Sui's speed and object model to solve real healthcare problems.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: Stethoscope, 
              title: "Telemedicine Marketplace", 
              desc: "Book appointments with specialists using SUI. Smart contract escrow ensures you only pay when the consultation is complete." 
            },
            { 
              icon: Gamepad2, 
              title: "Health Avatar NFTs", 
              desc: "Gamify your wellness. Your dynamic NFT evolves based on your real-world health data (steps, checkups). Stay healthy, level up!" 
            },
            { 
              icon: Database, 
              title: "Data DAO & Research", 
              desc: "Stop giving data away for free. Stake your anonymized records in our Research Pool and earn SUI from pharmaceutical companies." 
            },
            { 
              icon: Network, 
              title: "Family Delegation", 
              desc: "Grant emergency access to trusted family members using multi-sig logic. Ensures your data is accessible when it matters most." 
            },
            { 
              icon: Zap, 
              title: "Automated Payouts", 
              desc: "Insurance claims for flight delays or weather events trigger instant payouts via Oracle integration. No paperwork, just code." 
            },
            { 
              icon: Lock, 
              title: "Privacy by Default", 
              desc: "Your medical and personal data stays encrypted end-to-end. Only you hold the keys to decrypt and share." 
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">How SuiCare Works</h2>
          <p className="text-lg text-slate-600 mb-12">
            A seamless bridge between your physical health and your digital assets.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              "Connect Wallet / zkLogin",
              "Mint Health Avatar",
              "Upload & Encrypt Records",
              "Stake Data for Rewards",
              "Buy Micro-Insurance",
              "Assign Emergency Contacts"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the Health Revolution</h2>
            <p className="text-xl opacity-90 mb-10">Secure your life. Monetize your data. Live healthier.</p>
            <button 
              onClick={onLogin}
              className="bg-white text-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
            >
              Enter App
            </button>
          </div>
          
          <ShieldCheck className="absolute top-[-50px] right-[-50px] w-96 h-96 opacity-10 rotate-12" />
          <Heart className="absolute bottom-[-50px] left-[-50px] w-80 h-80 opacity-10 -rotate-12" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900">SuiCare</span>
          </div>
          <p className="text-slate-500 font-medium">Empowering patients with ownership, privacy, and rewards.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;