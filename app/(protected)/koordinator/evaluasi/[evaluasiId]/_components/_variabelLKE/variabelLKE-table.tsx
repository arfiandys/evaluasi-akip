import { DataTable } from "../_variabelLKE/_components/data-table";
import { columns } from "../_variabelLKE/_components/columns";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, Settings } from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { KomponenLKE, KriteriaLKE, LKEUnitKerja, SubKomponenLKE, SubKriteriaLKE, UnitKerja, VariabelLKE } from "@prisma/client";

interface VariabelLKEProps {
    evaluasiId: string;
    variabelLKE: (VariabelLKE & {
        komponenLKE: KomponenLKE | null,
        subKomponenLKE: SubKomponenLKE | null,
        kriteriaLKE: KriteriaLKE | null,
        subKriteriaLKE: SubKriteriaLKE | null,
        unitKerjas: LKEUnitKerja[]
    })[];
};

export const VariabelLKEPage = ({ evaluasiId, variabelLKE }: VariabelLKEProps) => {

    return (
        <Card className="shadow-lg col-span-1">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Variabel LKE</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <DataTable data={variabelLKE} columns={columns} />
            </CardContent>
            <CardFooter className="pt-6 justify-end">
                <Button asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/lke/variabel`}
                    >
                        View All
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default VariabelLKEPage;