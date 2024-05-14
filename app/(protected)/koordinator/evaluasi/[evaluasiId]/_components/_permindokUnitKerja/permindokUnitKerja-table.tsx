import { DataTable } from "../_permindokUnitKerja/_components/data-table";
import { columns } from "../_permindokUnitKerja/_components/columns";
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
import { KomponenLKE, KriteriaLKE, LKEUnitKerja, Permindok, PermindokUnitKerja, SubKomponenLKE, SubKriteriaLKE, UnitKerja, VariabelLKE } from "@prisma/client";

interface PermindokUnitKerjaProps {
    evaluasiId: string;
    permindokUnitKerja: (PermindokUnitKerja & {
        permindok: Permindok,
        unitKerja: UnitKerja
    })[];
};

export const PermindokUnitKerjaPage = ({ evaluasiId, permindokUnitKerja }: PermindokUnitKerjaProps) => {

    return (
        <Card className="shadow-lg col-span-1">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Permindok Unit Kerja</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <DataTable data={permindokUnitKerja} columns={columns} />
            </CardContent>
            <CardFooter className="pt-6 justify-end">
                <Button asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/permindok/generate-permindok`}
                    >
                        View All
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default PermindokUnitKerjaPage;