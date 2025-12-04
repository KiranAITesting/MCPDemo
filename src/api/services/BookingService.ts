import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiService } from './BaseApiService';
import { BookingRequest } from '../models/booking.interface';

export class BookingService extends BaseApiService {
  constructor(request: APIRequestContext, baseUrl?: string){
    super(request, baseUrl);
  }

  async create(booking: BookingRequest): Promise<{bookingid:number, booking:any}> {
    const res = await this.request.post(this.url('/booking'), { data: JSON.stringify(booking), headers: { 'Content-Type': 'application/json' } });
    const body = await res.json();
    return body;
  }

  async get(bookingId: number){
    const res = await this.request.get(this.url(`/booking/${bookingId}`));
    return res;
  }

  async update(bookingId: number, booking: BookingRequest, token?: string){
    const headers: Record<string,string> = {};
    if(token) headers['Cookie'] = `token=${token}`;
    const res = await this.request.put(this.url(`/booking/${bookingId}`), { data: JSON.stringify(booking), headers: { ...headers, 'Content-Type': 'application/json' } });
    return res;
  }

  async delete(bookingId: number, token?: string){
    const headers: Record<string,string> = {};
    if(token) headers['Cookie'] = `token=${token}`;
    const res = await this.request.delete(this.url(`/booking/${bookingId}`), { headers });
    return res;
  }
}
