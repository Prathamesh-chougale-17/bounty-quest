// services/taskGeneratorService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import clientPromise from "../lib/clientpromise";
import { ObjectId } from "mongodb";

export interface GeneratedTask {
  description: string;
  category: "blockchain" | "memes" | "nfts";
  requirements: string[];
  evaluationCriteria: string[];
}

export class TaskGeneratorService {
  private static async generateTaskWithAI(): Promise<GeneratedTask> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Generate a creative Twitter task related to one of these categories: blockchain, memes, or NFTs.
      The task should be engaging, clear, and encourage creative responses.
      Return ONLY a valid JSON object with no additional text, markdown or explanation. It should start with an opening curly brace '{' and end with a closing curly brace '}'.
      The JSON must strictly follow this format:
      {
        "title": "task title",
        "description": "clear task description",
        "category": "one of: blockchain, memes, nfts",
        "requirements": ["list of specific requirements"],
        "evaluationCriteria": ["specific criteria for judging"]
        "rewards": {
          "usdcAmount": "any number from 1 to 1000",
          "nftReward": "optional NFT reward"
        }

      }

      Make the task fun and engaging while maintaining relevance to crypto/web3 culture.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  }

  public static async createNewTask(
    durationHours: number = 4
  ): Promise<string> {
    const task = await this.generateTaskWithAI();

    const client = await clientPromise;
    const db = client.db("tweetcontest");

    const startTime = new Date();
    const endTime = new Date(
      startTime.getTime() + durationHours * 60 * 60 * 1000
    );

    const result = await db.collection("tasks").insertOne({
      ...task,
      startTime,
      endTime,
      isActive: true,
      winners: [],
      isWinnerDeclared: false,
      _id: new ObjectId(),
    });

    return result.insertedId.toString();
  }

  public static async getActiveTask() {
    const client = await clientPromise;
    const db = client.db("tweetcontest");
    // if task has ended, set isActive to false
    await this.checkTaskStatus();
    return db.collection("tasks").find({ isActive: true }).toArray();
  }

  public static async getActiveTaskById(taskId: string) {
    const client = await clientPromise;
    const db = client.db("tweetcontest");
    return db
      .collection("tasks")
      .findOne({ _id: new ObjectId(taskId), isActive: true });
  }

  public static async getTaskById(taskId: string) {
    const client = await clientPromise;
    const db = client.db("tweetcontest");
    return db.collection("tasks").findOne({ _id: new ObjectId(taskId) });
  }

  public static async setTaskInactive(taskId: string) {
    const client = await clientPromise;
    const db = client.db("tweetcontest");
    return db
      .collection("tasks")
      .updateOne({ _id: new ObjectId(taskId) }, { $set: { isActive: false } });
  }

  public static async getPastTasks() {
    const client = await clientPromise;
    const db = client.db("tweetcontest");
    return db.collection("tasks").find({ isActive: false }).toArray();
  }

  public static async setTaskWinner(taskId: string, winnerId: string) {
    const client = await clientPromise;
    const db = client.db("tweetcontest");
    return db
      .collection("tasks")
      .updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { winners: winnerId } }
      );
  }

  // write a method to set the task as inactive if the end time has passed
  public static async checkTaskStatus() {
    const client = await clientPromise;
    const db = client.db("tweetcontest");
    const currentTime = new Date();

    return db
      .collection("tasks")
      .updateMany(
        { endTime: { $lt: currentTime } },
        { $set: { isActive: false } }
      );
  }
}
