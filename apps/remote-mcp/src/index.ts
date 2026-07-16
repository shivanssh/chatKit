import { Hono, Context } from "hono";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { sendTelegramMessage, telegramInputSchema } from "chatkit-core";

function createServer(botToken: string) {
  const server = new McpServer({ name: "chatkit-local-mcp", version: "1.0.0" });

  server.registerTool(
    "telegram",
    {
      title: "Telegram",
      description: "Sent message to telegram",
      inputSchema: telegramInputSchema.shape,
    },
    async (input) => {
      const result = await sendTelegramMessage({
        ...input,
        botToken,
      });

      return {
        content: [
          {
            type: "text",
            text: `Sent Telegram message ${result.messageId} to chat ${result.chatId}`,
          },
        ],
        structuredContent: result,
      };
    },
  );

  return server;
}

const app = new Hono();

app.post("/:botToken/mcp", async (c) => {
  const botToken = c.req.param("botToken")!;
  const server = createServer(botToken);

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);

  try {
    return await transport.handleRequest(c.req.raw);
  } catch (error) {
    console.log("Some Error with Remote MCP Transport call", error);
    return c.json({ error: "Internal Server Error" }, 500);
  } finally {
    await server.close();
  }
});

app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

const port = Number(process.env.PORT ?? 3000);

export default {
  port,
  fetch: app.fetch,
};
