import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { teamId: string; chapterId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.team.findUnique({
      where: {
        id: params.teamId,
        userId
      }
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        teamId: params.teamId,
      },
      data: {
        isPublished: false,
      }
    });

    const publishedChaptersInTeam = await db.chapter.findMany({
      where: {
        teamId: params.teamId,
        isPublished: true,
      }
    });

    if (!publishedChaptersInTeam.length) {
      await db.team.update({
        where: {
          id: params.teamId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log("[CHAPTER_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}