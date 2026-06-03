import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env';
import { db } from '../config/db';

// Initialize the Anthropic client if an API key is provided
const anthropic = config.CLAUDE_API_KEY 
  ? new Anthropic({ apiKey: config.CLAUDE_API_KEY }) 
  : null;

export class AIService {
  /**
   * Reads the static baseline assistant guidelines from your markdown file
   */
  private static getSystemPrompt(): string {
    try {
      const promptPath = path.join(__dirname, '../knowledge-base/system-prompt.md');
      return fs.readFileSync(promptPath, 'utf8');
    } catch (error) {
      console.error('⚠️ Could not load system-prompt.md, applying fallback:', error);
      return 'You are a professional literary assistant for the BookLeaf ecosystem.';
    }
  }

  /**
   * RAG Context Loader: Queries database caches for context matching input tokens
   */
  private static async getRelevantContext(userQuery: string): Promise<string> {
    try {
      const keywords = userQuery.split(' ').filter(word => word.length > 3);
      if (keywords.length === 0) return '';

      // Perform a keyword matching scan against text content and slugs
      const searchPattern = `%${keywords[0]}%`;
      const result = await db.query(
        `SELECT content FROM ai_knowledge_cache 
         WHERE slug ILIKE $1 OR content ILIKE $1 
         LIMIT 2`,
        [searchPattern]
      );

      if (result.rows.length === 0) return '';
      return result.rows.map(row => row.content).join('\n\n');
    } catch (error) {
      console.error('❌ Failed to extract RAG context from cache:', error);
      return '';
    }
  }

  /**
   * Processes an incoming conversation query, builds context, and coordinates with Claude
   */
  static async askAssistant(userQuery: string, userId: string): Promise<string> {
    if (!anthropic) {
      return "🤖 AI Sandbox mode active. Connect a valid CLAUDE_API_KEY to initialize live responses.";
    }

    try {
      const systemPrompt = this.getSystemPrompt();
      const contextDocs = await this.getRelevantContext(userQuery);

      // Inject retrieved data context directly into system-level operations
      const contextualSystemInstruction = contextDocs
        ? `${systemPrompt}\n\n[VERIFIED DATA CONTEXT]:\n${contextDocs}`
        : systemPrompt;

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1200,
        system: contextualSystemInstruction,
        messages: [{ role: 'user', content: userQuery }],
      });

      const firstBlock = response.content[0];
      if (firstBlock && firstBlock.type === 'text') {
        return firstBlock.text;
      }

      return "AI generated an unparseable response object block.";
    } catch (error: any) {
      console.error('💥 Anthropic Engine connection failure:', error);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }
}