/**
 * Base class for application-level errors.
 * Note that React error overlay in not displayed in development mode for ApplicationErrors.
 */
export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    Object.defineProperty(this, 'name', { value: new.target.name });
    Object.defineProperty(this, 'basename', { value: ApplicationError.name });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ResourceAccessError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}
