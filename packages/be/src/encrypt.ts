import fs from 'fs';
import jwt from 'jsonwebtoken';

let serverKey = fs.readFileSync('./build/keys/key.pem');
let serverCertificate = fs.readFileSync('./build/keys/cert.pem');

export function generateToken(
  userId: string | number,
  ttlSeconds: number,
  backdateSeconds: number = 0,
  epochSeconds?: number,
  extraClaims?: object
) {
  const ts = epochSeconds ?? Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      ...extraClaims,
      iat: ts - backdateSeconds,
      exp: ts + backdateSeconds + ttlSeconds,
      ['sub']: `user:${userId}`,
    },
    serverKey,
    { algorithm: 'RS512' }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, serverCertificate, {
    algorithms: ['RS256', 'RS384', 'RS512'],
  });
}

export const tlsCredentials = () => ({
  cert: serverCertificate,
  key: serverKey,
});
