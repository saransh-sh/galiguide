import jwt from 'jsonwebtoken';
import { Role } from '../types/enums';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
}

const JWT_SECRET = process.env.JWT_SECRET || 'GaliGuideIndoreSuperSecretKey2026!';
const JWT_EXPIRES_IN = '24h';

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    subject: payload.id,
  });
}

export function verifyAdminToken(token: string): AdminPayload {
  return jwt.verify(token, JWT_SECRET) as AdminPayload;
}
