import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
) {
    try {
        const session = await auth();
        const userId = session?.user.id;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for (const item of values.data) {
            if ((item.unitKerjaId!) && (item.variabelLKEId!)) {
                const LKEUnitKerja = await db.lKEUnitKerja.update({
                    where: {
                        LKEUnitKerjaId: {
                            variabelLKEId: item.variabelLKEId,
                            unitKerjaId: item.unitKerjaId
                        }
                    },
                    data: {
                        isianPanel: item.isianPanel,
                        catatanPanel: item.catatanPanel,
                        nilaiPanel: item.nilaiPanel,
                    },
                });
            }
        }
        return NextResponse.json("Berhasil");


    } catch (error) {
        console.log("[PANELISASI_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}