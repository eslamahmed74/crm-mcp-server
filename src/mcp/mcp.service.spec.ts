import { describe, vi } from 'vitest';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { McpServer } from '@modelcontextprotocol/server';
import { McpService } from './mcp.service.js';
import { CrmApiService } from '../crm-api/crm-api.service.js';

describe('Mcp Service', () => {
  let client: Client;
  let server: McpServer;
  const customerId = '550e8400-e29b-41d4-a716-446655440000';
  const customer = {
    id: customerId,
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    status: 'active',
  };

  let crmApiService: {
    getCustomer: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    crmApiService = {
      getCustomer: vi.fn().mockResolvedValue(customer),
    };

    const service = new McpService(crmApiService as unknown as CrmApiService);

    server = service.createServer();

    client = new Client({
      name: 'test_client',
      version: '1.0.0',
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
  });

  afterEach(async () => {
    client.close();
    server.close();
  });

  it('advertise the get_customer tool', async () => {
    const result = await client.listTools();

    const toolNames = result.tools.map((tool) => tool.name);

    expect(toolNames).toContain('get_customer');
  });

  it('returns structured customer data for a vaild id', async () => {
    const result = await client.callTool({
      name: 'get_customer',
      arguments: {
        customerId,
      },
    });

    expect(crmApiService.getCustomer).toHaveBeenCalledWith(customerId);

    expect(result.isError).not.toBe(true);

    expect(result.structuredContent).toEqual(customer);
  });
});
