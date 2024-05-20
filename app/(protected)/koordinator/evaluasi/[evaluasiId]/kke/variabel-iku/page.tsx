import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CreateVariabelIKUPage from "./_components/variabelIKUCreate-form";


const VariabelKKEIKUPage = async ({
    params
}: {
    params: { evaluasiId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const variabelIKU = await db.tujuanSasaranIndikatorIKUVariabelKKE.findMany({
        where: {
            variabelKKE: {                
                evaluasiId: params.evaluasiId
            }
        },
        orderBy: {
            variabelKKE: {
                kode: "asc",
            }
        },
        include: {
            tujuanSasaranIndikatorIKU: true,
            variabelKKE: {
                include: {
                    kriteriaKKE: true
                }
            },
            tujuanSasaranIndikatorIKUUnitKerja: true,
        }
    });

    const variabelKKE = await db.variabelKKE.findMany({
        where: {
            isIndikatorKinerja: true
        },
        orderBy: {
            kode: "asc",
        },
        include: {
            kriteriaKKE: true
        }
    });

    const tujuanSasaranIndikatorIKU = await db.tujuanSasaranIndikatorIKU.findMany({
        where: {
            tujuanSasaranIndikatorIKUVariabelKKE: {
                none: {}
            }
        },
        orderBy: {
            kode: "asc"
        },
        include: {
            IKU: true,
        }
    })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <CreateVariabelIKUPage
              variabel_options={variabelKKE.map((variabel) => ({
                label: variabel.kriteriaKKE?.nama||"",
                value: variabel.id,
                tahun: variabel.tahun.toString(),
                data: variabel
              }))}
              tsi_options={tujuanSasaranIndikatorIKU.map((tsi) => ({
                label: tsi.nama,
                value: tsi.id,
                tahun: tsi.IKU?.tahun || "",
                data: tsi
              }))}
            />
            <DataTable data={variabelIKU} columns={columns} />
        </div>
    );
}

export default VariabelKKEIKUPage;