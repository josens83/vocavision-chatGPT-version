// Phase 5-2: Input Validation & Sanitization
// OWASP validation and sanitization best practices

/**
 * Validation schemas for common inputs
 * Ready for Zod integration: npm install zod
 */

/**
 * Email validation
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email || email.length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Password validation (OWASP recommendations)
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long' };
  }

  // Check for at least one uppercase, one lowercase, one number
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  // Check for common weak passwords
  const weakPasswords = ['password', 'password123', '12345678', 'qwerty', 'abc123'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return { valid: false, error: 'Password is too weak' };
  }

  return { valid: true };
}

/**
 * Username validation
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.length === 0) {
    return { valid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { valid: false, error: 'Username must not exceed 20 characters' };
  }

  // Only allow alphanumeric and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
}

/**
 * URL validation
 */
export function validateURL(url: string): { valid: boolean; error?: string } {
  if (!url || url.length === 0) {
    return { valid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);

    // Only allow http and https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
      .replace(/javascript:/gi, '');
  }

  // Client-side: use DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove dangerous elements
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'link', 'style'];
  dangerousTags.forEach((tag) => {
    const elements = doc.querySelectorAll(tag);
    elements.forEach((el) => el.remove());
  });

  // Remove event handlers
  const allElements = doc.querySelectorAll('*');
  allElements.forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
      if (attr.value.toLowerCase().includes('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}

/**
 * Sanitize text (strip all HTML)
 */
export function sanitizeText(text: string): string {
  if (typeof window === 'undefined') {
    return text.replace(/<[^>]*>/g, '');
  }

  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/<[^>]*>/g, '');
}

/**
 * Validate and sanitize input
 */
export function validateAndSanitize(
  input: string,
  type: 'email' | 'password' | 'username' | 'url' | 'html' | 'text'
): { valid: boolean; sanitized: string; error?: string } {
  let validation: { valid: boolean; error?: string };

  switch (type) {
    case 'email':
      validation = validateEmail(input);
      return { ...validation, sanitized: input.toLowerCase().trim() };

    case 'password':
      validation = validatePassword(input);
      return { ...validation, sanitized: input };

    case 'username':
      validation = validateUsername(input);
      return { ...validation, sanitized: input.toLowerCase().trim() };

    case 'url':
      validation = validateURL(input);
      return { ...validation, sanitized: input.trim() };

    case 'html':
      return { valid: true, sanitized: sanitizeHTML(input) };

    case 'text':
      return { valid: true, sanitized: sanitizeText(input) };

    default:
      return { valid: false, sanitized: input, error: 'Unknown validation type' };
  }
}

/**
 * SQL Injection prevention (for query building)
 */
export function escapeSQLString(str: string): string {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0':
        return '\\0';
      case '\x08':
        return '\\b';
      case '\x09':
        return '\\t';
      case '\x1a':
        return '\\z';
      case '\n':
        return '\\n';
      case '\r':
        return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default:
        return char;
    }
  });
}

/**
 * Command Injection prevention
 */
export function escapeShellArg(arg: string): string {
  return arg.replace(/[;&|`$()]/g, '\\$&');
}

/**
 * Path Traversal prevention
 */
export function sanitizePath(path: string): string {
  // Remove ../ and ..\
  return path.replace(/\.\.[\/\\]/g, '');
}

/**
 * File upload validation
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number; // bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSize = 10 * 1024 * 1024, allowedTypes = [], allowedExtensions = [] } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  // Check MIME type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`,
    };
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `File extension .${ext} is not allowed`,
      };
    }
  }

  return { valid: true };
}

/**
 * Rate limit check (simplified)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

console.log('[Validation] Module loaded');
