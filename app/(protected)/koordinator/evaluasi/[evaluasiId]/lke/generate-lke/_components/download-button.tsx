"use client"
import { Button } from "@/components/ui/button";
import { KomponenLKE, KriteriaLKE, LKEUnitKerja, SubKomponenLKE, SubKriteriaLKE, UnitKerja, VariabelLKE } from "@prisma/client";
import { Download } from "lucide-react";
import { useCSVDownloader } from "react-papaparse";


interface Props {
    data: (LKEUnitKerja & {
        unitKerja: UnitKerja,
        variabelLKE: VariabelLKE & {
            komponenLKE: KomponenLKE | null,
            subKomponenLKE: SubKomponenLKE | null,
            kriteriaLKE: KriteriaLKE | null,
            subKriteriaLKE: SubKriteriaLKE | null,
        }
    })[]
}
export const DownloadButton = ({ data }: Props) => {
    const { CSVDownloader } = useCSVDownloader();
    const dataArray: {
        unitKerja: string,
        kode: string,
        kriteria: string|undefined,
        isianAnggota: string,
        nilaiAnggota: string,
        catatanAnggota: string,
        isianKetua: string,
        nilaiKetua: string,
        catatanKetua: string,
        isianDalnis: string,
        nilaiDalnis: string,
        catatanDalnis: string,

    }[] = data.map((objek) => {
        return {
            unitKerja: objek.unitKerja.name,
            kode: objek.variabelLKE.kode,
            kriteria: (objek.variabelLKE.levelVariabel === "komponen") ? objek.variabelLKE.komponenLKE?.name :
                ((objek.variabelLKE.levelVariabel === "subKomponen") ? objek.variabelLKE.subKomponenLKE?.name :
                    ((objek.variabelLKE.levelVariabel === "kriteria") ? objek.variabelLKE.kriteriaLKE?.name :
                        ((objek.variabelLKE.levelVariabel === "subKriteria") ? objek.variabelLKE.subKriteriaLKE?.name :
                            ""))),
            isianAnggota: objek.isianAt||"",
            nilaiAnggota: objek.nilaiAt||"",
            catatanAnggota: objek.catatanAt||"",
            isianKetua: objek.isianKt||"",
            nilaiKetua: objek.nilaiKt||"",
            catatanKetua: objek.catatanKt||"",
            isianDalnis: objek.isianDalnis||"",
            nilaiDalnis: objek.nilaiDalnis||"",
            catatanDalnis: objek.catatanDalnis||"",
        };
    });
    return (
        <Button
            asChild
            size="sm"
            className="w-full lg:w-auto cursor-pointer"
        >
            <CSVDownloader
                filename={'LKE'}
                bom={true}
                config={
                    {
                        delimiter: ',',
                    }
                }
                data={dataArray}
            >

                <Download className="size-4 mr-2" />
                Export
            </CSVDownloader>
        </Button>
    );
};