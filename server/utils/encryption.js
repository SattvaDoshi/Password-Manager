import crypto from 'crypto';

export const encryptPassword = (password, masterKey) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(masterKey, 'hex'), iv);
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encryptedPassword: encrypted + authTag.toString('hex'),
    iv: iv.toString('hex')
  };
};

export const decryptPassword = (encryptedPassword, iv, masterKey) => {
  const authTag = Buffer.from(encryptedPassword.slice(-32), 'hex');
  const encryptedData = encryptedPassword.slice(0, -32);
  
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(masterKey, 'hex'),
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

export const encryptMasterKey = (masterKey, password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(masterKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encrypted, salt };
};

// Helper function to decrypt master key
export const decryptMasterKey = (encryptedMasterKey, salt, password) => {
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedMasterKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};