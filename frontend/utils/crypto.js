// Browser-compatible crypto utilities using Web Crypto API

export async function verifySignature(hash, signature, publicKeyPem) {
  if (!publicKeyPem || !hash || !signature) return false;

  try {
    // Import the public key
    const publicKey = await importPublicKey(publicKeyPem);
    
    // Convert hash to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(hash);
    
    // Convert hex signature to ArrayBuffer
    const signatureBuffer = hexToArrayBuffer(signature);
    
    // Verify the signature
    const isValid = await crypto.subtle.verify(
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      publicKey,
      signatureBuffer,
      data
    );
    
    return isValid;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

async function importPublicKey(pemKey) {
  // Remove PEM header/footer and whitespace
  const pemContents = pemKey
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s/g, '');
  
  // Base64 decode
  const binaryDer = atob(pemContents);
  
  // Convert to ArrayBuffer
  const bytes = new Uint8Array(binaryDer.length);
  for (let i = 0; i < binaryDer.length; i++) {
    bytes[i] = binaryDer.charCodeAt(i);
  }
  
  // Import the key
  return await crypto.subtle.importKey(
    'spki',
    bytes.buffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    true,
    ['verify']
  );
}

function hexToArrayBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
}