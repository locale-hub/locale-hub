
import decode from 'jwt-decode';

import { ApiErrorResponse, TokenResponse, User } from '@locale-hub/data';

const baseUrl = 'http://localhost:3000/v1';
let apiToken: string;

const headers = () => ({
  Accept: 'application/json',
  'Access-Control-Allow-Origin': baseUrl,
  Authorization: apiToken,
  'Content-Type': 'application/json'
});

function apiCall<TBody>(method: string, url: string, body: TBody): Promise<Response> {
  return fetch(
    url,
    {
      method: method,
      headers: headers(),
      body: JSON.stringify(body),
    }
  )
}


export const ApiConnector = {

  login: async (email: string, password: string) => {
    try {
      const res = await apiCall(
        'POST',
        `${baseUrl}/auth/login`,
        {
          primaryEmail: email,
          password
        }
      );
      const body = await res.json();
      if (undefined !== body?.error) {
        return body as ApiErrorResponse;
      }
      apiToken = (body as TokenResponse).token;
      localStorage.setItem('token', apiToken);
      return (decode(apiToken) as any).user as User;
    } catch (err) {
      return err;
    }
  }

};
