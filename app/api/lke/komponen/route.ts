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

        const existingKodeKomponen = await db.komponenLKE.findFirst({
            where: {
                AND: [
                    {
                        kode: values.kode,
                    },
                    {
                        evaluasiId: values.evaluasiId
                    }
                ]
            }
        })

        if (existingKodeKomponen) {
            return NextResponse.json({ error: "Kode talah digunakan!" });
        }

        const existingNameKomponen = await db.komponenLKE.findFirst({
            where: {
                AND: [
                    {
                        name: values.name,
                    },
                    {
                        evaluasiId: values.evaluasiId
                    }
                ]
            }
        })

        if (existingNameKomponen) {
            return NextResponse.json({ error: "Nama talah digunakan!" });
        }

        const komponenLKE = await db.komponenLKE.create({
            data: {
                evaluasiId: values.evaluasiId,
                kode: values.kode,
                name: values.name,
                bobot: values.bobot,
            }
        })

        const variabelLKE = await db.variabelLKE.create({
            data: {
                evaluasiId: values.evaluasiId,
                komponenLKEId: komponenLKE.id,
                kode: komponenLKE.kode || "",
                jenisIsian: "number",
                levelVariabel: "komponen",
            }
        })

        return NextResponse.json(komponenLKE);

    } catch (error) {
        console.log("[KOMPONEN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}