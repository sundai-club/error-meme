import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { spawn } from "child_process";
import fs from "fs/promises";
import OpenAI from "openai";
import { platform, tmpdir } from "os";
import * as path from "path";
import { z } from "zod";
import { MEME_TEMPLATES } from "./templates.js";

interface MemeTemplate {
  id: string;
  name: string;
  description?: string;
}

interface MemeTask {
  templateId: string;
  text0: string;
  text1: string;
}

interface ImgflipResponse {
  success: boolean;
  data?: {
    url: string;
  };
  error_message?: string;
}

class ErrorMemeGenerator {
  private static instance: ErrorMemeGenerator;
  private memes: MemeTemplate[] = MEME_TEMPLATES;
  private openai: OpenAI;
  private recentlyUsedTemplates: string[] = [];
  private readonly MAX_RECENT_TEMPLATES = 5;

  private constructor() {
    this.openai = new OpenAI();
  }

  static getInstance(): ErrorMemeGenerator {
    if (!ErrorMemeGenerator.instance) {
      ErrorMemeGenerator.instance = new ErrorMemeGenerator();
    }
    return ErrorMemeGenerator.instance;
  }


  async prepareMemeCaption(errorText: string): Promise<MemeTask> {
    const availableMemes = this.memes.filter(
      meme => !this.recentlyUsedTemplates.includes(meme.id)
    );

    const prompt = `
      For a given error text <error>${errorText}</error> find the best meme template from this list:
      <memes>
      ${JSON.stringify(availableMemes)}
      </memes>

      Be creative and try to always choose a different meme that reflects the error situation the best.
      Return the template id and caption in one or two lines for the meme image in JSON format. 
      Be creative and use self-deprecating humor. Make jokes about ai and vibe coding when relevant.
      
      Here is an example:
      {
          "templateId": "12345", 
          "text0": "Top text", 
          "text1": "Bottom text"
      }
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a meme generator assistant that always talks JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error("No content returned from GPT");
    }

    const result = JSON.parse(content) as MemeTask;
    
    // Update recently used templates
    this.recentlyUsedTemplates.push(result.templateId);
    if (this.recentlyUsedTemplates.length > this.MAX_RECENT_TEMPLATES) {
      this.recentlyUsedTemplates.shift(); // Remove oldest template
    }

    return result;
  }

  async generateMeme(templateId: string, text0: string, text1: string): Promise<string> {
    const url = "https://api.imgflip.com/caption_image";
    const formData = new URLSearchParams({
      template_id: templateId,
      username: process.env.IMGFLIP_USERNAME || "",
      password: process.env.IMGFLIP_PASSWORD || "",
      text0,
      text1
    });

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json() as ImgflipResponse;
    if (!data.success) {
      throw new Error(data.error_message || "Failed to generate meme");
    }

    return data.data?.url || "";
  }

  async displayMeme(url: string): Promise<void> {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    
    const tempDir = tmpdir();
    const tempFile = path.join(tempDir, `meme-${Date.now()}.png`);
    await fs.writeFile(tempFile, buffer);

    const os = platform();
    switch (os) {
      case 'win32':
        spawn('cmd', ['/c', 'start', tempFile]);
        break;
      case 'darwin':
        spawn('open', [tempFile]);
        break;
      case 'linux':
        spawn('xdg-open', [tempFile]);
        break;
      default:
        console.log(`Meme saved to: ${tempFile}`);
    }
  }

  async generateMemeForError(errorText: string): Promise<string> {
    const memeTask = await this.prepareMemeCaption(errorText);
    const memeUrl = await this.generateMeme(
      memeTask.templateId,
      memeTask.text0,
      memeTask.text1
    );
    await this.displayMeme(memeUrl);
    return memeUrl;
  }
}

export function registerMemeTools(server: McpServer) {
  server.tool(
    "generate-error-meme",
    "Generate a meme for an error message. Every time a user asks you to fix an error, you should generate a meme for it first, while fixing the error in parallel.",
    {
      error_text: z.string().describe("The error message to generate a meme for"),
    },
    async ({ error_text }) => {
      try {
        const generator = ErrorMemeGenerator.getInstance();
        const memeUrl = await generator.generateMemeForError(error_text);
        
        return {
          content: [
            {
              type: "text",
              text: `Meme generated successfully: ${memeUrl}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate meme: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    }
  );
} 