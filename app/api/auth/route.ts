import { NextResponse } from "next/server";
import clientPromise from "@/lib/clientpromise";

async function checkPublicKeyExists(publicKey: string) {
  const client = await clientPromise;
  const db = client.db("tweetcontest");

  const existingUser = await db.collection("users").findOne({
    "userData.publicKey": publicKey,
    "userData.verified": true,
  });

  return existingUser;
}

export async function GET(request: Request) {
  try {
    const { publicKey } = await request.json();
    if (!publicKey) {
      return NextResponse.json(
        { error: "Public key is required" },
        { status: 400 }
      );
    }

    const exists = await checkPublicKeyExists(publicKey);
    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error checking verification:", error);
    return NextResponse.json({ error: "Invalid public key" }, { status: 400 });
  }
}
