import { auth } from "@/auth";
import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const { Video } = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!,
);

export async function DELETE(
  req: Request,
  { params }: { params: { timEvaluasiId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const team = await db.team.findUnique({
      where: {
        id: params.timEvaluasiId,
        userId: userId,
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

    for (const chapter of team.chapters) {
      if (chapter.muxData?.assetId) {
        await Video.Assets.del(chapter.muxData.assetId);
      }
    }

    const deletedTeam = await db.team.delete({
      where: {
        id: params.timEvaluasiId,
      },
    });

    return NextResponse.json(deletedTeam);
  } catch (error) {
    console.log("[COURSE_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
    req: Request,
    { params }: { params: { timEvaluasiId: string } }
  ) {
    try {
      const session = await auth();
      const userId = session?.user.id;
      const { timEvaluasiId } = params;
      const values = await req.json();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const team = await db.team.update({
        where: {
          id: timEvaluasiId,
          userId
        },
        data: {
          ...values,
        }
      });
  
      return NextResponse.json(team);
    } catch (error) {
      console.log("[COURSE_ID]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }