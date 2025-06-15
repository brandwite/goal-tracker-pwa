import { NextRequest, NextResponse } from "next/server";

const goals: { text: string; status: "pending" | "inprogress" | "completed" }[] = [
  { text: "Read a book", status: "pending" },
  { text: "Finish project report", status: "inprogress" },
  { text: "Workout 3x this week", status: "pending" },
  { text: "Submit tax documents", status: "completed" },
];

export async function GET() {
  return NextResponse.json({ goals });
}

export async function POST(req: NextRequest) {
  const { text, status } = await req.json();
  if (typeof text === "string" && text.trim()) {
    goals.unshift({ text: text.trim(), status: status || "pending" });
  }
  return NextResponse.json({ goals });
} 