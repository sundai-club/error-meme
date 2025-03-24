import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerMemeTools } from "./meme.js";

const server = new McpServer({
  name: "meme",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function main() {
  registerMemeTools(server);
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Meme MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});