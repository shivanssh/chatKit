import { z } from "zod";

export const telegramInputSchema = z.object({
  chatId: z.string().min(1, "ChatId is required"),
  message: z.string().min(1, "Message is required"),
});

export const telegramSendMessageOutputSchema = z.object({
  ok: z.boolean(),
  chatId: z.string(),
  messageId: z.number(),
});

export const telegramOptionsSchema = telegramInputSchema.extend({
  botToken: z.string().min(1, "Bot token is required"),
});

export const telegramRequestSchema = z.object({
  chat_id: z.string(),
  text: z.string(),
});

export const telegramSendMessageResponseSchema = z.object({
  ok: z.boolean(),
  result: z
    .object({
      message_id: z.number().optional(),
    })
    .optional(),
  description: z.string().optional(),
});

export type TelegramOptionsSchema = z.infer<typeof telegramOptionsSchema>;
export type TelegramSendMessageOutputSchema = z.infer<
  typeof telegramSendMessageOutputSchema
>;
