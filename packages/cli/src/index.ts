import { Command } from "commander";
import { sendTelegramMessage } from "chatkit-core";

const program = new Command();

program.name("chatkit").description("ChatKit CLI");
program
  .command("telegram")
  .description("Send a Telegram message")
  .argument("<chatId>", "Telegram chat ID")
  .argument("<message>", "Message to send")
  .action(async (chatId: string, message: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      console.log("Need token to connect with telegram");
      process.exit(1);
    }

    if (!chatId || !message) {
      console.log("Please add all the required parameters");
      process.exit(1);
    }

    try {
      const res = await sendTelegramMessage({
        botToken: token,
        chatId,
        message,
      });

      console.log(`Sent telegram message to chat`, res.chatId);
      console.log(`Telegram messageId`, res.messageId);
    } catch (error) {
      const errorMsg = error instanceof Error ? error?.message : String(error);
      console.log("Error with API call", errorMsg);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);
