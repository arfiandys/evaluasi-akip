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
import { Permindok, LHE, UnitKerja, } from "@prisma/client";
import { Separator } from "@/components/ui/separator";

interface LHEUnitKerjaProps {
    evaluasiId: string;
    LHE: (LHE & { unitKerja: UnitKerja })[];
};

export const LHEUnitKerjaPage = ({ evaluasiId, LHE }: LHEUnitKerjaProps) => {
    function createCategorizedArray(data: (LHE & { unitKerja: UnitKerja })[]): { [unitKerjaId: string]: (LHE & { unitKerja: UnitKerja })[] } {
        const categorizedArray: { [unitKerjaId: string]: (LHE & { unitKerja: UnitKerja })[] } = {};

        data.forEach(item => {
            const { unitKerjaId } = item;
            if (!categorizedArray[unitKerjaId]) {
                categorizedArray[unitKerjaId] = [];
            }
            categorizedArray[unitKerjaId].push(item);
        });

        return categorizedArray;
    }

    const categorizedData: { [unitKerjaId: string]: (LHE & { unitKerja: UnitKerja })[] } = createCategorizedArray(LHE);

    const arrayOfArrayObject: { unitKerjaId: string; items: (LHE & { unitKerja: UnitKerja })[] }[] = Object.entries(categorizedData).map(([unitKerjaId, items]) => ({
        unitKerjaId,
        items
    }));

    const dataArray: {
        UnitKerja: string,
        Dokumen: number,

    }[] = arrayOfArrayObject.map((objek) => {
        let pic = 0;
        let unit = "";

        objek.items.forEach(obj => {
            if (obj["url"] !== undefined && obj["url"] !== null && obj["url"] !== '') {
                pic++;
            }
            if (obj.unitKerja.name) {
                unit = obj.unitKerja.name
            }
        });
        return {
            UnitKerja: unit,
            Dokumen: pic,
        };
    });
    return (
        <Card className="shadow-lg col-span-1 rounded-3xl">
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>LHE Unit Kerja</CardTitle>
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
                        <Line type="monotone" dataKey="Dokumen" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
            <Separator orientation="horizontal" />
            <CardFooter className="pt-6 justify-start">
                <Button variant="ghost" asChild>
                    <Link
                        href={`/koordinator/evaluasi/${evaluasiId}/lhe`}
                    >
                        Lihat
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default LHEUnitKerjaPage;