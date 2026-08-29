import { Injectable } from '@nestjs/common';

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: string;
}

@Injectable()
export class CrmApiService {
  private readonly customers = new Map<string, Customer>([
    [
      '550e8400-e29b-41d4-a716-446655440000',
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Ahmed Hassan',
        email: 'ahmed@example.com',
        status: 'active',
      },
    ],
  ]);

  async getCustomer(customerId: string): Promise<Customer | null> {
    return this.customers.get(customerId) ?? null;
  }
}
