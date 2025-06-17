/**
 * Custom API Error Classes
 */

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code || 'INTERNAL_ERROR';
    this.details = details;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends ApiError {
  constructor(service: string, message?: string) {
    super(message || `${service} service unavailable`, 503, 'EXTERNAL_SERVICE_ERROR');
    this.name = 'ExternalServiceError';
  }
}

/**
 * Error Handler Middleware
 */
export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return Response.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
      },
      { status: error.statusCode }
    );
  }

  // Handle specific known errors
  if (error instanceof Error) {
    // Firebase errors
    if (error.message.includes('permission-denied')) {
      return Response.json(
        {
          success: false,
          error: 'Permission denied',
          code: 'PERMISSION_DENIED',
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // OpenAI errors
    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      return Response.json(
        {
          success: false,
          error: 'AI service temporarily unavailable. Please try again later.',
          code: 'AI_SERVICE_UNAVAILABLE',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // Network errors
    if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      return Response.json(
        {
          success: false,
          error: 'Service temporarily unavailable',
          code: 'SERVICE_UNAVAILABLE',
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  }

  // Generic error response
  return Response.json(
    {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}

/**
 * Async error wrapper for API routes
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Validation helpers
 */
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  uuid: (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  },

  objectId: (id: string): boolean => {
    return typeof id === 'string' && id.length > 0;
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  industry: (industry: string): boolean => {
    const validIndustries = ['B2B', 'B2C', 'SaaS', 'E-commerce', 'FinTech', 'HealthTech', 'EdTech', 'Other'];
    return validIndustries.includes(industry);
  },

  slideType: (type: string): boolean => {
    const validTypes = ['title', 'problem', 'solution', 'market', 'business-model', 'go-to-market', 'competitive-advantage', 'team', 'financials', 'ask'];
    return validTypes.includes(type);
  },

  status: (status: string): boolean => {
    const validStatuses = ['draft', 'completed', 'shared'];
    return validStatuses.includes(status);
  },

  subscription: (subscription: string): boolean => {
    const validSubscriptions = ['free', 'pro', 'startup'];
    return validSubscriptions.includes(subscription);
  },

  minLength: (str: string, min: number): boolean => {
    return typeof str === 'string' && str.trim().length >= min;
  },

  maxLength: (str: string, max: number): boolean => {
    return typeof str === 'string' && str.length <= max;
  },

  isPositiveNumber: (num: any): boolean => {
    return typeof num === 'number' && num > 0;
  },

  isArray: (arr: any): boolean => {
    return Array.isArray(arr);
  },

  isObject: (obj: any): boolean => {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
  },
};

/**
 * Common validation schemas
 */
export const validationSchemas = {
  startupIdea: {
    required: ['startupName', 'problemStatement', 'targetAudience', 'solution', 'monetizationPlan', 'competitors', 'industry'],
    optional: ['marketSize', 'teamOverview'],
    validators: {
      startupName: (name: string) => validators.minLength(name, 1) && validators.maxLength(name, 100),
      problemStatement: (statement: string) => validators.minLength(statement, 10) && validators.maxLength(statement, 2000),
      targetAudience: (audience: string) => validators.minLength(audience, 5) && validators.maxLength(audience, 1000),
      solution: (solution: string) => validators.minLength(solution, 10) && validators.maxLength(solution, 2000),
      monetizationPlan: (plan: string) => validators.minLength(plan, 10) && validators.maxLength(plan, 1000),
      competitors: (competitors: string) => validators.minLength(competitors, 5) && validators.maxLength(competitors, 1000),
      industry: validators.industry,
      marketSize: (size: string) => !size || validators.maxLength(size, 1000),
      teamOverview: (team: string) => !team || validators.maxLength(team, 1000),
    },
  },

  pitchDeck: {
    required: ['title', 'slides'],
    optional: ['investorPersona', 'status', 'shareableLink'],
    validators: {
      title: (title: string) => validators.minLength(title, 1) && validators.maxLength(title, 200),
      slides: (slides: any[]) => validators.isArray(slides) && slides.length > 0,
      status: validators.status,
      shareableLink: (link: string) => !link || validators.url(link),
    },
  },

  user: {
    required: ['email', 'displayName'],
    optional: ['subscription', 'pitchCount'],
    validators: {
      email: validators.email,
      displayName: (name: string) => validators.minLength(name, 1) && validators.maxLength(name, 100),
      subscription: validators.subscription,
      pitchCount: validators.isPositiveNumber,
    },
  },
};
