import { ErrorCode } from '../enums/error-code.enum';

export interface ApiError {
  statusCode: number;
  code: ErrorCode;
  message: string;
  errors?: string[];
}

