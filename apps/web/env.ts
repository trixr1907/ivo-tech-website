import { z } from 'zod';

const envSchema = z.object({
  // Basis-URL
  NEXT_PUBLIC_BASE_URL: z.string().url(),

  // API-Konfiguration
  API_URL: z.string().url(),
  API_KEY: z.string().min(1),

  // Analytics
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),

  // Sicherheit
  JWT_SECRET: z.string().min(32),

  // Datenbank
  DATABASE_URL: z.string().url(),

  // Mail-Service
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),

  // Externe Services
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: z.string().optional(),
  RECAPTCHA_SECRET_KEY: z.string().optional(),
});

/**
 * @type {Record<keyof z.infer<typeof envSchema>, string | undefined>}
 */
export const env = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  API_URL: process.env.API_URL,
  API_KEY: process.env.API_KEY,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
} as const;

try {
  envSchema.parse(env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const { fieldErrors } = error.flatten();
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) => `${field}: ${errors?.join(', ')}`)
      .join('\n  ');

    throw new Error(`❌ Ungültige Umgebungsvariablen:\n  ${errorMessage}`);
  }
}

export const validEnv = envSchema.parse(env);
