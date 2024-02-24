import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const komponenSchema = z.object({
  id: z.string().min(1),
  kode: z.string().min(1),
  name: z.string().min(1),
  tahun: z.string().min(1),
  bobot: z.number({
    required_error: "Age is required",
    invalid_type_error: "Age must be a number",
  }),
  subKomponenLKE: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    name: z.string().min(1),
    bobot: z.number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    }),
  }).array()
})

export type Komponen = z.infer<typeof komponenSchema>
