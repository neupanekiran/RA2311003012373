"use client";

import React, { useState, useEffect } from "react";
import { FiMail, FiUser, FiHash, FiKey, FiLock, FiBell, FiArrowRight, FiCheckCircle, FiPhone, FiGithub } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { authenticateService } from "../../services/auth";
import { registerService } from "../../services/register";
import { Log } from "../../logging_midd/logger";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    Log("frontend", "info", "login_ui", "Auth interface mounted and ready");
  }, []);

  const [formData, setFormData] = useState({
    email: "ramkrishna1@abc.edu",
    name: "ram krishna",
    mobileNo: "9898989898",
    rollNo: "aa2bb",
    accessCode: "QkbpxH",
    githubUsername: "git",
    clientID: "baf1a015-3340-4366-8fd3-0fdb00e37738",
    clientSecret: "ZGpMcVNkpBMGGfTQ",
  });
  
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState<{ access_token: string; token_type: string; expires_in: number } | null>(null);
  const [registerSuccessData, setRegisterSuccessData] = useState<{ clientID: string; clientSecret: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setTokenData(null);
    setRegisterSuccessData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTokenData(null);
    setRegisterSuccessData(null);
    
    Log("frontend", "info", "login_ui", `User submitted ${isLogin ? 'login' : 'registration'} form`);

    try {
      if (isLogin) {
        const data = await authenticateService({
          email: formData.email,
          name: formData.name,
          rollNo: formData.rollNo,
          accessCode: formData.accessCode,
          clientID: formData.clientID,
          clientSecret: formData.clientSecret,
        });
        setTokenData(data);
        localStorage.setItem("auth_token", JSON.stringify(data));
        Log("frontend", "info", "login_ui", "Login form completed successfully");
        
        setTimeout(() => {
          window.location.href = "/inbox";
        }, 1500);
      } else {
        const data = await registerService({
          email: formData.email,
          name: formData.name,
          mobileNo: formData.mobileNo,
          rollNo: formData.rollNo,
          accessCode: formData.accessCode,
          githubUsername: formData.githubUsername,
        });
        setRegisterSuccessData(data);
        setFormData(prev => ({
          ...prev,
          clientID: data.clientID || prev.clientID,
          clientSecret: data.clientSecret || prev.clientSecret
        }));
        Log("frontend", "info", "login_ui", "Registration completed successfully");
      }
    } catch (err) {
      setError(err as string || "An unexpected error occurred");
      Log("frontend", "error", "login_ui", `${isLogin ? 'Login' : 'Registration'} form encountered an error: ${err || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono text-white">
      <div className="w-full max-w-xl">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white text-black p-4 rounded-none mb-4 border-2 border-white">
            <FiBell className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold uppercase tracking-widest">
            {isLogin ? "SIGN IN" : "REGISTER"}
          </h2>
          <p className="text-gray-400 text-sm font-bold uppercase mt-2">
            {isLogin ? "SYSTEM ACCESS" : "NEW REGISTRATION"}
          </p>
        </div>

        <div className="bg-black border-2 border-white p-8 rounded-none">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black border-2 border-white rounded-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black border-2 border-white rounded-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest">Roll No</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                    <FiHash />
                  </div>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="w-full bg-black border-2 border-white rounded-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest">Access Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                    <FiKey />
                  </div>
                  <input
                    type="text"
                    name="accessCode"
                    value={formData.accessCode}
                    onChange={handleChange}
                    className="w-full bg-black border-2 border-white rounded-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest">Mobile No</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                        <FiPhone />
                      </div>
                      <input
                        type="text"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleChange}
                        className="w-full bg-black border-2 border-white rounded-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                        required={!isLogin}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest">GitHub Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                        <FiGithub />
                      </div>
                      <input
                        type="text"
                        name="githubUsername"
                        value={formData.githubUsername}
                        onChange={handleChange}
                        className="w-full bg-black border-2 border-white rounded-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {isLogin && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest">Client ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                      <FiLock />
                    </div>
                    <input
                      type="text"
                      aria-label="Client ID"
                      name="clientID"
                      value={formData.clientID}
                      onChange={handleChange}
                      className="w-full bg-black border-2 border-white rounded-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                      required={isLogin}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest">Client Secret</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white">
                      <FiLock />
                    </div>
                    <input
                      type="password"
                      name="clientSecret"
                      value={formData.clientSecret}
                      onChange={handleChange}
                      className="w-full bg-black border-2 border-white rounded-none py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 focus:border-blue-500"
                      required={isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-white text-black font-bold uppercase tracking-widest py-3 px-4 border-2 border-white hover:bg-black hover:text-white transition-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                "PROCESSING..."
              ) : (
                <>
                  {isLogin ? 'SIGN IN' : 'REGISTER'}
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t-2 border-white pt-6 text-center">
            <button 
              type="button" 
              onClick={toggleMode}
              className="text-white font-bold uppercase tracking-widest text-sm hover:underline focus:outline-none"
            >
              {isLogin ? "[ NEW? REGISTER HERE ]" : "[ HAVE ACCOUNT? SIGN IN ]"}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 border-2 border-red-500 text-red-500 text-sm font-bold uppercase flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          {tokenData && (
            <div className="mt-6 p-4 border-2 border-green-500 text-green-500">
              <div className="flex items-center gap-2 mb-4 font-bold uppercase">
                <FiCheckCircle className="w-5 h-5" />
                <span>AUTH SUCCESSFUL</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex border-b-2 border-green-500 border-opacity-50 pb-1">
                  <span className="w-20 font-bold">TYPE:</span>
                  <span>{tokenData.token_type}</span>
                </div>
                <div className="flex border-b-2 border-green-500 border-opacity-50 pb-1">
                  <span className="w-20 font-bold">EXPIRES:</span>
                  <span>{tokenData.expires_in}</span>
                </div>
                <div className="pt-2">
                  <span className="block font-bold mb-1">TOKEN:</span>
                  <div className="break-all">
                    {tokenData.access_token}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { window.location.href = '/inbox'; }}
                className="w-full mt-4 bg-green-500 text-black font-bold uppercase py-2 border-2 border-green-500 hover:bg-black hover:text-green-500"
              >
                PROCEED TO INBOX
              </button>
            </div>
          )}

          {registerSuccessData && (
            <div className="mt-6 p-4 border-2 border-blue-500 text-blue-500">
              <div className="flex items-center gap-2 mb-4 font-bold uppercase">
                <FiCheckCircle className="w-5 h-5" />
                <span>REGISTRATION SUCCESSFUL</span>
              </div>
              <p className="text-xs mb-4 uppercase">
                CREDENTIALS AUTO-FILLED. PROCEED TO SIGN IN.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex border-b-2 border-blue-500 border-opacity-50 pb-1">
                  <span className="w-24 font-bold">CLIENT ID:</span>
                  <span className="break-all">{registerSuccessData.clientID}</span>
                </div>
                <div className="flex pb-1">
                  <span className="w-24 font-bold">CLIENT SECRET:</span>
                  <span>[HIDDEN]</span>
                </div>
              </div>
              <button 
                onClick={() => setIsLogin(true)}
                className="w-full mt-4 bg-blue-500 text-black font-bold uppercase py-2 border-2 border-blue-500 hover:bg-black hover:text-blue-500"
              >
                PROCEED TO SIGN IN
              </button>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
