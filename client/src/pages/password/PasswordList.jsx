import React, { useState } from 'react';
import { Eye, EyeOff, Edit2, Trash2, Save } from 'lucide-react';
import { usePasswordStore } from '../../store/passwordStore';

const PasswordList = () => {
  const { passwords, updatePassword, deletePassword } = usePasswordStore();
  const [showPassword, setShowPassword] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = async (id) => {
    if (editingId === id) {
      try {
        await updatePassword(id, editForm);
        setEditingId(null);
        window.location.reload();
      } catch (error) {
        console.error('Error updating password:', error);
      }
    } else {
      const password = passwords.find(p => p.id === id);
      setEditForm(password);
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      try {
        await deletePassword(id);
      } catch (error) {
        console.error('Error deleting password:', error);
      }
    }
  };

  return (
    <div className="grid gap-4">
      {passwords.map(password => (
        <div key={password.id} className="p-4 border rounded-lg">
          {editingId === password.id ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={editForm.website}
                onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                className="p-2 border rounded"
              />
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                className="p-2 border rounded"
              />
              <div className="relative">
                <input
                  type={showPassword[password.id] ? 'text' : 'password'}
                  value={editForm.password}
                  onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                  className="p-2 border rounded w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({...showPassword, [password.id]: !showPassword[password.id]})}
                  className="absolute right-2 top-2.5 text-gray-500"
                >
                  {showPassword[password.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <input
                type="text"
                value={editForm.notes}
                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                className="p-2 border rounded"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold">{password.website}</div>
                <div className="text-gray-600">{password.username}</div>
              </div>
              <div className="relative">
                <input
                  type={showPassword[password.id] ? 'text' : 'password'}
                  value={password.password}
                  readOnly
                  className="p-2 border rounded w-full bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword({...showPassword, [password.id]: !showPassword[password.id]})}
                  className="absolute right-2 top-2.5 text-gray-500"
                >
                  {showPassword[password.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password.notes && (
                <div className="text-gray-600 col-span-2">{password.notes}</div>
              )}
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => handleEdit(password.id)}
              className="flex items-center gap-1 px-3 py-1 rounded bg-blue-500 text-white"
            >
              {editingId === password.id ? <Save size={16} /> : <Edit2 size={16} />}
              {editingId === password.id ? 'Save' : 'Edit'}
            </button>
            <button
              onClick={() => handleDelete(password.id)}
              className="flex items-center gap-1 px-3 py-1 rounded bg-red-500 text-white"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PasswordList;