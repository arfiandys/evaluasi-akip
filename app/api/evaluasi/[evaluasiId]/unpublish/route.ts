import { currentId } from "@/lib/auth";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { evaluasiId: string } }
) {
    try {
        const session = await auth();
        const userId = session?.user.id;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const evaluasi = await db.evaluasi.findUnique({
            where: {
                id: params.evaluasiId,
            },
        });

        if (!evaluasi) {
            return new NextResponse("Not found", { status: 404 });
        }

        const unitKerjas = await db.unitKerja.findMany({
            orderBy: {
                id: "asc"
            }
        });

        if (!unitKerjas) {
            return new NextResponse("Not found", { status: 404 });
        }

        // DELETE LKE
        const deletedLKEUnitKerja = await db.lKEUnitKerja.deleteMany({
            where: {
                variabelLKE: {
                    evaluasiId: params.evaluasiId
                },
            },
        });

        // DELETE KKE
        const deletedKKEUnitKerja = await db.variabelKKEUnitKerja.deleteMany({
            where: {
                variabelKKE: {
                    evaluasiId: params.evaluasiId
                },
            },
        });

        // DELETE IKU
        const deletedIKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.deleteMany({
            where: {
                tujuanSasaranIndikatorIKUVariabelKKE: {
                    variabelKKE: {
                        evaluasiId: params.evaluasiId
                    },
                }
            },
        });

        // DELETE PERMINDOK
        const deletedPermindokUnitKerja = await db.permindokUnitKerja.deleteMany({
            where: {
                permindok: {
                    evaluasiId: params.evaluasiId
                }
            },
        });

        // DELETE LHE
        const deletedLHEUnitKerja = await db.lHE.deleteMany({
            where: {
                evaluasi: {
                    id: params.evaluasiId
                }
            },
        });

        // UPDATE EVALUASI STATUS
        const unpublishedEvaluasi = await db.evaluasi.update({
            where: {
                id: params.evaluasiId
            },
            data: {
                status: "draft"
            }
        })

        return NextResponse.json(unpublishedEvaluasi);

    } catch (error) {
        console.log("[LKE_UNITKERJA_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}