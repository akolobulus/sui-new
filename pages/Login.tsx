// import React from 'react';
// import { User, Stethoscope, FlaskConical, Building2, Wallet, ArrowRight } from 'lucide-react';
// import { useCurrentAccount, useConnectWallet } from '@mysten/dapp-kit';
// import { UserRole } from '../types';

// interface LoginProps {
//   onRoleSelect: (role: UserRole) => void;
// }

// const Login: React.FC<LoginProps> = ({ onRoleSelect }) => {
//   const currentAccount = useCurrentAccount();
//   // Note: Actual connect button logic is usually handled by the dApp Kit UI component, 
//   // but we check state here.

//   const ROLES = [
//     {
//       id: UserRole.PATIENT,
//       title: "Patient",
//       desc: "Manage health records, book doctors, and earn rewards.",
//       icon: <User size={32} />,
//       color: "bg-blue-50 text-blue-600 border-blue-200"
//     },
//     {
//       id: UserRole.DOCTOR,
//       title: "Doctor",
//       desc: "Consult patients, issue verifiable records, and get paid.",
//       icon: <Stethoscope size={32} />,
//       color: "bg-green-50 text-green-600 border-green-200"
//     },
//     {
//       id: UserRole.PHARMACIST,
//       title: "Lab / Pharmacist",
//       desc: "Verify prescriptions and issue certified test results.",
//       icon: <FlaskConical size={32} />,
//       color: "bg-purple-50 text-purple-600 border-purple-200"
//     },
//     {
//       id: UserRole.INSURER,
//       title: "Insurer",
//       desc: "Process claims automatically with AI fraud detection.",
//       icon: <Building2 size={32} />,
//       color: "bg-orange-50 text-orange-600 border-orange-200"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
//       <div className="max-w-4xl w-full">
        
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to SuiCare</h1>
//           <p className="text-xl text-slate-500">The Decentralized Health Ecosystem</p>
//         </div>

//         {/* Step 1: Wallet Connection (Mock Visual if not connected) */}
//         {!currentAccount ? (
//           <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md mx-auto">
//             <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
//               <Wallet size={40} />
//             </div>
//             <h2 className="text-2xl font-bold text-slate-800 mb-4">Connect Wallet</h2>
//             <p className="text-slate-500 mb-8">
//               To access your secure health data, please connect your Sui Wallet or log in via zkLogin.
//             </p>
//             {/* The actual button is usually in your Sidebar/Header, but we can simulate the flow here or instruct user */}
//             <div className="p-4 bg-slate-100 rounded-xl text-sm font-medium text-slate-600">
//               Please use the "Connect Wallet" button in the top right (or Sidebar).
//             </div>
//           </div>
//         ) : (
//           /* Step 2: Role Selection */
//           <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
//             <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Select Your Portal</h2>
            
//             <div className="grid md:grid-cols-2 gap-6">
//               {ROLES.map((role) => (
//                 <button
//                   key={role.id}
//                   onClick={() => onRoleSelect(role.id)}
//                   className="group relative bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 text-left flex items-start gap-6 hover:border-blue-500/30"
//                 >
//                   <div className={`p-4 rounded-xl border ${role.color} group-hover:scale-110 transition-transform`}>
//                     {role.icon}
//                   </div>
//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
//                       {role.title}
//                     </h3>
//                     <p className="text-slate-500 leading-relaxed">
//                       {role.desc}
//                     </p>
//                   </div>
//                   <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
//                     <ArrowRight />
//                   </div>
//                 </button>
//               ))}
//             </div>
            
//             <p className="text-center text-slate-400 mt-8 text-sm">
//               Connected as: <span className="font-mono text-slate-600">{currentAccount.address}</span>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;








// // import React, { useState } from 'react';
// // import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
// // import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
// // import { jwtDecode } from "jwt-decode";
// // import { jwtToAddress } from '@mysten/sui/zklogin';
// // import { ConnectButton } from '@mysten/dapp-kit';

// // // Your Real Client ID
// // const GOOGLE_CLIENT_ID ="233217306953-g91t37q723vuugpjent6hf78tgadsnv3.apps.googleusercontent.com";//"233217306953-h2pdkknk8109tu8akqgulmj0ni8js2b8.apps.googleusercontent.com";

