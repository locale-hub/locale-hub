import { ApiError } from '../models/api-error.model';

export class ApiException extends Error {
  error: ApiError;

  constructor(error: ApiError) {
    super(error.message);

    this.error = error;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiException.prototype);
  }
}
