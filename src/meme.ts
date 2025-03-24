import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { spawn } from "child_process";
import fs from "fs/promises";
import OpenAI from "openai";
import { platform, tmpdir } from "os";
import * as path from "path";
import { z } from "zod";

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
  private memes: MemeTemplate[] = [];
  private initialized = false;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI();
  }

  static getInstance(): ErrorMemeGenerator {
    if (!ErrorMemeGenerator.instance) {
      ErrorMemeGenerator.instance = new ErrorMemeGenerator();
    }
    return ErrorMemeGenerator.instance;
  }

  async init() {
    if (!this.initialized) {
      this.memes = ErrorMemeGenerator.MEME_TEMPLATES;
      this.initialized = true;
    }
  }

  // Meme templates data embedded directly in the source
  private static readonly MEME_TEMPLATES: MemeTemplate[] = [
    {
      "id": "181913649",
      "name": "Drake Hotline Bling",
      "description": "Shows two panels of Drake rejecting one thing and approving another; used to compare preferences."
    },
    {
      "id": "87743020",
      "name": "Two Buttons",
      "description": "Features a character sweating over choosing between two options, symbolizing difficult decisions."
    },
    {
      "id": "112126428",
      "name": "Distracted Boyfriend",
      "description": "Depicts a man looking at another woman while his partner looks on in dismay; used to illustrate shifting attention."
    },
    {
      "id": "217743513",
      "name": "UNO Draw 25 Cards",
      "description": "Based on the card game UNO, used when someone must face a heavy consequence or burden."
    },
    {
      "id": "124822590",
      "name": "Left Exit 12 Off Ramp",
      "description": "Shows a car abruptly taking an exit lane, symbolizing sudden changes or switching decisions at the last moment."
    },
    {
      "id": "222403160",
      "name": "Bernie I Am Once Again Asking For Your Support",
      "description": "Features Bernie Sanders making a plea; used to humorously request support or favor repeatedly."
    },
    {
      "id": "131087935",
      "name": "Running Away Balloon",
      "description": "Shows a balloon drifting away, representing loss, letting go, or things slipping from control."
    },
    {
      "id": "97984",
      "name": "Disaster Girl",
      "description": "Features a young girl smirking at chaos in the background; symbolizes a mischievous or detached reaction to disaster."
    },
    {
      "id": "129242436",
      "name": "Change My Mind",
      "description": "Shows a man sitting with a sign inviting debate; used to present controversial opinions for discussion."
    },
    {
      "id": "131940431",
      "name": "Gru's Plan",
      "description": "Depicts Gru from Despicable Me presenting a plan that backfires; used to illustrate flawed or ironic strategies."
    },
    {
      "id": "4087833",
      "name": "Waiting Skeleton",
      "description": "Features a skeleton waiting on a bench; symbolizes endless waiting or boredom."
    },
    {
      "id": "80707627",
      "name": "Sad Pablo Escobar",
      "description": "Uses an image of Pablo Escobar with a somber expression; used to convey regret or sorrow humorously."
    },
    {
      "id": "135256802",
      "name": "Epic Handshake",
      "description": "Shows two muscular arms in a firm handshake; symbolizes unexpected alliances or strong agreements."
    },
    {
      "id": "252600902",
      "name": "Always Has Been",
      "description": "Features two astronauts realizing an unchangeable truth; used to denote that something has always been a certain way."
    },
    {
      "id": "438680",
      "name": "Batman Slapping Robin",
      "description": "Depicts Batman slapping Robin; used to humorously show corrective behavior or disagreement."
    },
    {
      "id": "93895088",
      "name": "Expanding Brain",
      "description": "Shows a series of images with progressively expanding brains; used to depict levels of intelligence or absurdity."
    },
    {
      "id": "247375501",
      "name": "Buff Doge vs. Cheems",
      "description": "Contrasts a muscular Doge with a smaller Cheems; used to humorously compare strength and weakness."
    },
    {
      "id": "322841258",
      "name": "Anakin Padme 4 Panel",
      "description": "A four-panel meme from Star Wars depicting Anakin and Padme; used for humorous takes on relationships or expectations."
    },
    {
      "id": "188390779",
      "name": "Woman Yelling At Cat",
      "description": "Combines an image of a woman yelling with a confused cat; symbolizes humorous miscommunication and overreactions."
    },
    {
      "id": "102156234",
      "name": "Mocking Spongebob",
      "description": "Features a distorted Spongebob imitating a mocking tone; used to ridicule or mimic someone's words."
    }
  ]

  async prepareMemeCaption(errorText: string): Promise<MemeTask> {
    const prompt = `
      For a given error text <error>${errorText}</error> find the best meme template from this list:
      <memes>
      ${JSON.stringify(this.memes)}
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
    await this.init();
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