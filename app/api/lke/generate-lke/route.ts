import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
) {
    try {
        const userId = await currentId();
        const values = await req.json();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (values.tahun!) {
            const variabelLKE = await db.variabelLKE.findMany({
                orderBy: {
                    id: "asc"
                }
            })

            const variabel_filtered = variabelLKE.filter(function (item) {
                return item.tahun === values.tahun;
            }).map(function (variabel) { return variabel })

            const data = Array.from(variabel_filtered).map((variabel) => ({
                variabelLKE: {
                    connect: {
                        id: variabel.id
                    }
                }
            }))

            if (values.unitKerjaId!) {
                const assignVariabel = await db.unitKerja.update({
                    where: {
                        id: values.unitKerjaId
                    },
                    data: {
                        variabelLKEs: {
                            create: data
                        }
                    }
                })
    
                return NextResponse.json(assignVariabel);
            }
        }


    } catch (error) {
        console.log("[VARIABEL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}