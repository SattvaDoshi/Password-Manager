import React, { useState, useEffect } from 'react';
import { Search, Plus, Shield } from 'lucide-react';
import { usePasswordStore } from '../store/passwordStore';
import PasswordForm from './password/PasswordForm';
import PasswordList from './password/PasswordList';

const GlassCard = ({ children, className = '' }) => (
  <div className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const PasswordManager = () => {
  const { 
    fetchPasswords, 
    passwords, 
    isLoading, 
    error,
    message,
    searchTerm,
    setSearchTerm,
    clearError,
    clearMessage 
  } = usePasswordStore();
  const [showAddForm, setShowAddForm] = useState(false);

  // Only fetch passwords once when component mounts
  useEffect(() => {
    fetchPasswords();
  }, []); // Empty dependency array

  useEffect(() => {
    if (message) {
      const timer = setTimeout(clearMessage, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error, clearMessage, clearError]);

  const handleFormSuccess = () => {
    setShowAddForm(false);
  };

  const filteredPasswords = passwords.filter(password => {
    if (!password) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const websiteMatch = password.website?.toLowerCase().includes(searchLower);
    const usernameMatch = password.username?.toLowerCase().includes(searchLower);
    
    return websiteMatch || usernameMatch;
  });

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-green-900 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <GlassCard key="main-container" className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Shield className="text-emerald-400" size={32} />
              <h1 className="text-3xl font-bold text-emerald-300">Password Vault</h1>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
            >
              <Plus size={20} />
              Add Password
            </button>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search passwords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
            <Search className="absolute left-3 top-3 text-emerald-400" size={20} />
          </div>

          {showAddForm && (
            <PasswordForm 
              onClose={() => setShowAddForm(false)} 
              onSuccess={handleFormSuccess}
            />
          )}

          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            </div>
          ) : (
            <PasswordList passwords={filteredPasswords} />
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default PasswordManager;