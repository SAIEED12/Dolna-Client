import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("dolna_db");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
      phone: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
  session:{
    cookieCache:{
      enabled:true,
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      strategy: 'jwt',
    }
  },
  plugins:[jwt()]
});
