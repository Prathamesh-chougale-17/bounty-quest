import { NextResponse } from "next/server";
import clientPromise from "@/lib/clientpromise";

export async function POST(request: Request) {
  try {
    const { publicKey, taskId } = await request.json();

    if (!publicKey || !taskId) {
      return NextResponse.json(
        { error: "Missing publicKey or taskId" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("tweetcontest");
    const submission = await db.collection("submissions").findOne({
      publicKey,
      taskId,
    });

    if (!submission) {
      return NextResponse.json({ twitterId: null });
    }

    return NextResponse.json({ twitterId: submission.tweetId });
  } catch (error) {
    console.error("Error checking submission:", error);
    return NextResponse.json(
      { error: "Failed to check submission" },
      { status: 500 }
    );
  }
}
