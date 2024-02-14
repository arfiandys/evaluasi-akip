
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const team = await db.team.findUnique({
      where: {
        id: params.teamId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if (!team) {
      return new NextResponse("Not found", { status: 404 });
    }

    const hasPublishedChapter = team.chapters.some((chapter) => chapter.isPublished);

    if (!team.name || !team.description || !team.imageUrl || !team.categoryId || !hasPublishedChapter) {
      return new NextResponse("Missing required fields", { status: 401 });
    }

    const publishedTeam = await db.team.update({
      where: {
        id: params.teamId,
        userId,
      },
      data: {
        isPublished: true,
      }
    });

    return NextResponse.json(publishedTeam);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}