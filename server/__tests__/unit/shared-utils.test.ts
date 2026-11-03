import {
  normalizeRequestId,
  maskPhoneNumber,
  redactDatabaseUrl,
  redactSensitiveData,
  isSensitiveKey,
} from '../../src/shared/utils';

describe('Shared Utilities Suite', () => {
  describe('normalizeRequestId', () => {
    it('preserves valid alphanumeric request IDs', () => {
      const valid = 'req_abcdef1234567890';
      expect(normalizeRequestId(valid)).toBe(valid);
    });

    it('generates a new UUID request ID if incoming is missing or invalid', () => {
      const generated = normalizeRequestId();
      expect(generated).toMatch(/^req_[a-f0-9-]{36}$/);

      const invalid = 'short';
      expect(normalizeRequestId(invalid)).toMatch(/^req_[a-f0-9-]{36}$/);
    });

    it('unwraps array of request ID headers', () => {
      const valid = 'req_proxy_forwarded_12345';
      expect(normalizeRequestId([valid, 'other'])).toBe(valid);
    });
  });

  describe('maskPhoneNumber', () => {
    it('masks 10-digit Indian mobile numbers preserving only last 3 digits', () => {
      expect(maskPhoneNumber('+91 98260 12345')).toBe('+91 98XXX-XX345');
      expect(maskPhoneNumber('9826012345')).toBe('+91 98XXX-XX345');
    });

    it('handles empty or null phone numbers gracefully', () => {
      expect(maskPhoneNumber(null)).toBe('');
      expect(maskPhoneNumber(undefined)).toBe('');
    });
  });

  describe('redaction and database URL sanitization', () => {
    it('identifies sensitive key names', () => {
      expect(isSensitiveKey('password')).toBe(true);
      expect(isSensitiveKey('jwtSecret')).toBe(true);
      expect(isSensitiveKey('authToken')).toBe(true);
      expect(isSensitiveKey('apiKey')).toBe(true);
      expect(isSensitiveKey('vendorName')).toBe(false);
    });

    it('redacts password from Postgres connection strings', () => {
      const raw = 'postgresql://user:super_secret_pw@aws-eu-central-1.pooler.neon.tech/neondb?sslmode=require';
      const redacted = redactDatabaseUrl(raw);
      expect(redacted).not.toContain('super_secret_pw');
      expect(redacted).toContain('user:***@aws-eu-central-1.pooler.neon.tech');
    });

    it('deeply redacts sensitive keys in object payloads', () => {
      const payload = {
        name: 'Johny Hot Dog',
        password: 'cleartextPassword123',
        auth: { token: 'jwt.token.here' },
        credentials: { secret: 'topsecret' },
        db: 'postgresql://usr:secretPass@localhost/db',
      };
      const clean = redactSensitiveData(payload);
      expect(clean.password).toBe('***');
      expect(clean.auth).toBe('***');
      expect(clean.credentials).toBe('***');
      expect(clean.db).toContain('usr:***@localhost');
      expect(clean.name).toBe('Johny Hot Dog');
    });
  });
});
