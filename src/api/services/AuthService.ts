import { APIRequestContext } from '@playwright/test';
import { BaseApiService } from './BaseApiService';
import { AuthRequest, AuthResponse } from '../models/auth.interface';

export class AuthService extends BaseApiService {
  constructor(request: APIRequestContext, baseUrl?: string){
    super(request, baseUrl);
  }

  // Use native fetch for auth to avoid behavior differences of the test request fixture
  async login(payload: AuthRequest): Promise<string>{
    const url = this.url('/auth');
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if(res.ok){
      const body = await res.json() as AuthResponse;
      return body.token;
    }
    const text = await res.text().catch(()=>'<no-body>');
    throw new Error(`Auth failed: ${res.status} - ${text}`);
  }
}
