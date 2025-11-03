import { z } from "zod";

const envSchema = z.object({
  // Public (acessíveis no client)
  NEXT_PUBLIC_APP_NAME: z.string().default("MyTasks"),

  // Server-only (só no servidor)
  MY_TASKS_API_URL: z.string().url(),
  COOKIE_DOMAIN: z.string().default("localhost"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// Parse e valida as variáveis de ambiente
const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  MY_TASKS_API_URL: process.env.MY_TASKS_API_URL,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;

// Helper para verificar se estamos no servidor
export const isServer = globalThis.window === undefined;
