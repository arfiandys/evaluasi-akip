"use client"
import React from 'react';
import { BlobProvider, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import LHEPDF from "./lhe-format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KomponenLKE, LKEUnitKerja, UnitKerja, VariabelLKE } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

interface Props {
    unitKerjaId: string;
    unitKerja: UnitKerja[];
    LKEUnitKerja: (LKEUnitKerja & { variabelLKE: VariabelLKE & { komponenLKE: KomponenLKE | null } })[];
    dataObjek: {
        nomor: string,
        tahun: string,
        kepada: string,
        dariNama: string,
        evaluasiId: string,
        unitKerjaId: string,
        tanggal: string
    } | undefined
}

export const PDF = ({ dataObjek, unitKerja, unitKerjaId, LKEUnitKerja }: Props) => {
    const selectedData = LKEUnitKerja.filter((option) => option.unitKerjaId === unitKerjaId);
    const selectedUnitKerja = unitKerja.find((option) => option.id === unitKerjaId);
    return (
        <>
            {/* <PDFViewer className='w-full h-[500px]' >
                <LHEPDF data={selectedData} dataObjek={dataObjek} unitKerja={selectedUnitKerja}/>
            </PDFViewer> */}

            <BlobProvider document={<LHEPDF data={selectedData} dataObjek={dataObjek} unitKerja={selectedUnitKerja} />}>
                {({ url, blob }) => (
                    <Button size='sm' asChild>
                        <a href={url!} target="_blank" className='flex flex-row gap-2 items-center'>
                            <Printer size={14} />
                            <span>Preview</span>
                        </a>
                    </Button>
                )}
            </BlobProvider >
            <Button asChild size='sm' className='flex flex-row gap-2 items-center'>
                <PDFDownloadLink document={<LHEPDF data={selectedData} dataObjek={dataObjek} unitKerja={selectedUnitKerja} />} fileName={`LHE_${selectedUnitKerja?.name}.pdf`}>
                    <Download size={14} />
                    <span>Download</span>
                </PDFDownloadLink>
            </Button>

        </>
    );
}


// < Card className='rounded-3xl shadow-lg'>
//     <CardHeader>
//         <CardTitle>{unitKerja.name}</CardTitle>
//         <CardDescription>{unitKerja.jenisUnitKerja}</CardDescription>
//     </CardHeader>
//     <CardContent className='flex flex-row gap-x-4'>
//         <Button asChild size='sm'>
//             <PDFDownloadLink document={<LHEPDF data={selectedData} />} fileName='invoice.pdf'>
//                 Download
//             </PDFDownloadLink>
//         </Button>
//         <Button asChild size='sm' variant="default">
//             <BlobProvider document={<LHEPDF data={selectedData} />}>
//                 {({ url, blob }) => (
//                     <a href={url || ""} target="_blank">
//                         Lihat
//                     </a>
//                 )}
//             </BlobProvider>
//         </Button>
//     </CardContent>
// </Card >