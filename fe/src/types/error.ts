/**
 * Base class for application-level errors.
 * Note that React error overlay in not displayed in development mode for ApplicationErrors.
 */
export class ApplicationError extends Error {
  readonly recoverable?: boolean;

  constructor(message: string, cause?: any, recoverable?: boolean) {
    super(message, { cause });
    this.recoverable = recoverable;
    Object.defineProperty(this, 'name', { value: new.target.name });
    Object.defineProperty(this, 'basename', { value: ApplicationError.name });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ResourceNotFoundError extends ApplicationError {}
export class ResourceAccessError extends ApplicationError {}
export class ApiError extends ApplicationError {}
