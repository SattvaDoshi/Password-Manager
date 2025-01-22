import { Password } from '../models/password.model.js';
import { encryptPassword, decryptPassword } from '../utils/encryption.js';

export const createPassword = async (req, res) => {
  try {
    const { website, username, password, notes } = req.body;
    const { masterKey } = req.user;

    const { encryptedPassword, iv } = encryptPassword(password, masterKey);

    const newPassword = new Password({
      userId: req.user.id,
      website,
      username,
      encryptedPassword,
      iv,
      notes
    });

    await newPassword.save();
    res.status(201).json({ message: 'Password saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllPasswords = async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.user.id });
    
    const decryptedPasswords = passwords.map(pwd => ({
      id: pwd._id,
      website: pwd.website,
      username: pwd.username,
      password: decryptPassword(pwd.encryptedPassword, pwd.iv, req.user.masterKey),
      notes: pwd.notes,
      createdAt: pwd.createdAt,
      lastUpdated: pwd.lastUpdated
    }));

    res.json(decryptedPasswords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { website, username, password, notes } = req.body;
    const { masterKey } = req.user;

    const passwordEntry = await Password.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!passwordEntry) {
      return res.status(404).json({ error: 'Password not found' });
    }

    if (password) {
      const { encryptedPassword, iv } = encryptPassword(password, masterKey);
      passwordEntry.encryptedPassword = encryptedPassword;
      passwordEntry.iv = iv;
    }

    passwordEntry.website = website ?? passwordEntry.website;
    passwordEntry.username = username ?? passwordEntry.username;
    passwordEntry.notes = notes ?? passwordEntry.notes;
    passwordEntry.lastUpdated = new Date();

    await passwordEntry.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePassword = async (req, res) => {
  try {
    const result = await Password.deleteOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Password not found' });
    }

    res.json({ message: 'Password deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};