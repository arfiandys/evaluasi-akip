import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const subKomponenSchema = z.object({
  id: z.string().min(1),
  kode: z.string().min(1),
  name: z.string().min(1),
  komponenLKEId: z.string().nullable(),
  bobot: z.number({
    required_error: "Bobot is required",
    invalid_type_error: "Bobot must be a number",
  }),
  kriteriaLKE: z.object({
    id: z.string().min(1),
    kode: z.string().min(1),
    name: z.string().min(1),
    bobot: z.number({
      required_error: "Bobot is required",
      invalid_type_error: "Bobot must be a number",
    }),
  }).array()
})

export type SubKomponen = z.infer<typeof subKomponenSchema>
