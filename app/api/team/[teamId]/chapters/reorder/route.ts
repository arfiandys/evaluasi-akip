
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PUT(
  req: Request,
  { params }: { params: { teamId: string; } }
) {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { list } = await req.json();

    const ownTeam = await db.team.findUnique({
      where: {
        id: params.teamId,
        userId: userId
      }
    });

    if (!ownTeam) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position }
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 }); 
  }
}