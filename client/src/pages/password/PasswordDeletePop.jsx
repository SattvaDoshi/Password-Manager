import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const GlassCard = ({ children, className = '' }) => (
  <div className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const PasswordDeletePop = ({ onConfirm, onCancel, website }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="absolute inset-0 flex items-center justify-center">
        <GlassCard className="w-full max-w-md p-6 mx-4 transform -translate-y-1/2 top-1/2">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-400" size={24} />
            <h2 className="text-xl font-semibold text-emerald-300">Delete Password</h2>
          </div>
          
          <p className="text-emerald-200 mb-6">
            Are you sure you want to delete the password for <span className="font-semibold text-emerald-300">{website}</span>? 
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg transition-all duration-200"
            >
              <X size={16} />
              Delete
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default PasswordDeletePop;