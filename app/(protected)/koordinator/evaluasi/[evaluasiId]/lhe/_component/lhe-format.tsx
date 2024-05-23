import React, { Fragment } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { KomponenLKE, LKEUnitKerja, UnitKerja, VariabelLKE } from '@prisma/client';

interface Props {
    data: (LKEUnitKerja & { variabelLKE: VariabelLKE & { komponenLKE: KomponenLKE | null } })[]
    dataObjek: {
        nomor: string,
        tahun: string,
        kepada: string,
        dariNama: string,
        evaluasiId: string,
        unitKerjaId: string,
        tanggal: string
    }|undefined;
    unitKerja: UnitKerja|undefined;
}

const LHEPDF = ({ data, dataObjek, unitKerja }: Props) => {

    const dataKomponen = data.filter((item) =>
        item.variabelLKE.levelVariabel === "komponen"
    )

    let nilaiLHE: number = 0;

    dataKomponen.forEach(objek => {
        nilaiLHE += Number(objek.nilaiPanel);
    });

    const styles = StyleSheet.create({
        page: { fontSize: 11, paddingTop: 65, paddingLeft: 40, paddingRight: 40, paddingBottom: 65, lineHeight: 1.5, flexDirection: 'column' },

        pageNumber: {
            position: 'absolute',
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey',
        },

        spaceBetween: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', color: "#3E3E3E" },

        titleContainer: { flexDirection: 'row' },

        logo: { width: 70 },

        title: {
            fontSize: 12,
            textAlign: 'center',
            textTransform: 'uppercase',
            fontStyle: 'bold',
            fontWeight: 'extrabold',
            marginHorizontal: 100
        },

        subtitle: {
            fontSize: 11,
            margin: 12,
            fontStyle: 'bold',
            fontWeight: 'extrabold',
        },

        suratTitle: { fontStyle: 'bold', fontWeight: 'extrabold', fontSize: 16, textAlign: 'center', color: '#2282B5' },

        addressTitle: { fontSize: 11, fontStyle: 'bold' },

        address: { fontWeight: 400, fontSize: 10 },

        theader: { marginTop: 20, fontSize: 10, fontStyle: 'bold', paddingTop: 4, paddingLeft: 7, flex: 1, height: 20, backgroundColor: '#DEDEDE', borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

        theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },

        tbody: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1, borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },

        total: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1.5, borderColor: 'whitesmoke', borderBottomWidth: 1 },

        tbody2: { flex: 2, borderRightWidth: 1, },

        // Kop Surat
        invoiceCop: {
            width: 250
        },
        invoiceCopContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        invoiceDateContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-start'
        },
        label: {
            width: 60
        },
        value: {
            width: 200
        },

        // Isi
        isiSurat: {
            textIndent: 20,
            textAlign: 'justify',
        }

    });

    const JudulSurat = () => (
        <View style={styles.titleContainer}>
            <View style={styles.spaceBetween}>
                <Image style={styles.logo} src="/BPS.png" />
                <Text style={styles.suratTitle}>BADAN PUSAT STATISTIK</Text>
            </View>
        </View>
    );

    const KopSurat = () => (
        <View>
            <View style={styles.titleContainer}>
                <View style={styles.spaceBetween}>
                    <View style={styles.invoiceCop}>
                        <View style={styles.invoiceCopContainer}>
                            <Text style={styles.label}>Nomor</Text>
                            <Text style={styles.value}>: {dataObjek?.nomor||""}</Text>
                        </View >
                        <View style={styles.invoiceCopContainer}>
                            <Text style={styles.label}>Sifat </Text>
                            <Text style={styles.value}>: Rahasia</Text>
                        </View >
                        <View style={styles.invoiceCopContainer}>
                            <Text style={styles.label}>Lampiran </Text>
                            <Text style={styles.value}>: 1 (satu) set</Text>
                        </View >
                        <View style={styles.invoiceCopContainer}>
                            <Text style={styles.label}>Hal </Text>
                            <Text style={styles.value}>
                                : Laporan Hasil Evaluasi atas Implementasi SAKIP Tahun {dataObjek?.tahun||""}
                            </Text>
                        </View >
                    </View>
                    <View>
                        <Text style={styles.addressTitle}>Jakarta, {dataObjek?.tanggal||""}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    interface IsiSurat {
        nilai: string
    }
    const IsiSurat = ({ nilai }: IsiSurat) => (
        <View>
            <View style={styles.titleContainer}>
                <View style={styles.spaceBetween}>
                    <View style={{ maxWidth: 200 }}>
                        <Text style={styles.addressTitle}>Yth. {dataObjek?.kepada||""} </Text>
                        <Text style={styles.address}>
                            di Tempat
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 10 }}>
                <Text style={styles.isiSurat}>
                    Penilaian Evaluasi atas Implementasi SAKIP Tahun {dataObjek?.tahun||""} yang dilakukan Inspektorat
                    utama BPS mengacu pada Peraturan Menteri Pendayagunaan Aparatur Negara dan
                    Reformasi Birokrasi Nomor 12 Tahun 2015. Ruang lingkup evaluasi mencakup 5 (lima)
                    komponen yaitu Perencanaan Kinerja, Pengukuran Kinerja, Pelaporan Kinerja,
                    Evaluasi Kinerja, dan Capaian Kinerja. Berdasarkan hasil penilaian untuk
                    kelima komponen tersebut adalah &quot;{nilai}&quot;.
                </Text>
                <Text style={styles.isiSurat}>
                    Kami mengucapkan terima kasih kepada {dataObjek?.kepada||""} beserta jajarannya atas
                    kerjasama dan kesungguhan dalam memenuhi seluruh dokumen pendukung kegiatan
                    Evaluasi Implementasi SAKIP. Semoga {unitKerja?.name||""} dapat lebih meningkatkan
                    implementasi SAKIP di unit kerjanya.
                </Text>
                <Text style={styles.isiSurat}>
                    Demikian, atas perhatian dan kerjasamanya diucapkan terima kasih.
                </Text>
            </View>
        </View>
    );

    const PenutupSurat = () => (
        <View>

            <View style={{ marginVertical: 30, marginHorizontal: 30, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={{ marginBottom: 80 }}>Inspektur Wilayah III</Text>
                    <Text>{dataObjek?.dariNama||""}</Text>
                </View>
            </View>
            <Text>
                Tembusan:
            </Text>
            <Text>
                Inspektur Utama (sebagai laporan)
            </Text>
        </View>
    );

    const Lampiran = () => (
        <View break>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text>
                        Lampiran LHE Desk Evaluation SAKIP
                    </Text>
                    <Text>
                        Surat Nomor: {dataObjek?.nomor||""}
                    </Text>
                    <Text>
                        Tanggal {dataObjek?.tanggal||""}
                    </Text>
                </View>
            </View>
            <Text style={styles.title} break>
                LAPORAN HASIL EVALUASI
                IMPLEMENTASI SAKIP (DESK EVALUATION)
                {unitKerja?.name||""} TAHUN {dataObjek?.tahun||""}
            </Text>
            <View style={{ marginVertical: 30 }}>
                <Text style={styles.isiSurat}>
                    Berdasarkan Peraturan Pemerintah Nomor 8 Tahun 2006 tentang Pelaporan Keuangan dan Kinerja
                    Instansi Pemerintah dan Peraturan Presiden Nomor 29 Tahun 2014 tentang Sistem Akuntabilitas
                    Kinerja Instansi Pemerintah serta berpedoman pada Peraturan Menteri Pendayagunaan Aparatur
                    Negara dan Reformasi Birokrasi Nomor 12 Tahun 2015 tentang Pedoman Evaluasi atas Implementasi
                    Sistem Akuntabilitas Kinerja Instansi Pemerintah, kami telah melakukan desk evaluation atas
                    Implementasi SAKIP Tahun {dataObjek?.tahun||""}.
                </Text>
                <Text style={styles.isiSurat}>
                    Tujuan evaluasi ini untuk memperoleh informasi tentang implementasi SAKIP unit kerja melalui
                    penelaahan atas dokumen-dokumen kinerja, menilai tingkat implementasi SAKIP, dan memberikan
                    saran perbaikan untuk peningkatan implementasi SAKIP. Tahapan yang dilakukan dalam evaluasi
                    atas implementasi SAKIP Tahun {dataObjek?.tahun||""} meliputi kegiatan permintaan dokumen kepada unit kerja,
                    evaluasi oleh evaluator, tindak lanjut, dan evaluasi (kembali) hasil tindak lanjut yang menjadi
                    bahan kegiatan panelisasi yang dilakukan oleh Tim.
                </Text>
            </View>
            <View>
                <Text style={styles.subtitle}>
                    Hasil Desk Evaluation
                </Text>
                <Text style={styles.isiSurat}>
                    Hasil Desk Evaluation implementasi SAKIP {unitKerja?.name} atas 5 (lima) komponen yang menjadi
                    dasar penilaian saat ini adalah sebagai berikut:
                </Text>
            </View>
        </View>
    );

    const TableHead = () => (
        <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
            <View style={styles.theader}>
                <Text >No</Text>
            </View>
            <View style={[styles.theader, styles.theader2]}>
                <Text>Komponen</Text>
            </View>
            <View style={styles.theader}>
                <Text>Bobot</Text>
            </View>
            <View style={styles.theader}>
                <Text>Hasil Evaluasi</Text>
            </View>
        </View>
    );

    interface TableBody {
        data: (LKEUnitKerja & { variabelLKE: VariabelLKE & { komponenLKE: KomponenLKE | null } })[]
    }
    const TableBody = ({ data }: TableBody) => (
        data.map((item) => (
            <Fragment key={item.variabelLKEId + item.unitKerjaId}>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={styles.tbody}>
                        <Text >{item.variabelLKE.kode}</Text>
                    </View>
                    <View style={[styles.tbody, styles.tbody2]}>
                        <Text>{item.variabelLKE.komponenLKE?.name} </Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text>{item.variabelLKE.komponenLKE?.bobot}</Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text>{(Number(item.nilaiPanel)).toFixed(2)}</Text>
                    </View>
                </View>
            </Fragment>
        ))
    );

    interface TableTotal {
        data: (LKEUnitKerja & { variabelLKE: VariabelLKE & { komponenLKE: KomponenLKE | null } })[]
    }
    const TableTotal = ({ data }: TableTotal) => (
        <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={styles.total}>
                <Text></Text>
            </View>
            <View style={styles.total}>
                <Text>Total</Text>
            </View>
            <View style={styles.tbody}>
                <Text>{data.reduce((sum, item) => sum + Number(item.variabelLKE.komponenLKE?.bobot), 0)}</Text>
            </View>
            <View style={styles.tbody}>
                <Text>
                    {data.reduce((sum, item) => sum + Number(item.nilaiPanel), 0)}
                </Text>
            </View>
        </View>
    );


    const TableHeadKet = () => (
        <View style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}>
            <View style={styles.theader}>
                <Text >No</Text>
            </View>
            <View style={styles.theader}>
                <Text>PERTANYAAN</Text>
            </View>
            <View style={[styles.theader, styles.theader2]}>
                <Text>CATATAN</Text>
            </View>
        </View>
    );

    // TODO: MENAMBAHKAN CATATAN TIAP SUBKOMPONEN
    interface TableBodyKet {
        data: (LKEUnitKerja & { variabelLKE: VariabelLKE & { komponenLKE: KomponenLKE | null } })[]
    }
    const TableBodyKet1 = ({ data }: TableBody) => (
        data.map((item) => (
            <Fragment key={item.variabelLKEId + item.unitKerjaId}>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={styles.tbody}>
                        <Text >{item.variabelLKE.kode}</Text>
                    </View>
                    <View style={styles.tbody}>
                        <Text>{item.variabelLKE.komponenLKE?.name} </Text>
                    </View>
                    <View style={[styles.tbody, styles.tbody2]}>
                        <Text>{item.variabelLKE.komponenLKE?.bobot}</Text>
                    </View>
                </View>
            </Fragment>
        ))
    );


    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <JudulSurat />
                <KopSurat />
                <IsiSurat nilai={String(nilaiLHE)} />
                <PenutupSurat />
                <Lampiran />
                <TableHead />
                <TableBody data={dataKomponen} />
                <TableTotal data={dataKomponen} />
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    )
}
export default LHEPDF