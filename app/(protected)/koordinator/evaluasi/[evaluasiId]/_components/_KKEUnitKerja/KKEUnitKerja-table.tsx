"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlusCircle, Settings } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { KriteriaKKE, UnitKerja, VariabelKKE, VariabelKKEUnitKerja } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

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

    function createCategorizedArray(data: (VariabelKKEUnitKerja & { unitKerja: UnitKerja })[]): { [unitKerjaId: string]: (VariabelKKEUnitKerja & { unitKerja: UnitKerja })[] } {
        const categorizedArray: { [unitKerjaId: string]: (VariabelKKEUnitKerja & { unitKerja: UnitKerja })[] } = {};

        data.forEach(item => {
            const { unitKerjaId } = item;
            if (!categorizedArray[unitKerjaId]) {
                categorizedArray[unitKerjaId] = [];
            }
            categorizedArray[unitKerjaId].push(item);
        });

        return categorizedArray;
    }

    const categorizedData: { [unitKerjaId: string]: (VariabelKKEUnitKerja & { unitKerja: UnitKerja })[] } = createCategorizedArray(KKEUnitKerja);

    const arrayOfArrayObject: { unitKerjaId: string; items: (VariabelKKEUnitKerja & { unitKerja: UnitKerja })[] }[] = Object.entries(categorizedData).map(([unitKerjaId, items]) => ({
        unitKerjaId,
        items
    }));

    const dataArray: {
        UnitKerja: string,
        Anggota: number,
        Ketua: number,
        Dalnis: number,
        PIC: number,

    }[] = arrayOfArrayObject.map((objek) => {
        let at = 0;
        let kt = 0;
        let dalnis = 0;
        let pic = 0;
        let unit = "";

        objek.items.forEach(obj => {
            if (obj["isianAt"] !== undefined && obj["isianAt"] !== null && obj["isianAt"] !== '') {
                at++;
            }
            if (obj["isianKt"] !== undefined && obj["isianKt"] !== null && obj["isianKt"] !== '') {
                kt++;
            }
            if (obj["isianDalnis"] !== undefined && obj["isianDalnis"] !== null && obj["isianDalnis"] !== '') {
                dalnis++;
            }
            if (obj["isianPIC"] !== undefined && obj["isianPIC"] !== null && obj["isianPIC"] !== '') {
                pic++;
            }
            if (obj.unitKerja.name) {
                unit = obj.unitKerja.name
            }
        });
        return {
            UnitKerja: unit,
            Anggota: at,
            Ketua: kt,
            Dalnis: dalnis,
            PIC: pic,
        };
    });

    return (
        <Card className="shadow-lg col-span-1 rounded-3xl">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>KKE</CardTitle>
                    {/* <CardDescription>Card Description</CardDescription> */}
                </div>
            </CardHeader>
            <CardContent className="px-6">
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                        width={500}
                        height={300}
                        data={dataArray}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="UnitKerja" />
                        <YAxis interval={1} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Anggota" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Ketua" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="Dalnis" stroke="#cab082" />
                        <Line type="monotone" dataKey="PIC" stroke="#d88484" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
            <Separator orientation="horizontal" />
            <CardFooter className="pt-6 justify-start">
                <Button variant="ghost" asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/kke/variabelKKEUnitKerja`}
                    >
                        Lihat
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default KKEUnitKerjaPage;