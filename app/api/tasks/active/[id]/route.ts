import { NextResponse } from "next/server";
import { TaskGeneratorService } from "@/services/taskGeneratorService";
import { ObjectId } from "mongodb";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const task = await TaskGeneratorService.getActiveTaskById(params.id);

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
