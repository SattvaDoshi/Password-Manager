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