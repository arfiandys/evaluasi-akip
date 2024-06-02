import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { komponenId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const komponen = await db.komponenLKE.findUnique({
            where: {
                id: params.komponenId,
            }
        });

        if (!komponen) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const existingKodeSubKomponen = await db.subKomponenLKE.findFirst({
            where: {
                AND: [
                    {
                        kode: values.kode,
                    },
                    {
                        komponenLKEId: params.komponenId
                    }
                ]
            }
        })

        if (existingKodeSubKomponen) {
            return NextResponse.json({ error: "Kode talah digunakan!" });
        }

        const existingNameSubKomponen = await db.subKomponenLKE.findFirst({
            where: {
                AND: [
                    {
                        name: values.name,
                    },
                    {
                        komponenLKEId: params.komponenId
                    }
                ]
            }
        })

        if (existingNameSubKomponen) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const subKomponenLKE = await db.subKomponenLKE.create({
            data: {
                komponenLKEId: params.komponenId,
                kode: values.kode,
                name: values.name,
                bobot: values.bobot,
            },
            include: {
                komponenLKE: true
            }
        })

        const variabelLKE = await db.variabelLKE.create({
            data: {
                evaluasiId: values.evaluasiId,
                subKomponenLKEId: subKomponenLKE.id,
                kode: subKomponenLKE.komponenLKE?.kode.concat(".", subKomponenLKE.kode) || "",
                jenisIsian: "number",
                levelVariabel: "subKomponen",
            }
        })

        return NextResponse.json(subKomponenLKE);

    } catch (error) {
        console.log("[SUB_KOMPONEN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}