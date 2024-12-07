import fs from 'fs';
import jwt, { JwtPayload } from 'jsonwebtoken';

let serverKey = fs.readFileSync('./dev.key.pem');
let serverCertificate = fs.readFileSync('./dev.cert.pem');

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

export function verifyToken(token: string): JwtPayload {
  const payload = jwt.verify(token, serverCertificate, {
    algorithms: ['RS256', 'RS384', 'RS512'],
  });
  if (typeof payload === 'string')
    throw new Error(`Invalid token payload: ${payload}`);
  return payload;
}

export const tlsCredentials = () => ({
  cert: serverCertificate,
  key: serverKey,
});
