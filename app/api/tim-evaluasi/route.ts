import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const userId = await currentId();
        const { name } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const team = await db.team.create({
            data: {
                userId,
                name,
            }
        })

        return NextResponse.json(team);

    } catch (error) {
        console.log("[TEAM]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}