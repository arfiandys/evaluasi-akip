import { currentId } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { subKomponenId: string } }
) {
    try {
        const userId = await currentId();
        const values = await req.json();
        

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const subKomponen = await db.subKomponenLKE.findUnique({
            where: {
              id: params.subKomponenId,
            }
          });
      
          if (!subKomponen) {
            return new NextResponse("Unauthorized", { status: 401 });
          }

        const kriteriaLKE = await db.kriteriaLKE.create({
            data: {
                subKomponenLKEId: params.subKomponenId,
                kode: values.kode,
                name: values.name,
                bobot: values.bobot,
            },
            include: {
                subKomponenLKE: {
                    include: {
                        komponenLKE: true
                    }
                }
            }
        })

        const variabelLKE = await db.variabelLKE.create({
            data: {
                evaluasiId: values.evaluasiId,
                kriteriaLKEId: kriteriaLKE.id,
                kode: kriteriaLKE.subKomponenLKE?.komponenLKE?.kode.concat(".", kriteriaLKE?.subKomponenLKE?.kode.concat(".", kriteriaLKE?.kode))||"",
                tahun: kriteriaLKE.subKomponenLKE?.komponenLKE?.tahun||"",
                jenisIsian: values.jenisIsian,
                levelVariabel: values.levelVariabel,
                catatanPositif: values.catatanPositif,
                catatanNegatif: values.catatanNegatif,
                catatanA: values.catatanA,
                catatanB: values.catatanB,
                catatanC: values.catatanC,
            }
        })

        return NextResponse.json(kriteriaLKE);

    } catch (error) {
        console.log("[KRITERIA]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}