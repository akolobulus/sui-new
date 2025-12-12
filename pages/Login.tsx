import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { jwtToAddress } from '@mysten/sui/zklogin';
import { ConnectButton } from '@mysten/dapp-kit';

// Your Real Client ID
const GOOGLE_CLIENT_ID ="233217306953-g91t37q723vuugpjent6hf78tgadsnv3.apps.googleusercontent.com";//"233217306953-h2pdkknk8109tu8akqgulmj0ni8js2b8.apps.googleusercontent.com";

interface LoginProps {
  onLoginSuccess: (data: { address: string; email: string; name: string; picture: string }) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      const jwtToken = credentialResponse.credential;
      const decoded: any = jwtDecode(jwtToken);
      const { sub, email, name, picture } = decoded;

      console.log("🔐 Google User:", { email, name });

      // Call Backend for Salt
      const saltResponse = await fetch(`http://localhost:8080/auth/salt?sub=${sub}`);
      if (!saltResponse.ok) throw new Error("Failed to fetch salt");
      const { salt } = await saltResponse.json();

      // Generate zkLogin Address
      const zkAddress = jwtToAddress(jwtToken, salt);
      console.log("✅ Sui Address:", zkAddress);

      onLoginSuccess({ 
        address: zkAddress, 
        email, 
        name, 
        picture 
      }); 

    } catch (err) {
      console.error("Login Failed:", err);
      setErrorMsg("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
          
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-primary">
              <Loader2 className="animate-spin mb-2" size={40} />
              <p className="font-semibold animate-pulse">Verifying Credentials...</p>
            </div>
          )}

          <div className="p-8 text-center">
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
               <ShieldCheck size={32} />
            </div>

            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to SuiCare</h1>
            <p className="text-slate-500 mb-8">
              Login securely to access your health vault and insurance policies.
            </p>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6">
                {errorMsg}
              </div>
            )}

            <div className="space-y-6">
              {/* 1. Google Login */}
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

              {/* 2. Sui Wallet Button (Provided by dApp Kit) */}
              <div className="flex justify-center wallet-button-container">
                <ConnectButton className="w-full !bg-slate-900 !text-white !rounded-full !py-3 !font-semibold hover:!bg-slate-800 transition-colors" />
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-8">
              By connecting, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;