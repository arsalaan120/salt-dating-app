
import { NextResponse } from "next/server";
import {
  readDatabase,
  publicProfile,
  type Swipe,
  type Profile,
} from "@/lib/store";

export async function GET() {
  try {
    const database = await readDatabase();

    const swipedIds = new Set<number>(
      database.swipes.map((swipe: Swipe) => swipe.profileId)
    );

    const feed = database.profiles
      .filter((profile: Profile) => !swipedIds.has(profile.id))
      .map(publicProfile);

    return NextResponse.json(feed);
  } catch (error) {
    console.error("Feed API error:", error);

    return NextResponse.json(
      { error: "Unable to load profiles" },
      { status: 500 }
    );
  }
}
