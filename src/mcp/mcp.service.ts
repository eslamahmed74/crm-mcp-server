import { Injectable } from '@nestjs/common';
import { CrmApiService } from '../crm-api/crm-api.service.js';
import { McpServer } from '@modelcontextprotocol/server';
import z from 'zod';

@Injectable()
export class McpService {
  constructor(private crmApiService: CrmApiService) {}

  createServer() {
    const server = new McpServer({
      name: 'crm-api-server',
      version: '1.0.0',
    });

    server.registerTool(
      'get_customer',
      {
        title: 'Get Crm Customer',
        description: 'Retrive One Customer By Its UUID',
        inputSchema: z.object({
          customerId: z.string().uuid(),
        }),
      },

      async () => ({
        content: [
          { type: 'text', text: 'get_customer is not implemented yet ' },
        ],
      }),
    );

    return server;
  }
}
