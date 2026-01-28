import { betterAuth } from "better-auth";
import { admin, emailOTP, phoneNumber } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { Resend } from "resend";
import { APIError } from "better-auth/api";
import { localization } from "better-auth-localization";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "jwe",
      refreshCache: {
        updateAge: 60,
      },
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 512,
    customRules: {
      "/email-otp/send-verification-otp": {
        max: 1,
        window: 1,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
      accessType: "offline",
    },
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    localization({
      defaultLocale: "tr-TR",
      fallbackLocale: "default",
    }),
    admin(),
    phoneNumber(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      allowedAttempts: 5,
      expiresIn: 300,
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type === "sign-in") {
          const { error } = await resend.emails.send({
            from: "MARESANS <onboarding@resend.dev>",
            to: email,
            subject: "OTP ile giriş",
            html: `<p>Giriş kodunuz: ${otp} (geçerlilik süresi 5 dakikadır)</p>`,
          });

          if (error) {
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "API Credentials Error",
            });
          }
        }
      },
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
