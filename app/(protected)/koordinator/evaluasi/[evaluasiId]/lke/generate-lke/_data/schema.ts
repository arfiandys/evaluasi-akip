import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const LKEUnitKerjaSchema = z.object({
  isianKt: z.string().nullable(),
  isianAt: z.string().nullable(),
  isianDalnis: z.string().nullable(),
  nilaiKt: z.string().nullable(),
  nilaiAt: z.string().nullable(),
  nilaiDalnis: z.string().nullable(),
  catatanKt: z.string().nullable(),
  catatanAt: z.string().nullable(),
  catatanDalnis: z.string().nullable(),
  variabelLKEId: z.string(),
  unitKerjaId: z.string(),
  variabelLKE: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    jenisIsian: z.string().min(1),
    levelVariabel: z.string().min(1),
    komponenLKEId: z.string().nullable(),
    subKomponenLKEId: z.string().nullable(),
    kriteriaLKEId: z.string().nullable(),
    subKriteriaLKEId: z.string().nullable(),
    komponenLKE: z.object({
      id: z.string().min(1),
      kode: z.string().min(1),
      name: z.string().min(1),
      tahun: z.string().min(1),
      bobot: z.number({
        required_error: "Bobot is required",
        invalid_type_error: "Bobot must be a number",
      }),
    }).nullable(),
    subKomponenLKE: z.object({
      id: z.string().min(1),
      kode: z.string().min(1),
      name: z.string().min(1),
      komponenLKEId: z.string().nullable(),
      bobot: z.number({
        required_error: "Bobot is required",
        invalid_type_error: "Bobot must be a number",
      }),
    }).nullable(),
    kriteriaLKE: z.object({
      id: z.string().min(1),
      kode: z.string().min(1),
      name: z.string().min(1),
      subKomponenLKEId: z.string().nullable(),
      bobot: z.number({
        required_error: "Bobot is required",
        invalid_type_error: "Bobot must be a number",
      }),
    }).nullable(),
    subKriteriaLKE: z.object({
      id: z.string().min(1),
      kode: z.string().min(1),
      name: z.string().min(1),
      kriteriaLKEId: z.string().nullable(),
      bobot: z.number({
        required_error: "Bobot is required",
        invalid_type_error: "Bobot must be a number",
      }),
    }).nullable(),
  }),
  unitKerja: z.object({
    id: z.string().min(1),
    kodeWilayah: z.string().min(1),
    kodeUnitKerja: z.string().min(1),
    name: z.string().min(1),
  }),
})

export type LKEUnitKerja = z.infer<typeof LKEUnitKerjaSchema>
