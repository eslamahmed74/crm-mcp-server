import { describe, vi } from 'vitest';
import { Client, InMemoryTransport } from '@modelcontextprotocol/client';
import { McpServer } from '@modelcontextprotocol/server';
import { McpService } from './mcp.service.js';
import { CrmApiService } from '../crm-api/crm-api.service.js';

describe('Mcp Service', () => {
  let client: Client;
  let server: McpServer;

  beforeEach(async () => {
    const crmApiService = {
      getCustomer: vi.fn,
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
    server.close();
    client.close();
  });

  it('advertise the get_customer tool', async () => {
    const result = await client.listTools();

    const toolNames = result.tools.map((tool) => tool.name);

    expect(toolNames).toContain("get_customer")
  });
});
