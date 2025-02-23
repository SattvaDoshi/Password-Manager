import crypto from 'crypto';

// Encrypt Password
export const encryptPassword = (password, masterKey) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(masterKey, 'hex'), iv);
  
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    encryptedPassword: encrypted,
    authTag,
    iv: iv.toString('hex')
  };
};

// Decrypt Password
export const decryptPassword = (encryptedPassword, iv, authTag, masterKey) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(masterKey, 'hex'),
    Buffer.from(iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

// Encrypt Master Key
export const encryptMasterKey = (masterKey, password) => {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(masterKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return { encrypted, salt: salt.toString('hex'), iv: iv.toString('hex') };
};

// Decrypt Master Key
export const decryptMasterKey = (encryptedMasterKey, salt, iv, password) => {
  const key = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, 32, 'sha256');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));

  let decrypted = decipher.update(encryptedMasterKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
