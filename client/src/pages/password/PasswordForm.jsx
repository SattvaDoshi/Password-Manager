import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePasswordStore } from '../../store/passwordStore';

const PasswordForm = ({ onClose }) => {
  const addPassword = usePasswordStore(state => state.addPassword);
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
      onClose();
    } catch (error) {
      console.error('Error adding password:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add New Password</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Website"
          value={formData.website}
          onChange={(e) => setFormData({...formData, website: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          className="p-2 border rounded"
        />
      </div>
      <button type="submit" className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        <Plus className="inline-block mr-2" size={20} />
        Save Password
      </button>
    </form>
  );
};

export default PasswordForm;