# Instruction MCP Server

A Model Context Protocol (MCP) server for managing user instructions using AWS Lambda and DynamoDB.

## Project Structure

```
instruction-mcp-server/
├── dev/
│   └── local_server.mjs               # Local server for testing
├── src/
│   └── config.mjs                     # Configuration management
│   └── db_client.mjs                  # DynamoDB client setup
│   └── index.mjs                      # Main Lambda handler
│   └── instruction_model.mjs          # Instruction data model and database operations
│   └── instruction_tools.mjs          # MCP tool definitions
│   └── server.mjs                     # MCP server initialization
├── package.json                       # Dependencies and scripts
├── .env.example                       # Environment variables example
└── README.md                          # This file
```

## Features

The server provides the following MCP tools:

- **get_instruction** - Retrieve a user's instruction
- **update_instruction** - Update user instruction information
- **add_interest** - Add an interest to a user's instruction
- **remove_interest** - Remove an interest from a user's instruction
- **add_connection** - Add a connection to a user's instruction
- **remove_connection** - Remove a connection from a user's instruction
- **list_instructions** - List all instructions (with optional limit)
- **delete_instruction** - Delete a user's instruction

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your AWS configuration
   ```

3. **Set up DynamoDB table:**
   See instruction-server-cdk project

## Usage

### Local Development

```bash
npm run dev
```

### AWS Lambda Deployment

The server is designed to run as an AWS Lambda function. See instruction-server-cdk project.

## Instruction Schema

Each instruction contains:

```json
{
  "id": "string",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp",
  "name": "string | null",
  "location": "string | null", 
  "job": "string | null",
  "connections": ["array", "of", "strings"],
  "interests": ["array", "of", "strings"]
}
```

## Testing and troubleshooting
```bash
   npx @modelcontextprotocol/inspector
```

