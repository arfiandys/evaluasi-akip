import { DataTable } from "../_variabelKKE/_components/data-table";
import { columns } from "../_variabelKKE/_components/columns";
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
import { KomponenLKE, KriteriaKKE, KriteriaLKE, LKEUnitKerja, SubKomponenLKE, SubKriteriaLKE, UnitKerja, VariabelKKE, VariabelKKEUnitKerja, VariabelLKE } from "@prisma/client";

interface VariabelKKEProps {
    evaluasiId: string;
    variabelKKE: (VariabelKKE & {
        kriteriaKKE: KriteriaKKE|null,
        variabelLKE: VariabelLKE|null,
        variabelUnitKerja: VariabelKKEUnitKerja[],
    })[];
};

export const VariabelKKEPage = ({ evaluasiId, variabelKKE }: VariabelKKEProps) => {

    return (
        <Card className="shadow-lg col-span-1">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Variabel KKE</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <DataTable data={variabelKKE} columns={columns} />
            </CardContent>
            <CardFooter className="pt-6 justify-end">
                <Button asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/kke/variabel`}
                    >
                        View All
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default VariabelKKEPage;