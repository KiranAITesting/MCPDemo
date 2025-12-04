import { APIRequestContext } from '@playwright/test';

export class BaseApiService {
  protected request: APIRequestContext;
  protected baseUrl: string;

  constructor(request: APIRequestContext, baseUrl?: string){
    this.request = request;
    this.baseUrl = baseUrl || process.env.BASE_URL || 'https://restful-booker.herokuapp.com';
  }

  protected url(path: string){
    return `${this.baseUrl}${path}`;
  }
}
