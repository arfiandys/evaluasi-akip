
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const data = await req.json();
    const url = data.url;
    const name = data.name;
    console.log(`APANICH:${url}, NAME:${name}`)

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.team.findUnique({
      where: {
        id: params.teamId,
        userId: userId,
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        // name: url.split("/").pop(),
        name: name,
        teamId: params.teamId,
      }
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("TEAM_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}