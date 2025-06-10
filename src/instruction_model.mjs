import dynamoDb from './db_client.mjs';
import { config } from './config.mjs';
import { v4 as uuidv4 } from 'uuid';

const tableName = config.aws.instructionTableName;

export class InstructionModel {
  static createDefaultInstruction(userId, content) {
    const now = new Date().toISOString();
    return {
      id: uuidv4(),
      user_id: userId,
      content: content,
      category: null,
      priority: 3,
      created_at: now,
      updated_at: now
    };
  }

  static async getInstructions(userId, category = null) {
    try {
      let params;
      
      if (category) {
        // Filter by user_id and category
        params = {
          TableName: tableName,
          FilterExpression: 'user_id = :user_id AND category = :category',
          ExpressionAttributeValues: {
            ':user_id': userId,
            ':category': category
          }
        };
      } else {
        // Filter by user_id only
        params = {
          TableName: tableName,
          FilterExpression: 'user_id = :user_id',
          ExpressionAttributeValues: {
            ':user_id': userId
          }
        };
      }

      const result = await dynamoDb.scan(params).promise();
      const instructions = result.Items || [];
      
      // Sort by priority (highest first)
      instructions.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      
      return {
        instructions,
        count: instructions.length
      };
    } catch (error) {
      throw new Error(`Error getting instructions: ${error.message}`);
    }
  }

  static async addInstruction(userId, content, category = null, priority = 3) {
    try {
      if (!content) {
        throw new Error('Instruction content cannot be empty');
      }

      // Validate priority
      const validPriority = (priority >= 1 && priority <= 5) ? priority : 3;
      
      const instruction = {
        id: uuidv4(),
        user_id: userId,
        content: content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        priority: validPriority
      };

      if (category) {
        instruction.category = category;
      }

      const params = {
        TableName: tableName,
        Item: instruction
      };

      await dynamoDb.put(params).promise();
      return instruction;
    } catch (error) {
      throw new Error(`Error adding instruction: ${error.message}`);
    }
  }

  static async updateInstruction(instructionId, updates) {
    try {
      // Check if instruction exists
      const getParams = {
        TableName: tableName,
        Key: { id: instructionId }
      };

      const result = await dynamoDb.get(getParams).promise();
      if (!result.Item) {
        throw new Error(`Instruction not found with ID: ${instructionId}`);
      }

      // Prepare update expression
      let updateExpression = 'SET updated_at = :updated_at';
      const expressionValues = {
        ':updated_at': new Date().toISOString()
      };

      // Add fields to update
      if (updates.content !== undefined) {
        updateExpression += ', content = :content';
        expressionValues[':content'] = updates.content;
      }

      if (updates.category !== undefined) {
        updateExpression += ', category = :category';
        expressionValues[':category'] = updates.category;
      }

      if (updates.priority !== undefined) {
        const validPriority = (updates.priority >= 1 && updates.priority <= 5) ? updates.priority : 3;
        updateExpression += ', priority = :priority';
        expressionValues[':priority'] = validPriority;
      }

      // Update in DynamoDB
      const updateParams = {
        TableName: tableName,
        Key: { id: instructionId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionValues,
        ReturnValues: 'ALL_NEW'
      };

      const updateResult = await dynamoDb.update(updateParams).promise();
      return updateResult.Attributes;
    } catch (error) {
      throw new Error(`Error updating instruction: ${error.message}`);
    }
  }

  static async deleteInstruction(instructionId) {
    try {
      const params = {
        TableName: tableName,
        Key: { id: instructionId }
      };

      await dynamoDb.delete(params).promise();
      return { 
        instruction_id: instructionId,
        message: 'Instruction deleted successfully' 
      };
    } catch (error) {
      throw new Error(`Error deleting instruction: ${error.message}`);
    }
  }

  static async getAllInstructions() {
    try {
      const params = {
        TableName: tableName
      };

      const result = await dynamoDb.scan(params).promise();
      return result.Items || [];
    } catch (error) {
      throw new Error(`Error getting all instructions: ${error.message}`);
    }
  }

  static async getCategories() {
    try {
      const params = {
        TableName: tableName
      };

      const result = await dynamoDb.scan(params).promise();
      const instructions = result.Items || [];
      
      // Extract unique categories
      const categories = new Set();
      instructions.forEach(instruction => {
        if (instruction.category) {
          categories.add(instruction.category);
        }
      });
      
      return Array.from(categories);
    } catch (error) {
      throw new Error(`Error getting categories: ${error.message}`);
    }
  }
}