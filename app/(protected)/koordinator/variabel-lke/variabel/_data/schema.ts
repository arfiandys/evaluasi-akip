import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const variabelLKESchema = z.object({
  id: z.string().min(1),
  kode: z.string().min(1),
  tahun: z.string().min(1),
  jenisIsian: z.string().min(1),
  isSubKriteria: z.boolean(),
  kriteriaLKEId: z.string().nullable(),
  subKriteriaLKEId: z.string().nullable(),
  kriteriaLKE: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    name: z.string().min(1),
    tahun: z.string().min(1),
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
    tahun: z.string().min(1),
    bobot: z.number({
      required_error: "Bobot is required",
      invalid_type_error: "Bobot must be a number",
    }),
  }).nullable(),
  unitKerjas: z.object({
    tahun: z.string().min(1),
    jenisIsian: z.string().min(1),
    isianKt: z.string().nullable(),
    nilaiKt: z.string().nullable(),
    catatanKt: z.string().nullable(),
    isianAt: z.string().nullable(),
    nilaiAt: z.string().nullable(),
    catatanAt: z.string().nullable(),
    variabelLKEId: z.string().nullable(),
    unitKerjaId: z.string().nullable(),
  }).array(),
})

export type VariabelLKE = z.infer<typeof variabelLKESchema>
