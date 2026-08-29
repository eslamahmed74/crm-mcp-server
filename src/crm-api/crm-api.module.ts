import { Module } from '@nestjs/common';
import { CrmApiService } from './crm-api.service.js';

@Module({
  providers: [CrmApiService],
  exports: [CrmApiService],
})
export class CrmApiModule {}
