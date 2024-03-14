import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateVariabelPage from "./_components/kriteriaCreate-form";
import SubCreateVariabelPage from "./_components/subKriteriaCreate-form";
import { KriteriaOrSubCreateForm } from "./_components/kriteriaOrSubCreate-form";


const VariabelLKEPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }
    const variabelLKE = await db.variabelLKE.findMany({
        orderBy: {
            id: "asc",
        },
        include: {
            kriteriaLKE: true,
            subKriteriaLKE: true,
            unitKerjas: true,
        }
    });

    const kriteria = await db.kriteriaLKE.findMany({
        where: {
            subKriteriaLKE: {
                none: {}
            }
        },
        orderBy: {
            kode: "asc",
        },
        include: {
            subKomponenLKE: {
                include: {
                    komponenLKE: true
                }
            }
        }
    });

    const subKriteria = await db.subKriteriaLKE.findMany({
        orderBy: {
            kode: "asc",
        },
        include: {
            kriteriaLKE: {
                include: {
                    subKomponenLKE: {
                        include: {
                            komponenLKE: true
                        }
                    }
                }
            }
        }
    });

    return (
        <div className="flex h-full flex-1 flex-col space-y-8 p-8">
            <KriteriaOrSubCreateForm kriteria={kriteria} subKriteria={subKriteria}/>
            <DataTable data={variabelLKE} columns={columns} />
        </div>
    );
}

export default VariabelLKEPage;