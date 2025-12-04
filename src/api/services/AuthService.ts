import { APIRequestContext } from '@playwright/test';
import { BaseApiService } from './BaseApiService';
import { AuthRequest, AuthResponse } from '../models/auth.interface';

export class AuthService extends BaseApiService {
  constructor(request: APIRequestContext, baseUrl?: string){
    super(request, baseUrl);
  }

  async login(payload: AuthRequest): Promise<string>{
    const res = await this.request.post(this.url('/auth'), { data: payload });
    if(res.ok()){
      const body = await res.json() as AuthResponse;
      return body.token;
    }
    throw new Error(`Auth failed: ${res.status()}`);
  }
}
