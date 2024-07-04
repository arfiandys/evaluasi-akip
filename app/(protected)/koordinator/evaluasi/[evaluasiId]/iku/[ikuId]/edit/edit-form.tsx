"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Combobox } from "@/components/ui/combobox";
import { Evaluasi, IKU, Permindok } from "@prisma/client";
import { IconBadge } from "@/components/icon-badge";
import { Activity } from "lucide-react";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "Nama dibutuhkan",
    }),
    evaluasiId: z.string().min(1, {
        message: "Evaluasi id dibutuhkan",
    }),
});

interface IKUEditProps {
    evaluasi: Evaluasi;
    iku: IKU;
};

const IKUEdit = ({
    evaluasi, iku
}: IKUEditProps) => {

    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: iku.name,
            evaluasiId: evaluasi.id
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/iku/${iku.id}`, values);
            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                toast.success("IKU berhasil diperbarui!")
                router.push(`/koordinator/evaluasi/${evaluasi.id}/iku/${iku.id}`);
                form.reset()
                router.refresh()
            }
        } catch {
            toast.error("Terdapat kesalahan!");
        }


    }

    return (
        <Card className="shadow-lg col-span-4 md:col-start-2 md:col-span-2 rounded-3xl h-fit">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <CardHeader className="flex flex-row gap-x-4 justify-between items-center">
                        <div className="flex flex-row gap-x-4 justify-start items-center">
                            <IconBadge icon={Activity} />
                            <CardTitle>Rincian dasar</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-4 items-start justify-between w-full">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Nama
                                        </FormLabel>
                                        <Select
                                            disabled={isSubmitting}
                                            onValueChange={field.onChange}
                                            defaultValue={iku.name}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih isian" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="kab/kota">
                                                    Kabupaten/Kota
                                                </SelectItem>
                                                <SelectItem value="provinsi">
                                                    Provinsi
                                                </SelectItem>
                                                <SelectItem value="pusdiklat">
                                                    Pusat Pendidikan dan Pelatihan
                                                </SelectItem>
                                                <SelectItem value="stis">
                                                    Sekolah Tinggi Ilmu Statistik
                                                </SelectItem>
                                                <SelectItem value="bbp">
                                                    Biro Bina Program
                                                </SelectItem>
                                                <SelectItem value="bkeu">
                                                    Biro Keuangan
                                                </SelectItem>
                                                <SelectItem value="bkep">
                                                    Biro Kepegawaian
                                                </SelectItem>
                                                <SelectItem value="bhmh">
                                                    Biro Hubungan Masyarakat dan Hukum
                                                </SelectItem>
                                                <SelectItem value="bu">
                                                    Biro Umum
                                                </SelectItem>
                                                <SelectItem value="dpmss">
                                                    Direktorat Pengembangan Metodologi Survei dan Sensus
                                                </SelectItem>
                                                <SelectItem value="dds">
                                                    Direktorat Diseminasi Statistik
                                                </SelectItem>
                                                <SelectItem value="dsis">
                                                    Direktorat Sistem Informasi Statistik
                                                </SelectItem>
                                                <SelectItem value="dskk">
                                                    Direktorat Statistik Kependudukan dan Ketenagakerjaan
                                                </SelectItem>
                                                <SelectItem value="dskr">
                                                    Direktorat Statistik Kesejahteraan Rakyat
                                                </SelectItem>
                                                <SelectItem value="dsks">
                                                    Direktorat Statistik Ketahanan Sosial
                                                </SelectItem>
                                                <SelectItem value="dstphp">
                                                    Direktorat Statistik Tanaman Pangan, Holtikultura, dan Perkebunan
                                                </SelectItem>
                                                <SelectItem value="dsppk">
                                                    Direktorat Statistik Peternakan, Perikanan, dan Kehutanan
                                                </SelectItem>
                                                <SelectItem value="dsi">
                                                    Direktorat Statistik Industri
                                                </SelectItem>
                                                <SelectItem value="dsd">
                                                    Direktorat Statistik Distribusi
                                                </SelectItem>
                                                <SelectItem value="dsh">
                                                    Direktorat Statistik Harga
                                                </SelectItem>
                                                <SelectItem value="dsktip">
                                                    Direktorat Statistik Keuangan, Teknologi Informasi, dan Pariwisata
                                                </SelectItem>
                                                <SelectItem value="dnpr">
                                                    Direktorat Neraca Produksi
                                                </SelectItem>
                                                <SelectItem value="dnpe">
                                                    Direktorat Neraca Pengeluaran
                                                </SelectItem>
                                                <SelectItem value="daps">
                                                    Direktorat Analisis dan Pengembangan Statistik
                                                </SelectItem>
                                                <SelectItem value="iw1">
                                                    Inspektorat Wilayah I
                                                </SelectItem>
                                                <SelectItem value="iw2">
                                                    Inspektorat Wilayah II
                                                </SelectItem>
                                                <SelectItem value="iw3">
                                                    Inspektorat Wilayah III
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Edit IKU
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default IKUEdit;