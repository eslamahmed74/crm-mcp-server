import { Injectable } from '@nestjs/common';
import { CrmApiService } from '../crm-api/crm-api.service.js';
import { McpServer } from '@modelcontextprotocol/server';
import z, { email } from 'zod';

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

      async ({ customerId }) => {
        const customer = await this.crmApiService.getCustomer(customerId);

        if (!customer) throw new Error(`customer ${customerId} not found.`);

        const output = {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          status: customer.status,
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(output),
            },
          ],
          structuredContent: output,
        };
      },
    );

    return server;
  }
}
