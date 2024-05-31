"use client"
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCSVDownloader } from "react-papaparse";

export const DownloadButton = () => {
    const { CSVDownloader } = useCSVDownloader();
    return (
        <Button
            asChild
            size="sm"
            className="w-full lg:w-auto cursor-pointer"
        >
            <CSVDownloader
                filename={'template_variabel_LKE'}
                bom={true}
                config={
                    {
                        delimiter: ',',
                    }
                }
                data={[
                    {
                      "level": "komponen",
                      "namaKomponen": "Nama komponen",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": 1,
                      "bobot": 0.3,
                      "jenisIsian": "number",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "subKomponen",
                      "namaKomponen": "Nama komponen",
                      "namaSubKomponen": "Nama sub komponen",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": 1,
                      "bobot": 0.2,
                      "jenisIsian": "number",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": "TRUE"
                    },
                    {
                      "level": "kriteria",
                      "namaKomponen": "Nama komponen",
                      "namaSubKomponen": "Nama sub komponen",
                      "namaKriteria": "Nama kriteria",
                      "namaSubKriteria": "",
                      "kode": 1,
                      "bobot": 0.1,
                      "jenisIsian": "select",
                      "catatanPositif": "Catatan positif",
                      "catatanNegatif": "Catatan negatif",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "subKriteria",
                      "namaKomponen": "Nama komponen",
                      "namaSubKomponen": "Nama sub komponen",
                      "namaKriteria": "Nama kriteria",
                      "namaSubKriteria": "Nama sub kriteria",
                      "kode": 1,
                      "bobot": 1,
                      "jenisIsian": "select",
                      "catatanPositif": "Catatan positif",
                      "catatanNegatif": "Catatan negatif",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "",
                      "namaKomponen": "",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": "",
                      "bobot": "",
                      "jenisIsian": "",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "",
                      "namaKomponen": "",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": "",
                      "bobot": "",
                      "jenisIsian": "",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "~Notes: lengkapi kolom di atas sebagaimana mestinya, kosongi cell apabila tidak diperlukan.",
                      "namaKomponen": "",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": "",
                      "bobot": "",
                      "jenisIsian": "",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "~Pengisian level harus sama yaitu lowercase \"komponen, subKomponen, kriteria, subKriteria\".",
                      "namaKomponen": "",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": "",
                      "bobot": "",
                      "jenisIsian": "",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "~Untuk bobot gunakan titik sebagai tanda desimal dengan range 0-1.",
                      "namaKomponen": "",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": "",
                      "bobot": "",
                      "jenisIsian": "",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "~Kode hanya angka.",
                      "namaKomponen": "",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": "",
                      "bobot": "",
                      "jenisIsian": "",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "~Jenis isian harus sama yaitu lowercase \"number, select, dropdown\".",
                      "namaKomponen": "",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": "",
                      "bobot": "",
                      "jenisIsian": "",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "~Catatan positif dan negatif hanya untuk jenis isian \"select\", catatan a,b,c hanya untuk jenis isian dropdown, jenis isian number tidak perlu catatan.",
                      "namaKomponen": "",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": "",
                      "bobot": "",
                      "jenisIsian": "",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    },
                    {
                      "level": "~isPembobot harus terisi apabila nilainya benar, apabila tidak kosongkan saja",
                      "namaKomponen": "",
                      "namaSubKomponen": "",
                      "namaKriteria": "",
                      "namaSubKriteria": "",
                      "kode": "",
                      "bobot": "",
                      "jenisIsian": "",
                      "catatanPositif": "",
                      "catatanNegatif": "",
                      "catatanA": "",
                      "catatanB": "",
                      "catatanC": "",
                      "isPembobot": ""
                    }
                  ]}
            >

                <Download className="size-4 mr-2" />
                Download template
            </CSVDownloader>
        </Button>
    );
};