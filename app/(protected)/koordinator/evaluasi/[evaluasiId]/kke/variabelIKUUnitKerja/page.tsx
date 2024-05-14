import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { GeneratePage } from "./_components/generate-form";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";


const GenerateLKEPage = async ({
    params
}: {
    params: { evaluasiId: string }
}) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const VariabelIKUUnitKerja = await db.tujuanSasaranIndikatorIKUVariabelKKEUnitKerja.findMany({
        where: {
            tujuanSasaranIndikatorIKUVariabelKKE: {
                variabelKKE: {
                    evaluasiId: params.evaluasiId
                }
            }
        },
        orderBy: [
            {
                unitKerjaId: "asc"
            },
            {
                tujuanSasaranIndikatorIKUVariabelKKE: {
                    variabelKKE: {
                        kode: "asc"
                    }
                }
            }
        ],
        include: {
            tujuanSasaranIndikatorIKUVariabelKKE: {
                include: {
                    tujuanSasaranIndikatorIKU: true,
                    variabelKKE: {
                        include: {
                            kriteriaKKE: true
                        }
                    }
                }
            },
            unitKerja: true,
        }
    })

    const variabelIKU = await db.tujuanSasaranIndikatorIKUVariabelKKE.findMany({
        orderBy: {
            id: "asc",
        },
        include: {
            tujuanSasaranIndikatorIKU: {
                include: {
                    IKU: true
                }
            },
            variabelKKE: true
        }
    });

    const unitKerja = await db.unitKerja.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <GeneratePage variabelIKU={variabelIKU} unitKerja={unitKerja} />
            <DataTable data={VariabelIKUUnitKerja} columns={columns} />
        </div>
    );
}

export default GenerateLKEPage;