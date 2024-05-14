import { DataTable } from "../_LKEUnitKerja/_components/data-table";
import { columns } from "../_LKEUnitKerja/_components/columns";
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
import { KomponenLKE, KriteriaLKE, LKEUnitKerja, SubKomponenLKE, SubKriteriaLKE, UnitKerja, VariabelLKE } from "@prisma/client";

interface LKEUnitKerjaProps {
    evaluasiId: string;
    LKEUnitKerja: (LKEUnitKerja & {
        variabelLKE: VariabelLKE & {
            komponenLKE: KomponenLKE | null,
            subKomponenLKE: SubKomponenLKE | null,
            kriteriaLKE: KriteriaLKE | null,
            subKriteriaLKE: SubKriteriaLKE | null,
        },
        unitKerja: UnitKerja
    })[];
};

export const LKEUnitKerjaPage = ({ evaluasiId, LKEUnitKerja }: LKEUnitKerjaProps) => {

    return (
        <Card className="shadow-lg col-span-1">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>LKE</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <DataTable data={LKEUnitKerja} columns={columns} />
            </CardContent>
            <CardFooter className="pt-6 justify-end">
                <Button asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/lke/generate-lke`}
                    >
                        View All
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default LKEUnitKerjaPage;