import { APIError, betterAuth } from "better-auth";
import { admin, magicLink, phoneNumber } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sendEmail } from "./lib/email";

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
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => {
        return {
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
    },
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        defaultValue: "",
      },
      lastName: {
        type: "string",
        required: true,
        defaultValue: "",
      },
    },
  },
  plugins: [
    admin(),
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, ctx) => {},
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const res = await sendEmail({
          to: email,
          subject: "Şifresiz Giriş",
          text: `Marsans'a giriş yapmak için lütfen tıklayın: ${url}`,
        });
        if (!res?.success) {
          throw new APIError("INTERNAL_SERVER_ERROR", {
            message: "E-posta gönderilemedi. Daha sonra tekrar deneyiniz",
          });
        }
      },
      expiresIn: 15 * 60,
    }),
  ],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
