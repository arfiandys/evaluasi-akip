import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { teamId: string; chapterId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownTeam = await db.team.findUnique({
      where: {
        id: params.teamId,
        userId,
      }
    });

    if (!ownTeam) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        teamId: params.teamId,
      }
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId
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

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { teamId: string; chapterId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownTeam = await db.team.findUnique({
      where: {
        id: params.teamId,
        userId
      }
    });

    if (!ownTeam) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        teamId: params.teamId,
      },
      data: {
        ...values,
      }
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}