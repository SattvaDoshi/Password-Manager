import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { usePasswordStore } from '../store/passwordStore';
import PasswordForm from './password/PasswordForm';
import PasswordList from './password/PasswordList';

const PasswordManager = () => {
  const { fetchPasswords, passwords } = usePasswordStore();
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  const filteredPasswords = passwords.filter(password =>
    password.website.toLowerCase().includes(search.toLowerCase()) ||
    password.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Password Manager</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add Password
        </button>
      </div>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search passwords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 pl-10 border rounded-lg"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      {showAddForm && (
        <PasswordForm onClose={() => setShowAddForm(false)} />
      )}

      <PasswordList passwords={filteredPasswords} />
    </div>
  );
};

export default PasswordManager;