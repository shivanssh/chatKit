import {
  telegramOptionsSchema,
  telegramRequestSchema,
  telegramSendMessageOutputSchema,
  telegramSendMessageResponseSchema,
  type TelegramOptionsSchema,
  type TelegramSendMessageOutputSchema,
} from "./schemas";

export const sendTelegramMessage = async (
  input: TelegramOptionsSchema,
): Promise<TelegramSendMessageOutputSchema> => {
  const parsedInput = telegramOptionsSchema.parse(input);
  const requestBody = telegramRequestSchema.parse({
    chat_id: parsedInput.chatId,
    text: parsedInput.message,
  });

  const promiseRes = await fetch(
    `https://api.telegram.org/bot${parsedInput.botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: await Response.json(requestBody).text(),
    },
  );

  const data = telegramSendMessageResponseSchema.parse(await promiseRes.json());

  if (!promiseRes.ok || !data.ok || !data?.result) {
    const error = data.description || "Telegram message request failed";
    throw new Error(error);
  }

  return telegramSendMessageOutputSchema.parse({
    ok: true,
    chatId: parsedInput.chatId,
    messageId: data.result.message_id,
  });
};
