import { auth } from "@/auth";
import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
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
        userId: userId,
      },
      include: {
        chapters: {
        }
      }
    });

    if (!team) {
      return new NextResponse("Not found", { status: 404 });
    }

    const deletedTeam = await db.team.delete({
      where: {
        id: params.teamId,
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
    { params }: { params: { teamId: string } }
  ) {
    try {
      const session = await auth();
      const userId = session?.user.id;
      const { teamId } = params;
      const values = await req.json();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const team = await db.team.update({
        where: {
          id: teamId,
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