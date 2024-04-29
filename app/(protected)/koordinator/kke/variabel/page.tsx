import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CreateVariabelPage from "./_components/variabelCreate-form";


const VariabelKKEPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const variabelKKE = await db.variabelKKE.findMany({
        orderBy: {
            id: "asc",
        },
        include: {
            kriteriaKKE: true,
            variabelLKE: true,
            variabelUnitKerja: true,
        }
    });

    const kriteria = await db.kriteriaKKE.findMany({
        where: {
            variabelKKE: {
                is: null
            }
        },
        orderBy: {
            kode: "asc",
        },
        include: {
            kelompokKriteriaKKE: true,
        }
    });

    const variabelLKE = await db.variabelLKE.findMany({
        where: {
            AND: [
                {
                    variabelKKE: {
                        is: null
                    }
                },
                {
                    jenisIsian: "number"
                }
            ]

        },
        orderBy: {
            id: "asc"
        }
    })

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <CreateVariabelPage
                kriteria_options={kriteria.map((kriteria) => ({
                    label: kriteria.nama,
                    value: kriteria.id,
                    data: kriteria
                }))}
                variabelLKE_options={variabelLKE.map((variabel) => ({
                    label: variabel.kode,
                    value: variabel.id,
                    data: variabel
                }))}
            />
            <DataTable data={variabelKKE} columns={columns} />
        </div>
    );
}

export default VariabelKKEPage;