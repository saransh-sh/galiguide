import {
  AppError,
  BadRequestError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  RateLimitError,
  ServiceUnavailableError,
  ERROR_CODES,
} from '../../src/shared/errors';

describe('Shared AppError Suite', () => {
  it('instantiates generic AppError with default internal server error status', () => {
    const error = new AppError('Server boom');
    expect(error.message).toBe('Server boom');
    expect(error.code).toBe(ERROR_CODES.INTERNAL_SERVER_ERROR);
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
  });

  it('instantiates BadRequestError with 400 status', () => {
    const error = new BadRequestError('Invalid filter parameter');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe(ERROR_CODES.BAD_REQUEST);
  });

  it('instantiates ValidationError with 400 status', () => {
    const error = new ValidationError('Latitude must be between -90 and 90');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  it('instantiates UnauthorizedError with 401 status', () => {
    const error = new UnauthorizedError('JWT expired');
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it('instantiates ForbiddenError with 403 status', () => {
    const error = new ForbiddenError('Super Admin permission required');
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe(ERROR_CODES.FORBIDDEN);
  });

  it('instantiates NotFoundError with 404 status', () => {
    const error = new NotFoundError('Vendor not found');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe(ERROR_CODES.NOT_FOUND);
  });

  it('instantiates ConflictError with 409 status', () => {
    const error = new ConflictError('Vendor already exists at this stall');
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe(ERROR_CODES.CONFLICT);
  });

  it('instantiates UnprocessableEntityError with 422 status', () => {
    const error = new UnprocessableEntityError('Malformed schedule intervals');
    expect(error.statusCode).toBe(422);
    expect(error.code).toBe(ERROR_CODES.UNPROCESSABLE_ENTITY);
  });

  it('instantiates RateLimitError with 429 status', () => {
    const error = new RateLimitError('Too many queries');
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe(ERROR_CODES.RATE_LIMIT_EXCEEDED);
  });

  it('instantiates ServiceUnavailableError with 503 status', () => {
    const error = new ServiceUnavailableError('Neon PostgreSQL pool exhausted');
    expect(error.statusCode).toBe(503);
    expect(error.code).toBe(ERROR_CODES.SERVICE_UNAVAILABLE);
  });
});