// // interface LoginProps {
// //   onLoginSuccess: (data: { address: string; email: string; name: string; picture: string }) => void;
// //   onBack: () => void;
// // }

// // const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [errorMsg, setErrorMsg] = useState('');

// //   const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
// //     setIsLoading(true);
// //     setErrorMsg('');
    
// //     try {
// //       if (!credentialResponse.credential) {
// //         throw new Error("No credential received from Google");
// //       }

// //       const jwtToken = credentialResponse.credential;
// //       const decoded: any = jwtDecode(jwtToken);
// //       const { sub, email, name, picture } = decoded;

// //       console.log("🔐 Google User:", { email, name });

// //       // Call Backend for Salt
// //       const saltResponse = await fetch(`http://localhost:8080/auth/salt?sub=${sub}`);
// //       if (!saltResponse.ok) throw new Error("Failed to fetch salt");
// //       const { salt } = await saltResponse.json();

// //       // Generate zkLogin Address
// //       const zkAddress = jwtToAddress(jwtToken, salt);
// //       console.log("✅ Sui Address:", zkAddress);

// //       onLoginSuccess({ 
// //         address: zkAddress, 
// //         email, 
// //         name, 
// //         picture 
// //       }); 

// //     } catch (err) {
// //       console.error("Login Failed:", err);
// //       setErrorMsg("Authentication failed. Please try again.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
// //       <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
// //         <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
          
// //           {isLoading && (
// //             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-primary">
// //               <Loader2 className="animate-spin mb-2" size={40} />
// //               <p className="font-semibold animate-pulse">Verifying Credentials...</p>
// //             </div>
// //           )}

// //           <div className="p-8 text-center">
// //             <button 
// //               onClick={onBack}
// //               className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors"
// //             >
// //               <ArrowLeft size={20} />
// //             </button>
            
// //             <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
// //                <ShieldCheck size={32} />
// //             </div>

// //             <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to SuiCare</h1>
// //             <p className="text-slate-500 mb-8">
// //               Login securely to access your health vault and insurance policies.
// //             </p>

// //             {errorMsg && (
// //               <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6">
// //                 {errorMsg}
// //               </div>
// //             )}

// //             <div className="space-y-6">
// //               {/* 1. Google Login */}
// //               <div className="flex justify-center">
// //                  <GoogleLogin
// //                     onSuccess={handleGoogleSuccess}
// //                     onError={() => setErrorMsg("Google Login Failed")}
// //                     type="standard"
// //                     theme="outline"
// //                     size="large"
// //                     shape="pill"
// //                     width="300"
// //                  />
// //               </div>

// //               <div className="relative py-2">
// //                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
// //                 <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or connect wallet</span></div>
// //               </div>

// //               {/* 2. Sui Wallet Button (Provided by dApp Kit) */}
// //               <div className="flex justify-center wallet-button-container">
// //                 <ConnectButton className="w-full !bg-slate-900 !text-white !rounded-full !py-3 !font-semibold hover:!bg-slate-800 transition-colors" />
// //               </div>
// //             </div>

// //             <p className="text-xs text-slate-400 mt-8">
// //               By connecting, you agree to our Terms of Service.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </GoogleOAuthProvider>
// //   );
// // };

// // export default Login;
import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, Loader2, User, Stethoscope, FlaskConical, Building2, ArrowRight } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { jwtToAddress } from '@mysten/sui/zklogin';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { UserRole } from '../types';

// Your Real Client ID
const GOOGLE_CLIENT_ID = "233217306953-g91t37q723vuugpjent6hf78tgadsnv3.apps.googleusercontent.com";

