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
                filename={'template_variabel_KKE'}
                bom={true}
                config={
                    {
                        delimiter: ',',
                    }
                }
                data={[
                    {
                        "level": "kelompok",
                        "jenisKK": "",
                        "namaKelompok": "Nama kelompok kriteria",
                        "namaKriteria": "",
                        "kode": 1,
                        "kodeLKE": 1,
                        "kodePermindok": 1,
                        "petunjukEvaluasi": "Petunjuk Evaluasi",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "kriteria",
                        "jenisKK": "KK Evaluasi Dokumen",
                        "namaKelompok": "Nama kelompok kriteria",
                        "namaKriteria": "Nama kriteria",
                        "kode": "",
                        "kodeLKE": 1,
                        "kodePermindok": "",
                        "petunjukEvaluasi": "Petunjuk Evaluasi",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "kriteria",
                        "jenisKK": "KK Evaluasi Dokumen",
                        "namaKelompok": "Nama kelompok kriteria",
                        "namaKriteria": "Nama kriteria",
                        "kode": "",
                        "kodeLKE": 1,
                        "kodePermindok": "",
                        "petunjukEvaluasi": "Petunjuk Evaluasi",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "kriteria",
                        "jenisKK": "KK Indikator Kinerja",
                        "namaKelompok": "Nama kelompok kriteria",
                        "namaKriteria": "Nama kriteria",
                        "kode": "",
                        "kodeLKE": 1,
                        "kodePermindok": "",
                        "petunjukEvaluasi": "Petunjuk Evaluasi",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "iku",
                        "jenisKK": "",
                        "namaKelompok": "Nama kelompok kriteria",
                        "namaKriteria": "Nama kriteria",
                        "kode": "",
                        "kodeLKE": "",
                        "kodePermindok": "",
                        "petunjukEvaluasi": "",
                        "IKU": "Nama IKU",
                        "kodeIKU": "1.1.1"
                    },
                    {
                        "level": "",
                        "jenisKK": "",
                        "namaKelompok": "",
                        "namaKriteria": "",
                        "kode": "",
                        "kodeLKE": "",
                        "kodePermindok": "",
                        "petunjukEvaluasi": "",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "~Notes: lengkapi kolom di atas sebagaimana mestinya, kosongi cell apabila tidak diperlukan.",
                        "jenisKK": "",
                        "namaKelompok": "",
                        "namaKriteria": "",
                        "kode": "",
                        "kodeLKE": "",
                        "kodePermindok": "",
                        "petunjukEvaluasi": "",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "~Pengisian level harus sama yaitu lowercase \"kelompok, kriteria\".",
                        "jenisKK": "",
                        "namaKelompok": "",
                        "namaKriteria": "",
                        "kode": "",
                        "kodeLKE": "",
                        "kodePermindok": "",
                        "petunjukEvaluasi": "",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "~Kode hanya angka.",
                        "jenisKK": "",
                        "namaKelompok": "",
                        "namaKriteria": "",
                        "kode": "",
                        "kodeLKE": "",
                        "kodePermindok": "",
                        "petunjukEvaluasi": "",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "~JenisKK harus sama yaitu \"KK Evaluasi Dokumen, KK Indikator Kinerja\".",
                        "jenisKK": "",
                        "namaKelompok": "",
                        "namaKriteria": "",
                        "kode": "",
                        "kodeLKE": "",
                        "kodePermindok": "",
                        "petunjukEvaluasi": "",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "~KodeLKE sesuaikan dengan kode variabel LKE",
                        "jenisKK": "",
                        "namaKelompok": "",
                        "namaKriteria": "",
                        "kode": "",
                        "kodeLKE": "",
                        "kodePermindok": "",
                        "petunjukEvaluasi": "",
                        "IKU": "",
                        "kodeIKU": ""
                    },
                    {
                        "level": "~KodePermindok sesuaikan dengan kode permindok",
                        "jenisKK": "",
                        "namaKelompok": "",
                        "namaKriteria": "",
                        "kode": "",
                        "kodeLKE": "",
                        "kodePermindok": "",
                        "petunjukEvaluasi": "",
                        "IKU": "",
                        "kodeIKU": ""
                    }
                ]}
            >

                <Download className="size-4 mr-2" />
                Download template
            </CSVDownloader>
        </Button>
    );
};