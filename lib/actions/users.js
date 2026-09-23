"use server";

import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "dolna_db";

let cachedClient = globalThis.__dolnaMongoClient ?? null;

async function getDb() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGODB_URI);
    globalThis.__dolnaMongoClient = cachedClient;
  }
  if (!cachedClient.topology?.isConnected?.()) {
    try {
      await cachedClient.connect();
    } catch (err) {
      // connect() is idempotent; if already connecting/connected, fall through
      if (!String(err?.message ?? "").includes("already")) throw err;
    }
  }
  return cachedClient.db(DB_NAME);
}

const normalizeUser = (user) => {
  if (!user || typeof user !== "object") return user;
  return {
    _id: String(user._id ?? user.id ?? ""),
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    role: user.role ?? "customer",
    createdAt:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : (user.createdAt ?? null),
  };
};

export const getCustomers = async () => {
  const db = await getDb();

  // better-auth default model name is "user" (singular).
  // Fall back to "users" in case a custom model name was used.
  let docs = await db
    .collection("user")
    .find(
      { role: "customer" },
      { projection: { name: 1, email: 1, phone: 1, role: 1, createdAt: 1 } }
    )
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  if (docs.length === 0) {
    const fallback = await db
      .collection("users")
      .find(
        { role: "customer" },
        { projection: { name: 1, email: 1, phone: 1, role: 1, createdAt: 1 } }
      )
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();
    docs = fallback;
  }

  return docs.map(normalizeUser);
};
