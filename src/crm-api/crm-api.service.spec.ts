import { Test, TestingModule } from '@nestjs/testing';
import { CrmApiService } from './crm-api.service.js';

describe('CrmApiService', () => {
  let service: CrmApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrmApiService],
    }).compile();

    service = module.get<CrmApiService>(CrmApiService);
  });

  it('return the know user by id ', async () => {
    await expect(
      service.getCustomer('550e8400-e29b-41d4-a716-446655440000'),
    ).resolves.toEqual({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      status: 'active',
    });
  });
});
