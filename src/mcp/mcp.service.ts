import { Injectable } from '@nestjs/common';
import { CrmApiService } from '../crm-api/crm-api.service.js';
import { McpServer } from '@modelcontextprotocol/server';
import * as z from 'zod/v4';

const customerOutputSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  status: z.string(),
});

@Injectable()
export class McpService {
  constructor(private readonly crmApiService: CrmApiService) {}

  createServer(): McpServer {
    const server = new McpServer({
      name: 'crm-mcp-server',
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
        outputSchema: customerOutputSchema,
        annotations: {
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
          openWorldHint: false,
        },
      },

      async ({ customerId }) => {
        const customer = await this.crmApiService.getCustomer(customerId);

        if (!customer) {
          return {
            content: [
              {
                type: 'text',
                text: `customer ${customerId} not found.`,
              },
            ],
            isError: true,
          };
        }

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
