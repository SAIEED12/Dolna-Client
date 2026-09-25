"use server";

import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { auth } from "@/lib/auth";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    throw new Error("Please sign in again.");
  }
  if (session.user.role !== "admin") {
    throw new Error("Admin only.");
  }
  const db = await getDb();

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
