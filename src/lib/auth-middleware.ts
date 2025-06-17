import { NextRequest } from 'next/server';
import { auth } from './firebase';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.warn('Firebase Admin initialization failed:', error);
  }
}

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    uid: string;
    email?: string;
    emailVerified: boolean;
  };
}

/**
 * Middleware to authenticate Firebase ID tokens
 */
export async function authenticateRequest(request: NextRequest): Promise<{
  success: boolean;
  user?: { uid: string; email?: string; emailVerified: boolean };
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        success: false,
        error: 'Missing or invalid authorization header',
      };
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return {
        success: false,
        error: 'Missing ID token',
      };
    }

    // Verify the ID token using Firebase Admin SDK
    const adminAuth = getAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Invalid or expired token',
    };
  }
}

/**
 * Alternative authentication using URL parameters (for sharing links)
 */
export async function authenticateFromParams(request: NextRequest): Promise<{
  success: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    if (!userId || !token) {
      return {
        success: false,
        error: 'Missing userId or token parameters',
      };
    }

    // In a production app, you'd verify the token against a database
    // For now, we'll do basic validation
    if (token.length < 32) {
      return {
        success: false,
        error: 'Invalid token format',
      };
    }

    return {
      success: true,
      userId,
    };
  } catch (error) {
    console.error('Parameter authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Check if user has permission to access a resource
 */
export async function checkResourcePermission(
  userId: string,
  resourceUserId: string,
  resourceType: 'pitch' | 'idea' | 'summary'
): Promise<boolean> {
  // Owner always has permission
  if (userId === resourceUserId) {
    return true;
  }

  // TODO: Implement sharing permissions
  // Check if resource is shared with the user
  // This would involve checking a sharing table in the database

  return false;
}

/**
 * Rate limiting helper
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60 * 60 * 1000 // 1 hour
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Clean up old entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }

  const current = rateLimitMap.get(identifier);
  
  if (!current || current.resetTime < windowStart) {
    // First request in window or window expired
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: current.resetTime };
  }

  current.count++;
  rateLimitMap.set(identifier, current);
  
  return { 
    allowed: true, 
    remaining: maxRequests - current.count, 
    resetTime: current.resetTime 
  };
}

/**
 * Validate request body against schema
 */
export function validateRequestBody<T>(
  body: any,
  requiredFields: (keyof T)[],
  optionalFields: (keyof T)[] = []
): { valid: boolean; errors: string[]; data?: Partial<T> } {
  const errors: string[] = [];
  const data: Partial<T> = {};

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a valid JSON object'] };
  }

  // Check required fields
  for (const field of requiredFields) {
    if (!(field in body) || body[field] === undefined || body[field] === null) {
      errors.push(`Missing required field: ${String(field)}`);
    } else {
      data[field] = body[field];
    }
  }

  // Include optional fields if present
  for (const field of optionalFields) {
    if (field in body && body[field] !== undefined && body[field] !== null) {
      data[field] = body[field];
    }
  }

  return { valid: errors.length === 0, errors, data };
}

/**
 * Standard API response helper
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  status: number = 200
) {
  return Response.json(
    {
      success,
      data: success ? data : undefined,
      error: success ? undefined : error,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
