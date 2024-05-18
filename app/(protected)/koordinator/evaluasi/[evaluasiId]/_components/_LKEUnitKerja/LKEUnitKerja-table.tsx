"use client"
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

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Separator } from "@/components/ui/separator";

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

    function createCategorizedArray(data: (LKEUnitKerja & { unitKerja: UnitKerja })[]): { [unitKerjaId: string]: (LKEUnitKerja & { unitKerja: UnitKerja })[] } {
        const categorizedArray: { [unitKerjaId: string]: (LKEUnitKerja & { unitKerja: UnitKerja })[] } = {};

        data.forEach(item => {
            const { unitKerjaId } = item;
            if (!categorizedArray[unitKerjaId]) {
                categorizedArray[unitKerjaId] = [];
            }
            categorizedArray[unitKerjaId].push(item);
        });

        return categorizedArray;
    }

    const categorizedData: { [unitKerjaId: string]: (LKEUnitKerja & { unitKerja: UnitKerja })[] } = createCategorizedArray(LKEUnitKerja);

    const arrayOfArrayObject: { unitKerjaId: string; items: (LKEUnitKerja & { unitKerja: UnitKerja })[] }[] = Object.entries(categorizedData).map(([unitKerjaId, items]) => ({
        unitKerjaId,
        items
    }));

    const dataArray: {
        UnitKerja: string,
        Anggota: number,
        Ketua: number,
        Dalnis: number,

    }[] = arrayOfArrayObject.map((objek) => {
        let at = 0;
        let kt = 0;
        let dalnis = 0;
        let unit = "";

        objek.items.forEach(obj => {
            if (obj["nilaiAt"] !== undefined && obj["nilaiAt"] !== null && obj["nilaiAt"] !== '') {
                at++;
            }
            if (obj["nilaiKt"] !== undefined && obj["nilaiKt"] !== null && obj["nilaiKt"] !== '') {
                kt++;
            }
            if (obj["nilaiDalnis"] !== undefined && obj["nilaiDalnis"] !== null && obj["nilaiDalnis"] !== '') {
                dalnis++;
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
        };
    });

    return (
        <Card className="shadow-lg col-span-1 rounded-3xl">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>LKE</CardTitle>
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
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Anggota" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Ketua" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="Dalnis" stroke="#cab082" />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
            <Separator orientation="horizontal" />
            <CardFooter className="pt-6 justify-start">
                <Button variant="ghost" asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/lke/generate-lke`}
                    >
                        Lihat
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default LKEUnitKerjaPage;