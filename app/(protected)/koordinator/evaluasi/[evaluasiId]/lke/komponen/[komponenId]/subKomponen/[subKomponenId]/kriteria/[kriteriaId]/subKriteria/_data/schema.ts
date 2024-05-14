import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const subKriteriaSchema = z.object({
  id: z.string().min(1),
  kode: z.string().min(1),
  name: z.string().min(1),
  kriteriaLKEId: z.string().nullable(),
  bobot: z.number({
    required_error: "Bobot is required",
    invalid_type_error: "Bobot must be a number",
  }),
  variabelLKE: z.object({
    id: z.string().min(1),
    evaluasiId: z.string().min(1)
  }).nullable()
})

export type SubKriteria = z.infer<typeof subKriteriaSchema>
