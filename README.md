# Cursor Meme Generator MCP Server Setup

A quick guide to set up automatic meme generation for your error messages in Cursor IDE using Model Context Protocol (MCP).


Vibe coding is fun but what about vibe-debugging? Not so much, right?
How about we make it more fun?
While waiting for robots to fix our errors, let's not waste any time learning how to code better, but rather just laugh a little.

![Debug memes in action](https://github.com/sundai-club/error-meme/blob/master/meme-1742837907213.png?raw=true)


## Prerequisites

- Cursor IDE installed
- Node.js installed
- ImgFlip account (free at imgflip.com)
- OpenAI API key

## Setup Steps

1. Clone the meme generator repository:
```bash
git clone https://github.com/sundai-club/error-meme
cd error-meme
npm install
npm run build
```

2. Create your MCP configuration file in one of these locations:
   - Project-specific: `.cursor/mcp.json` in your project directory
   - Global: `~/.cursor/mcp.json` in your home directory

3. Add the following configuration (replace with your credentials):
```json
{
  "mcpServers": {    
    "meme": {
        "command": "node",
        "args": [
            "/path/to/your/error-meme/build/index.js"
        ],
        "env": {
            "OPENAI_API_KEY": "your-openai-api-key",
            "IMGFLIP_USERNAME": "your-imgflip-username",
            "IMGFLIP_PASSWORD": "your-imgflip-password"
        }
    }
  }
}
```

4. Restart Cursor IDE to apply the changes

## Usage

1. Open Cursor IDE
2. Make sure to enable Agent mode in the chat
3. Paste your error message into the chat
4. The agent will automatically generate a meme for your error!

## Resources

- [Official MCP Documentation](https://docs.cursor.com/context/model-context-protocol)
- [ImgFlip API Documentation](https://imgflip.com/api)
