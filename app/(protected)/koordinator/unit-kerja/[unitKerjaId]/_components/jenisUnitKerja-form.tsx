"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JenisUnitKerjaProps {
  initialData: {
    jenisUnitKerja: string;
  };
  unitKerjaId: string;
};

const formSchema = z.object({
  jenisUnitKerja: z.string().min(1, {
    message: "Jenis Unit Kerja dibutuhkan",
  }),
});

export const JenisUnitKerjaForm = ({
  initialData,
  unitKerjaId
}: JenisUnitKerjaProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/unit-kerja/${unitKerjaId}`, values);
      if (response.data.error) {
        toast.error(response.data.error)
      } else {
        router.push(`/koordinator/unit-kerja/${response.data.id}`);
        toast.success("Unit Kerja berhasil diperbarui!")
        toggleEdit();
        form.reset()
        router.refresh();
      }
    } catch {
      toast.error("Terdapat kesalahan");
    }
  }

  return (
    <div className="bg-background rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Jenis unit kerja
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Batal</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2">
          {initialData.jenisUnitKerja}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="jenisUnitKerja"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Jenis unit kerja
                  </FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
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
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}