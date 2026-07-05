import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { sendTelegramMessage, telegramInputSchema } from "chatkit-core";

const server = new McpServer({ name: "chatkit-local-mcp", version: "1.0.0" });

const getTelegramToken = () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN is required, please add the same in environment",
    );
  }

  return token;
};

server.registerTool(
  "telegram",
  {
    title: "Telegram",
    description: "Sent message to telegram bot",
    inputSchema: telegramInputSchema.shape,
  },
  async (input) => {
    const result = await sendTelegramMessage({
      ...input,
      botToken: getTelegramToken(),
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

const transport = new StdioServerTransport();
await server.connect(transport);
