import { betterAuth } from "better-auth";
import { admin, emailOTP, phoneNumber } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

import { APIError } from "better-auth/api";
import { localization } from "better-auth-localization";

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
          const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              accept: "application/json",
              "api-key": process.env.BREVO_API_KEY!,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              sender: {
                name: "MARESANS",
                email: process.env.SENDER_EMAIL!,
              },
              to: [{ email }],
              subject: "OTP ile giriş",
              htmlContent: `<p>Giriş kodunuz: ${otp} (geçerlilik süresi 5 dakikadır)</p>`,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error("Brevo API Error:", error);
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "Email sending failed",
            });
          }
        }
      },
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
