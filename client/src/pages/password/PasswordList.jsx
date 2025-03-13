import React, { useState } from 'react';
import { Globe, User2, FileText, Key, Clock, Copy, Check, Eye, EyeOff, Edit2, Trash2, Save } from 'lucide-react';
import { usePasswordStore } from '../../store/passwordStore';
import PasswordDeletePop from './PasswordDeletePop';

const GlassCard = ({ children, className = '' }) => (
  <div className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

const PasswordList = ({passwords}) => {
  const { updatePassword, deletePassword } = usePasswordStore();
  const [showPassword, setShowPassword] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleCopyPassword = async (password, id) => {
    await navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEdit = async (id) => {
    if (editingId === id) {
      try {
        if (!id) {
          console.error('No password ID provided for update');
          return;
        }
        await updatePassword(id, editForm);
        setEditingId(null);
        setEditForm({});
      } catch (error) {
        console.error('Error updating password:', error);
      }
    } else {
      const password = passwords.find(p => p.id === id);
      if (password) {
        setEditForm({
          ...password,
          id: password.id
        });
        setEditingId(id);
      }
    }
  };

  const handleDelete = async (id, website) => {
    setDeleteId({ id, website });
  };

  const confirmDelete = async () => {
    try {
      await deletePassword(deleteId.id);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  if (passwords.length === 0) {
    return (
      <div className="text-center py-8 text-emerald-400/70">
        No passwords found. Add your first password to get started!
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {passwords.map(password => (
          <GlassCard key={`password-${password.id}`} className="p-6 transition-all duration-300 hover:bg-white/15">
            {editingId === password.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editForm.website}
                  onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                  className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
                <div className="relative">
                  <input
                    type={showPassword[password.id] ? 'text' : 'password'}
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white w-full focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, [password.id]: !showPassword[password.id] })}
                    className="absolute right-2 top-2.5 text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                  >
                    {showPassword[password.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <input
                  type="text"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Website & Username Section */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-300 text-lg">{password.website}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-200">
                  <User2 className="w-4 h-4" />
                  <span>{password.username}</span>
                </div>
                {password.notes && (
                  <div className="flex items-start gap-2 mt-2">
                    <FileText className="w-4 h-4 text-emerald-400/70 mt-1" />
                    <p className="text-emerald-400/70 text-sm">{password.notes}</p>
                  </div>
                )}
              </div>
            
              {/* Password Input Section */}
              <div className="flex flex-col space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="w-4 h-4 text-emerald-400/70" />
                  </div>
                  <input
                    type={showPassword[password.id] ? "text" : "password"}
                    value={password.password}
                    readOnly
                    className="p-2 pl-10 pr-24 rounded-lg bg-emerald-950/50 border border-emerald-600/30 text-white w-full
                               focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                    {/* Copy Password Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyPassword(password.password, password.id)}
                      className="p-1.5 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 
                                 transition-all duration-200 relative group"
                      aria-label="Copy password"
                    >
                      {copiedId === password.id ? (
                        <div className="flex items-center gap-1">
                          <Check size={16} />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                           bg-emerald-900 text-emerald-300 text-xs py-1 px-2 rounded 
                                           opacity-100 transition-opacity duration-200">
                            Copied!
                          </span>
                        </div>
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
            
                    {/* Show/Hide Password Button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, [password.id]: !showPassword[password.id] })}
                      className="p-1.5 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 
                                 transition-all duration-200"
                      aria-label={showPassword[password.id] ? "Hide password" : "Show password"}
                    >
                      {showPassword[password.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            

            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => handleEdit(password.id)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all duration-200"
              >
                {editingId === password.id ? <Save size={16} /> : <Edit2 size={16} />}
                {editingId === password.id ? 'Save' : 'Edit'}
              </button>
              <button
                onClick={() => handleDelete(password.id, password.website)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white transition-all duration-200"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {deleteId && (
        <PasswordDeletePop
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          website={deleteId.website}
        />
      )}
    </>
  );
};

export default PasswordList;