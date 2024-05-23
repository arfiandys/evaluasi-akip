import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { EvaluasiCard } from "./_components/evaluasi-card";
import { UserRole } from "@prisma/client";


const EvaluasiPage = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return redirect("/")
    }

    const User = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            unitKerjas: true
        }
    })

    if (!User) {
        return redirect("/")
    }

    const unitKerja_arr: string[] = []

    User?.unitKerjas.forEach((unit) => {
        if (unit.assignedRole === UserRole.ANGGOTA) {
            unitKerja_arr.push(unit.unitKerjaId)
        }
    })

    const evaluasi = await db.evaluasi.findMany({
        orderBy: {
            id: "asc",
        },
        include: {
            variabelsLKE: {
                orderBy: {
                    id: "asc"
                }
            },
            variabelsKKE: {
                orderBy: {
                    id: "asc"
                }
            },
            permindoks: {
                orderBy: {
                    id: "asc"
                },
            },
        }
    });
    const LKEUnitKerja = await db.lKEUnitKerja.findMany({
        orderBy: {
            variabelLKE: {
                kode: "asc"
            }
        },
        include: {
            variabelLKE: true,
        }
    });
    const KKEUnitKerja = await db.variabelKKEUnitKerja.findMany({
        orderBy: {
            variabelKKE: {
                kode: "asc"
            }
        },
        include: {
            variabelKKE: true,
        }
    })



    return (
        <div className="flex h-screen flex-1 flex-col space-y-6 p-8">
            <div className="flex flex-row gap-x-2 justify-between">
                <div className="flex flex-col gap-y-2 justify-between">
                    <div className="">
                        <h1 className="text-2xl font-medium">
                            Daftar evaluasi
                        </h1>
                    </div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={`/anggota/evaluasi`}>Evaluasi</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Daftar</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
            {/* <DataTable data={evaluasi} columns={columns} /> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 px-4 lg:px-10">
                {evaluasi.map((item) => {
                    const filteredLKE = LKEUnitKerja.filter((items)=> unitKerja_arr.includes(items.unitKerjaId) && items.variabelLKE.evaluasiId === item.id);
                    const totalLKE = filteredLKE.length;
                    const filteredKKE = KKEUnitKerja.filter((items)=> unitKerja_arr.includes(items.unitKerjaId) && items.variabelKKE.evaluasiId === item.id);
                    const totalKKE = filteredKKE.length;
                    let filledLKE = 0;
                    filteredLKE.forEach((obj)=>{
                        if ((obj["nilaiAt"] !== undefined && obj["nilaiAt"] !== null && obj["nilaiAt"] !== '')) {
                            filledLKE++
                        }
                    })
                    if (item.status !== "draft") {
                        return (
                            <EvaluasiCard
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                imageUrl={"/logo.svg"}
                                LKELength={totalLKE}
                                KKELength={totalKKE}
                                PermindokLength={item.permindoks.length}
                                UnitKerjaLength={unitKerja_arr.length}
                                progress={Number(filledLKE/totalLKE)*100}
                                tahun={item.tahun!}
                                description={item.description!}
                                status={item.status}
                            />
                        )
                    }
                })}
            </div>
            {evaluasi.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    Tidak ada evaluasi yang ditemukan
                </div>
            )}
        </div >
    );
}

export default EvaluasiPage;