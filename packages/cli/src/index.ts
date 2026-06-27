import { Command } from "commander";

type TelegramResponse = {
  ok: boolean;
  result?: {
    message_id?: number;
  };
  description?: string;
};

const program = new Command();

const botSendMsg = async (token: string, body: string) => {
  try {
    const promiseRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      },
    );

    const response = await promiseRes.json();
    return response as TelegramResponse;
  } catch (error: any) {
    console.log("Error with API call", error?.message);
    process.exit(1);
  }
};

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

    const requestBody = JSON.stringify({ chat_id: chatId, text: message });
    const botResponse = await botSendMsg(token, requestBody);
    if (!botResponse.ok) {
      console.log(`Telegram API failed ${botResponse?.description}`);
      process.exit(1);
    }

    const messageId = botResponse?.result?.message_id;

    if (messageId) {
      console.log("Message id form bot", messageId);
    }
  });

program.parseAsync(process.argv);
