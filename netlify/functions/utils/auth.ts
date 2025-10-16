import { Handler, HandlerEvent } from '@netlify/functions';
import jwt from 'jsonwebtoken';

// For now, use a simple JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'fitness-tracker-secret-key';
const JWT_EXPIRY = '7d';

export interface AuthToken {
  userId: number;
  email: string;
}

export function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(event: HandlerEvent): string | null {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
}

export function requireAuth(event: HandlerEvent): AuthToken {
  const token = getTokenFromRequest(event);
  if (!token) {
    throw new Error('No authentication token provided');
  }

  const auth = verifyToken(token);
  if (!auth) {
    throw new Error('Invalid or expired token');
  }

  return auth;
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };
}

export function successResponse(data: any, statusCode = 200) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
    body: JSON.stringify(data),
  };
}

export function errorResponse(message: string, statusCode = 400) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
    },
    body: JSON.stringify({ error: message }),
  };
}
