const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.CRYPTO_SECRET || 'fallback_secret_key_123';

/**
 * Encrypt a string or object
 * @param {any} data - Data to encrypt
 * @returns {string} Encrypted string
 */
exports.encryptData = (data) => {
  const stringData = typeof data === 'object' ? JSON.stringify(data) : String(data);
  return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
};

/**
 * Decrypt a string back to original form
 * @param {string} cipherText - Encrypted string
 * @returns {string} Decrypted string (can be parsed to JSON if it was an object)
 */
exports.decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
