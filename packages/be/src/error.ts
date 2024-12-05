import { NextFunction, Request, RequestHandler, Response } from 'express';

export class RequestProcessingError extends Error {
  readonly httpStatus?: number;

  constructor(message?: string, httpCode?: number, cause?: Error) {
    super(message, { cause });
    this.httpStatus = httpCode;
    Object.defineProperty(this, 'name', { value: new.target.name });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  req.log.warn({ req, err }, 'An error occurred while processing the request');
  let httpStatus = 500;
  let response: any;

  if (err instanceof RequestProcessingError) {
    if (err.httpStatus) httpStatus = err.httpStatus;
    if (err.message) response = { messages: [err.message] };
  } else {
    response = { messages: ['Unexpected error'] };
  }

  res.status(httpStatus).json(response);
};

export const handleCatching =
  (handler: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) => {
    let caught = undefined;
    try {
      await handler(req, res, next);
    } catch (err) {
      caught = err;
    }
    next(caught);
  };
