export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  errors?: string[];
}

