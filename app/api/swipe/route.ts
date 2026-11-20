
import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body: {
      profileId?: unknown;
      action?: unknown;
    } = await request.json();

    const profileId = body.profileId;
    const action = body.action;

    if (
      typeof profileId !== "number" ||
      !Number.isInteger(profileId) ||
      (action !== "like" && action !== "pass")
    ) {
      return NextResponse.json(
        { error: "Invalid profileId or action" },
        { status: 400 }
      );
    }

    const database = await readDatabase();

    const profile = database.profiles.find(
      (item) => item.id === profileId
    );

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const alreadySwiped = database.swipes.some(
      (swipe) => swipe.profileId === profileId
    );

    if (alreadySwiped) {
      return NextResponse.json(
        { error: "You have already swiped on this profile" },
        { status: 409 }
      );
    }

    database.swipes.push({
      profileId,
      action
    });

    const matched =
      action === "like" && profile.likedByUser;

    if (matched && !database.matches.includes(profileId)) {
      database.matches.push(profileId);
    }

    await writeDatabase(database);

    return NextResponse.json({
      success: true,
      matched
    });

  } catch (error) {
    console.error("Swipe API error:", error);

    return NextResponse.json(
      { error: "Unable to save swipe" },
      { status: 500 }
    );
  }
}
