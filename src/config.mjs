import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    instructionTableName: process.env.INSTRUCTION_TABLE_NAME || 'InstructionTable',
  },
  server: {
    name: 'Instruction MCP Server',
    version: '1.0.0',
  }
};