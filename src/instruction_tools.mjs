import { z } from 'zod';
import { InstructionModel } from './instruction_model.mjs';

export const instructionTools = {
  // Get instructions tool
  getInstructions: {
    name: 'get_instructions',
    description: 'Get all instructions or filter by category',
    inputSchema: {
      user_id: z.string().describe('The ID of the user'),
      category: z.string().optional().describe('Filter instructions by category')
    },
    handler: async ({ user_id, category }) => {
      try {
        const result = await InstructionModel.getInstructions(user_id, category);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify(result, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }],
          isError: true
        };
      }
    }
  },

  // Add instruction tool
  addInstruction: {
    name: 'add_instruction',
    description: 'Add a new instruction',
    inputSchema: {
      user_id: z.string().describe('The ID of the user'),
      content: z.string().describe('The instruction content'),
      category: z.string().optional().describe('The category of the instruction'),
      priority: z.number().min(1).max(5).optional().default(3).describe('The priority of the instruction (1-5, with 5 being highest)')
    },
    handler: async ({ user_id, content, category, priority }) => {
      try {
        const instruction = await InstructionModel.addInstruction(user_id, content, category, priority);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({
              instruction_id: instruction.id,
              message: 'Instruction added successfully',
              instruction
            }, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }],
          isError: true
        };
      }
    }
  },

  // Update instruction tool
  updateInstruction: {
    name: 'update_instruction',
    description: 'Update an existing instruction',
    inputSchema: {
      instruction_id: z.string().describe('The ID of the instruction to update'),
      content: z.string().optional().describe('The instruction content'),
      category: z.string().optional().describe('The category of the instruction'),
      priority: z.number().min(1).max(5).optional().describe('The priority of the instruction (1-5, with 5 being highest)')
    },
    handler: async ({ instruction_id, content, category, priority }) => {
      try {
        const updates = {};
        if (content !== undefined) updates.content = content;
        if (category !== undefined) updates.category = category;
        if (priority !== undefined) updates.priority = priority;

        const updatedInstruction = await InstructionModel.updateInstruction(instruction_id, updates);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify({
              instruction_id,
              message: 'Instruction updated successfully',
              instruction: updatedInstruction
            }, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }],
          isError: true
        };
      }
    }
  },

  // Delete instruction tool
  deleteInstruction: {
    name: 'delete_instruction',
    description: 'Delete an instruction',
    inputSchema: {
      instruction_id: z.string().describe('The ID of the instruction to delete')
    },
    handler: async ({ instruction_id }) => {
      try {
        const result = await InstructionModel.deleteInstruction(instruction_id);
        
        return {
          content: [{ 
            type: 'text', 
            text: JSON.stringify(result, null, 2) 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: 'text', 
            text: error.message 
          }],
          isError: true
        };
      }
    }
  }
};