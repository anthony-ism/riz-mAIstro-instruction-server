import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import mcpMiddleware from 'middy-mcp';
import { createMcpServer } from './server.mjs';

// Create the MCP server with all instruction tools
const server = createMcpServer();

// Export Lambda handler with middleware
export const handler = middy()
  .use(mcpMiddleware({ server }))
  .use(httpErrorHandler());