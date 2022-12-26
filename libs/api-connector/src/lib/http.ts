import { ApiErrorResponse } from '@locale-hub/data/responses/api-error.response';
import { ErrorCode } from '@locale-hub/data/enums/error-code.enum';

export class Http {
  private authorization = '';

  constructor(
    private baseUrl: string,
    private onUnauthorized: () => void
  ) {}

  private headers = () => {
    if ('' === this.authorization) {
      this.setToken(localStorage.getItem('token') ?? '');
    }
    return {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': this.baseUrl,
      Authorization: this.authorization,
      'Content-Type': 'application/json',
    };
  };

  setToken(token: string) {
    this.authorization = token;
  }

  private async apiCall<TBody, TResponse>(
    method: string,
    url: string,
    body?: TBody
  ): Promise<TResponse | ApiErrorResponse> {
    try {
      const init: RequestInit = {
        method: method,
        headers: this.headers(),
      };
      if (undefined !== body && null !== body) {
        init.body = JSON.stringify(body);
      }

      const res = await fetch(`${this.baseUrl}${url}`, init);

      if (401 === res.status) {

        this.onUnauthorized();
        return {
          error: {
            statusCode: 401,
            code: ErrorCode.userAccessUnauthorized,
            message: 'Unauthorized, please login again',
          },
        };
      }

      if (204 === res.status) {
        // as any TResponse could be 'null', but we have following error:
        // TS2322: Type 'null' is not assignable to type 'TResponse | ApiErrorResponse'.
        return null as any;
      }

      const json = await res.json();

      return undefined !== json?.error
        ? (json as ApiErrorResponse)
        : (json as TResponse);
    } catch (err: any) {
      return {
        error: {
          statusCode: 500,
          code: ErrorCode.unknownError,
          message: 'Unexpected error',
          errors: [`${err}`],
        },
      };
    }
  }

  async get<TResponse>(path: string): Promise<TResponse | ApiErrorResponse> {
    return this.apiCall<unknown, TResponse>('GET', path);
  }

  async post<TBody, TResponse>(
    path: string,
    body?: TBody
  ): Promise<TResponse | ApiErrorResponse> {
    return this.apiCall<TBody, TResponse>('POST', path, body);
  }

  async put<TBody, TResponse>(
    path: string,
    body?: TBody
  ): Promise<TResponse | ApiErrorResponse> {
    return this.apiCall<TBody, TResponse>('PUT', path, body);
  }

  async patch<TBody, TResponse>(
    path: string,
    body?: TBody
  ): Promise<TResponse | ApiErrorResponse> {
    return this.apiCall<TBody, TResponse>('PATCH', path, body);
  }

  async delete<TBody, TResponse>(
    path: string,
    body?: TBody
  ): Promise<TResponse | ApiErrorResponse> {
    return this.apiCall<TBody, TResponse>('DELETE', path, body);
  }

  async getBlob(path: string): Promise<Blob | ApiErrorResponse> {
    try {
      const init: RequestInit = {
        method: 'GET',
        headers: this.headers(),
      };

      const res = await fetch(`${this.baseUrl}${path}`, init);
      return await res.blob();
    } catch (err: any) {
      return {
        error: {
          statusCode: 500,
          code: ErrorCode.unknownError,
          message: 'Unexpected error',
          errors: [`${err}`],
        },
      };
    }
  }
}