interface LoginProps {
  onLoginSuccess?: (data: { address: string; email: string; name: string; picture: string }) => void;
  onRoleSelect?: (role: UserRole) => void;
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onRoleSelect, onBack }) => {
  const currentAccount = useCurrentAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Track Google Login State locally if wallet isn't used
  const [googleUser, setGoogleUser] = useState<{ address: string } | null>(null);

  // Check if user is authenticated (Wallet OR Google)
  const isAuthenticated = !!currentAccount || !!googleUser;

  // --- GOOGLE LOGIN HANDLER ---
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      if (!credentialResponse.credential) throw new Error("No credential received");

      const jwtToken = credentialResponse.credential;
      const decoded: any = jwtDecode(jwtToken);
      const { sub, email, name, picture } = decoded;

      // Mock Salt fetch (In prod, fetch from your backend)
      // const salt = await fetchSalt(sub); 
      const salt = "MOCK_SALT"; // Placeholder

      const zkAddress = jwtToAddress(jwtToken, salt);
      console.log("✅ Verified:", zkAddress);

      const userData = { address: zkAddress, email, name, picture };
      setGoogleUser(userData);
      
      // Notify Parent App (App.tsx)
      if (onLoginSuccess) onLoginSuccess(userData);

    } catch (err) {
      console.error("Login Failed:", err);
      setErrorMsg("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- ROLE DEFINITIONS ---
  const ROLES = [
    {
      id: UserRole.PATIENT,
      title: "Patient",
      desc: "Manage health records, book doctors, and earn rewards.",
      icon: <User size={32} />,
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      id: UserRole.DOCTOR,
      title: "Doctor",
      desc: "Consult patients, issue verifiable records, and get paid.",
      icon: <Stethoscope size={32} />,
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      id: UserRole.PHARMACIST,
      title: "Lab / Pharmacist",
      desc: "Verify prescriptions and issue certified test results.",
      icon: <FlaskConical size={32} />,
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      id: UserRole.INSURER,
      title: "Insurer",
      desc: "Process claims automatically with AI fraud detection.",
      icon: <Building2 size={32} />,
      color: "bg-orange-50 text-orange-600 border-orange-200"
    }
  ];

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        
        {/* CONTAINER */}
        <div className={`w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative transition-all duration-500 ${isAuthenticated ? 'max-w-4xl p-8' : 'max-w-md'}`}>
          
          {/* Back Button (Only if not logged in) */}
          {!isAuthenticated && onBack && (
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors z-10"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-primary">
              <Loader2 className="animate-spin mb-2" size={40} />
              <p className="font-semibold animate-pulse">Verifying Credentials...</p>
            </div>
          )}

          {/* --- VIEW 1: LOGIN OPTIONS (Not Authenticated) --- */}
          {!isAuthenticated ? (
            <div className="p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <ShieldCheck size={32} />
              </div>

              <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to SuiCare</h1>
              <p className="text-slate-500 mb-8">
                Login securely to access your health vault and insurance policies.
              </p>

              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6">{errorMsg}</div>
              )}

              <div className="space-y-6">
                {/* Google Login */}
                <div className="flex justify-center">
                   <GoogleLogin
                     onSuccess={handleGoogleSuccess}
                     onError={() => setErrorMsg("Google Login Failed")}
                     type="standard"
                     theme="outline"
                     size="large"
                     shape="pill"
                     width="300"
                   />
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-medium">Or connect wallet</span></div>
                </div>

                {/* Sui Wallet Button */}
                <div className="flex justify-center wallet-button-container">
                  <ConnectButton className="w-full !bg-slate-900 !text-white !rounded-full !py-3 !font-semibold hover:!bg-slate-800 transition-colors" />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-8">By connecting, you agree to our Terms of Service.</p>
            </div>
          ) : (
            /* --- VIEW 2: ROLE SELECTION (Authenticated) --- */
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Select Your Portal</h2>
                <p className="text-slate-500">
                  Connected as: <span className="font-mono text-primary bg-primary/5 px-2 py-1 rounded">
                    {currentAccount?.address || googleUser?.address}
                  </span>
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => onRoleSelect && onRoleSelect(role.id)}
                    className="group relative bg-slate-50 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:bg-white transition-all border border-transparent hover:border-blue-100 text-left flex items-start gap-6"
                  >
                    <div className={`p-4 rounded-xl border bg-white ${role.color} group-hover:scale-110 transition-transform shadow-sm`}>
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {role.desc}
                      </p>
                    </div>
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 translate-x-2 group-hover:translate-x-0">
                      <ArrowRight />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;