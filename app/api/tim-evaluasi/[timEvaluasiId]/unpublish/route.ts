
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PATCH(
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
        userId,
      },
    });

    if (!team) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedTeam = await db.team.update({
      where: {
        id: params.timEvaluasiId,
        userId,
      },
      data: {
        isPublished: false,
      }
    });

    return NextResponse.json(unpublishedTeam);
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}