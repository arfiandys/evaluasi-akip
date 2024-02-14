import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { teamId: string, attachmentId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.team.findUnique({
      where: {
        id: params.teamId,
        userId: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const attachment = await db.attachment.delete({
      where: {
        teamId: params.teamId,
        id: params.attachmentId,
      }
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

