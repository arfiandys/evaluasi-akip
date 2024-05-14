import { DataTable } from "../_KKEUnitKerja/_components/data-table";
import { columns } from "../_KKEUnitKerja/_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, Settings } from "lucide-react";


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { KriteriaKKE, UnitKerja, VariabelKKE, VariabelKKEUnitKerja } from "@prisma/client";

interface KKEUnitKerjaProps {
    evaluasiId: string;
    KKEUnitKerja: (VariabelKKEUnitKerja & {
        variabelKKE: VariabelKKE & {
            kriteriaKKE: KriteriaKKE | null,
        },
        unitKerja: UnitKerja
    })[];
};

export const KKEUnitKerjaPage = ({ evaluasiId, KKEUnitKerja }: KKEUnitKerjaProps) => {

    return (
        <Card className="shadow-lg col-span-1">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>KKE</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <DataTable data={KKEUnitKerja} columns={columns} />
            </CardContent>
            <CardFooter className="pt-6 justify-end">
                <Button asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/kke/variabelKKEUnitKerja`}
                    >
                        View All
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default KKEUnitKerjaPage;