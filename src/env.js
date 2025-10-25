import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    AWS_ACCESS_KEY_ID: z.string().default(""),
    AWS_SECRET_ACCESS_KEY: z.string().default(""),
    AWS_REGION: z.string(),
    AWS_S3_BUCKET_NAME: z.string(),

    NODEMAILER_SERVICE: z.string(),
    EMAIL_ADMIN: z.string().email(),
    EMAIL_USER: z.string().email(),
    EMAIL_PASS: z.string(),
    EMAIL_FROM: z.string(),

    SNS_TOPIC_ARN: z.string(),

    GOOGLE_GEOCODE_API_KEY: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
    NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID: z.string(),
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

    NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE,
    EMAIL_ADMIN: process.env.EMAIL_ADMIN,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,

    SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN,

    GOOGLE_GEOCODE_API_KEY: process.env.GOOGLE_GEOCODE_API_KEY,

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
