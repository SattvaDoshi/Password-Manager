import React, { useState } from 'react';
import { Plus, Lock } from 'lucide-react';
import { usePasswordStore } from '../../store/passwordStore';

const GlassCard = ({ children, className = '' }) => (
  <div className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const PasswordForm = ({ onClose, onSuccess }) => {
  const { addPassword, isLoading } = usePasswordStore();
  const [formData, setFormData] = useState({
    website: '',
    username: '',
    password: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPassword(formData);
      setFormData({ website: '', username: '', password: '', notes: '' });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding password:', error);
    }
  };

  return (
    <GlassCard className="mb-6">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="text-emerald-400" size={24} />
          <h2 className="text-xl font-semibold text-emerald-300">Add New Password</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Website"
            value={formData.website}
            onChange={(e) => setFormData({...formData, website: e.target.value})}
            className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            required
          />
          <input
            type="text"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>
        <div className="flex gap-2 mt-6">
          <button 
            type="submit" 
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all duration-200"
          >
            <Plus size={20} />
            Save Password
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </GlassCard>
  );
};

export default PasswordForm;