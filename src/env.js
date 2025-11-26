import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    AWS_ACCESS_KEY_ID: z.string().default(""),
    AWS_SECRET_ACCESS_KEY: z.string().default(""),
    AWS_REGION: z.string(),
    AWS_S3_BUCKET_NAME: z.string(),
    AWS_ENDPOINT_URL_S3: z.string().url().default(""),
    AWS_S3_PUBLIC_ENDPOINT: z.string().url().default(""),
    // AWS_ACCESS_KEY_ID: z.string().optional(),
    // AWS_SECRET_ACCESS_KEY: z.string().optional(),
    // AWS_REGION: z.string().optional(),
    // AWS_S3_BUCKET_NAME: z.string().optional(),

    NODEMAILER_SERVICE: z.string(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    EMAIL_ADMIN: z.string().email(),
    EMAIL_USER: z.string().email(),
    EMAIL_PASS: z.string(),
    EMAIL_FROM: z.string(),
    // NODEMAILER_SERVICE: z.string().optional(),
    // EMAIL_ADMIN: z.string().email().optional(),
    // EMAIL_USER: z.string().email().optional(),
    // EMAIL_PASS: z.string().optional(),
    // EMAIL_FROM: z.string().optional(),

    SNS_TOPIC_ARN: z.string().optional(),
    EXTERNAL_REPORTS_API_URL: z.string().url().optional(),
    EXTERNAL_REPORTS_PROVIDER_NAME: z.string().default("External API"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,

    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_ENDPOINT_URL_S3: process.env.AWS_ENDPOINT_URL_S3,
    AWS_S3_PUBLIC_ENDPOINT: process.env.AWS_S3_PUBLIC_ENDPOINT,

    NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    EMAIL_ADMIN: process.env.EMAIL_ADMIN,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,

    SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN,
    EXTERNAL_REPORTS_API_URL: process.env.EXTERNAL_REPORTS_API_URL,
    EXTERNAL_REPORTS_PROVIDER_NAME: process.env.EXTERNAL_REPORTS_PROVIDER_NAME,

    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
