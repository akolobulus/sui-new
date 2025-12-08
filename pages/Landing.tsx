
import React from 'react';
import { ShieldCheck, Heart, Lock, Zap, Box, Key, Users, Smartphone, FileCheck, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

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
              Protect What <br/>
              <span className="text-primary">Matters.</span>
            </h1>
            
            <p className="text-lg md:text-xl font-medium text-slate-800">
              Anytime. Anywhere. Powered by Sui.
            </p>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
              SuiCare is a blockchain-powered insurance and digital health platform that protects your health, devices, bikes, goods, and medical history — all secured, private, and fully owned by you.
            </p>

            <p className="text-sm font-medium text-slate-500 border-l-4 border-primary pl-4 text-left w-full max-w-lg">
              Your health, your data, your property — all secured with Sui’s unmatched speed, low fees, and cryptographic safety.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full justify-center md:justify-start">
              <button 
                onClick={onLogin}
                className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-blue-200"
              >
                Get Started
              </button>
              <button className="bg-white text-slate-700 px-8 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                View Plans
              </button>
            </div>
            
            <button className="flex items-center gap-2 text-primary font-semibold hover:underline">
              Learn How It Works <ArrowRight size={16} />
            </button>
          </div>

          {/* Hero Visual */}
          <div className="relative h-[400px] lg:h-[600px] flex items-center justify-center w-full">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-gradient-to-tr from-primary/30 to-purple-200 rounded-full blur-[60px] md:blur-[100px] opacity-60"></div>
             
             <div className="relative bg-white/60 backdrop-blur-xl border border-white/40 p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm md:max-w-md w-full transform rotate-3 hover:rotate-0 transition-duration-500">
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800">My Vault</h3>
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
                      <p className="text-[10px] md:text-xs text-slate-500">Last updated: 2 hrs ago</p>
                    </div>
                  </div>

                  <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center shrink-0">
                      <Smartphone size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-slate-800">iPhone 15 Pro</h4>
                      <p className="text-[10px] md:text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">Insured</p>
                    </div>
                  </div>

                   <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-slate-500 rounded-lg flex items-center justify-center shrink-0">
                      <Lock size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm md:text-base text-slate-800">Secure Vault</h4>
                      <p className="text-[10px] md:text-xs text-slate-500">Secure your items</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* What is SuiCare */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">What is SuiCare?</h2>
          <p className="text-lg text-slate-600 mb-12">
            SuiCare is a decentralized protection and insurance system that helps you secure your most valuable assets and information. Everything is private, transparent, and controlled by you alone — not hospitals, not insurers, not third parties.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              "Secure health records",
              "Insure phones, laptops & bikes",
              "Verify real medications",
              "Purchase low-cost plans",
              "File & track claims",
              "Global record access"
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose SuiCare */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">Features</div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why Choose SuiCare?</h2>
          <p className="text-slate-500 mt-4">Built on the Sui Blockchain for unmatched performance.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: Lock, 
              title: "Privacy by Default", 
              desc: "Your medical and personal data stays encrypted end-to-end. Only you decide who can view it." 
            },
            { 
              icon: Zap, 
              title: "Fast & Affordable", 
              desc: "Sui’s high-throughput makes transactions nearly instant with near-zero costs. Perfect for health updates." 
            },
            { 
              icon: ShieldCheck, 
              title: "Immutable Records", 
              desc: "No misplaced files. No lost hospital cards. All records are securely anchored on-chain." 
            },
            { 
              icon: Box, 
              title: "Sui Object Model", 
              desc: "Policies, devices, and records become unique Sui objects — easy to manage, update, and track." 
            },
            { 
              icon: Key, 
              title: "Zero-Friction zkLogin", 
              desc: "Sign in with Google, Facebook, or Apple — without owning crypto first." 
            },
            { 
              icon: Users, 
              title: "Built for Real People", 
              desc: "Simple UI. Clear plans. Easy protection for students, workers, businesses, and families." 
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

      {/* Protection Suite */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">The SuiCare Protection Suite</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">1. Digital Health Records</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>Create private health profiles</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>Store hospital visits & lab tests</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>Track prescriptions</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>Drug QR verification to detect fakes</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">2. Device Insurance</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>Protect phones, laptops, bikes</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>Register via IMEI/Serial Number</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>Instant policy issuance</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>File theft/damage claims online</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <div className="w-14 h-14 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mb-6">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">3. Health & Micro-Insurance</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>Medical & Accident coverage</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>Student & Family bundles</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>Automatic on-chain receipts</li>
              </ul>
            </div>

            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700">
              <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6">
                <FileCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">4. Claims Center</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>Submit claims digitally</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>Upload images & reports</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>Real-time claim verification</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>Auto-validated payouts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works & Who is it for */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">How It Works</h2>
            <div className="space-y-8">
              {[
                { step: "1", title: "Connect Wallet / zkLogin", desc: "Secure identity via Sui wallet or Google login." },
                { step: "2", title: "Create Your SuiCare Vault", desc: "Your encrypted health & insurance hub." },
                { step: "3", title: "Buy Policy or Add Record", desc: "Everything is timestamped and verifiable." },
                { step: "4", title: "Manage, Share, Claim", desc: "Stay protected with decentralized transparency." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">{item.title}</h4>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
             <h2 className="text-3xl font-bold text-slate-900 mb-8">Who is SuiCare For?</h2>
             <div className="bg-slate-50 p-8 rounded-3xl space-y-4">
               {[
                 "Students needing affordable health & device insurance",
                 "Remote workers & developers with expensive laptops",
                 "Hospitals & clinics needing reliable record management",
                 "Families wanting simple health coverage",
                 "Logistics & delivery riders needing goods/bike protection"
               ].map((item, idx) => (
                 <div key={idx} className="flex items-start gap-3">
                   <CheckCircle2 className="text-primary mt-1" size={20} />
                   <p className="text-slate-700 font-medium">{item}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary to-blue-600 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to protect your life, health, and devices?</h2>
            <p className="text-xl opacity-90 mb-10">Join users choosing blockchain-powered safety.</p>
            <button 
              onClick={onLogin}
              className="bg-white text-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl"
            >
              Create Your SuiCare Account
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
          <p className="text-slate-500 font-medium">SuiCare — Protecting people and property, with the power of Sui.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
