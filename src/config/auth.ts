import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import connectDB from "./db.js";

const db = await connectDB();

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is missing from .env");
}

export const auth = betterAuth({
  database: mongodbAdapter(db),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    process.env.CLIENT_URL || "http://localhost:3000",
  ],
});
export default auth;