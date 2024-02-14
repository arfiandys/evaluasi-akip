
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
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const teamOwner = await db.team.findUnique({
      where: {
        id: params.teamId,
        userId: userId,
      }
    });

    if (!teamOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        teamId: params.teamId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        teamId: params.teamId,
        position: newPosition,
      }
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}