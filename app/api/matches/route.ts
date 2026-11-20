
import { NextResponse } from "next/server";
import { readDatabase, publicProfile } from "@/lib/store";

export async function GET() {
  try {
    const database = await readDatabase();

    // Return only mutual matches
    const matches = database.profiles
      .filter((profile) => database.matches.includes(profile.id))
      .map(publicProfile);

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Matches API error:", error);

    return NextResponse.json(
      { error: "Unable to load matches" },
      { status: 500 }
    );
  }
}
