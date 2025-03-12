import { Password } from '../models/password.model.js';
import { encryptPassword, decryptPassword } from '../utils/encryption.js';

// Add migration function at the top
const migrateExistingPasswords = async (req, res) => {
  try {
    const masterKey = req.masterKey;
    if (!masterKey) {
      throw new Error('Master key required for migration');
    }

    // Find all passwords without authTag
    const passwords = await Password.find({ 
      userId: req.user.id,
      authTag: { $exists: false }
    });

    // Update each password
    for (const pwd of passwords) {
      try {
        // Re-encrypt the password with new schema
        const { encryptedPassword, iv, authTag } = encryptPassword(pwd.encryptedPassword, masterKey);
        
        // Update the document
        await Password.updateOne(
          { _id: pwd._id },
          { 
            $set: { 
              encryptedPassword,
              iv,
              authTag
            }
          }
        );
      } catch (err) {
        throw err;
      }
    }

    return true;
  } catch (error) {
    throw error;
  }
};

export const createPassword = async (req, res) => {
  try {
    const { website, username, password, notes } = req.body;
    const masterKey = req.masterKey;

    if (!masterKey) {
      return res.status(401).json({ error: 'Master key not found. Please log in again.' });
    }

    const { encryptedPassword, iv, authTag } = encryptPassword(password, masterKey);

    const newPassword = new Password({
      userId: req.user.id,
      website,
      username,
      encryptedPassword,
      iv,
      authTag,
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
    const masterKey = req.masterKey;

    if (!masterKey) {
      return res.status(401).json({ error: 'Master key not found. Please log in again.' });
    }

    // Try to migrate any old passwords first
    try {
      await migrateExistingPasswords(req, res);
    } catch (migrationError) {
      // Continue anyway as some passwords might still work
    }

    const passwords = await Password.find({ userId: req.user.id });

    const decryptedPasswords = passwords.map(pwd => {
      // Add validation for required fields
      if (!pwd.encryptedPassword) {
        throw new Error(`Missing encryptedPassword for password id: ${pwd._id}`);
      }
      if (!pwd.iv) {
        throw new Error(`Missing iv for password id: ${pwd._id}`);
      }
      if (!pwd.authTag) {
        throw new Error(`Missing authTag for password id: ${pwd._id}`);
      }

      return {
        id: pwd._id,
        website: pwd.website,
        username: pwd.username,
        password: decryptPassword(pwd.encryptedPassword, pwd.iv, pwd.authTag, masterKey),
        notes: pwd.notes,
        createdAt: pwd.createdAt,
        lastUpdated: pwd.lastUpdated
      };
    });

    res.json(decryptedPasswords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { website, username, password, notes } = req.body;
    const masterKey = req.masterKey;

    if (!masterKey) {
      return res.status(401).json({ error: 'Master key not found. Please log in again.' });
    }

    const passwordEntry = await Password.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!passwordEntry) {
      return res.status(404).json({ error: 'Password not found' });
    }

    if (password) {
      const { encryptedPassword, iv, authTag } = encryptPassword(password, masterKey);
      passwordEntry.encryptedPassword = encryptedPassword;
      passwordEntry.iv = iv;
      passwordEntry.authTag = authTag;
    }

    passwordEntry.website = website ?? passwordEntry.website;
    passwordEntry.username = username ?? passwordEntry.username;
    passwordEntry.notes = notes ?? passwordEntry.notes;
    passwordEntry.lastUpdated = new Date();

    await passwordEntry.save();
    
    // Return the updated password entry
    res.json({
      id: passwordEntry._id,
      website: passwordEntry.website,
      username: passwordEntry.username,
      notes: passwordEntry.notes,
      createdAt: passwordEntry.createdAt,
      lastUpdated: passwordEntry.lastUpdated
    });
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