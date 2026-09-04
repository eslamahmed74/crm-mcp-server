import { Test, TestingModule } from '@nestjs/testing';
import { CrmApiService } from './crm-api.service.js';
import { CrmApiModule } from './crm-api.module.js';

describe('CrmApiService', () => {
  let service: CrmApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CrmApiModule],
    }).compile();

    service = module.get<CrmApiService>(CrmApiService);
  });

  it('returns the known customer by id', async () => {
    await expect(
      service.getCustomer('550e8400-e29b-41d4-a716-446655440000'),
    ).resolves.toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      status: 'active',
    });
  });

  it('returns null when the customer does not exist', async () => {
    await expect(
      service.getCustomer('123e4567-e89b-12d3-a456-426614174000'),
    ).resolves.toBeNull();
  });
});