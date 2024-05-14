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

        const komponenLKE = await db.komponenLKE.create({
            data: {
                kode: values.kode,
                tahun: values.tahun,
                name: values.name,
                bobot: values.bobot,
            }
        })

        const variabelLKE = await db.variabelLKE.create({
            data: {
                evaluasiId: values.evaluasiId,
                komponenLKEId: komponenLKE.id,
                kode: komponenLKE.kode || "",
                tahun: komponenLKE.tahun || "",
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