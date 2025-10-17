const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const keysDir = path.join(__dirname, '../../keys');

// Ensure keys directory exists
if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

const privateKeyPath = path.join(keysDir, 'private.pem');
const publicKeyPath = path.join(keysDir, 'public.pem');

// Generate RSA keypair if not exists
function generateKeyPair() {
  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    console.log('Generating RSA keypair...');
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
    console.log('RSA keypair generated');
  }
}

generateKeyPair();

// Hash email using SHA-384
function hashEmail(email) {
  return crypto.createHash('sha384').update(email).digest('hex');
}

// Sign hash with private key
function signHash(hash) {
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const sign = crypto.createSign('SHA256');
  sign.update(hash);
  sign.end();
  return sign.sign(privateKey, 'hex');
}

// Verify signature (for testing)
function verifySignature(hash, signature) {
  const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
  const verify = crypto.createVerify('SHA256');
  verify.update(hash);
  verify.end();
  return verify.verify(publicKey, signature, 'hex');
}

// Get public key for frontend
function getPublicKey() {
  return fs.readFileSync(publicKeyPath, 'utf8');
}

module.exports = {
  hashEmail,
  signHash,
  verifySignature,
  getPublicKey
};