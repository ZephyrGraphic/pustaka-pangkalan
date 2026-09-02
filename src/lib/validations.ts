import { z } from "zod";

export const adminUserUpdateSchema = z.object({
  userId: z.string().min(1, "User ID wajib diisi"),
  name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  phone: z.string().max(20, "Nomor telepon maksimal 20 karakter").optional().nullable(),
  address: z.string().min(1, "Dusun / wilayah wajib dipilih"),
  occupation: z.string().max(100, "Bidang pekerjaan/minat maksimal 100 karakter").optional().nullable(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  image: z.string().optional().nullable(),
  phone: z.string().max(20, "Nomor telepon maksimal 20 karakter").optional().nullable(),
  address: z.string().min(1, "Dusun / wilayah wajib dipilih").optional().nullable(),
  occupation: z.string().max(100, "Minat baca maksimal 100 karakter").optional().nullable(),
  newPin: z.string().regex(/^\d{6}$/, "PIN baru harus terdiri dari 6 digit angka").optional().or(z.literal("")),
});

export const dusunSchema = z.object({
  name: z.string().min(2, "Nama dusun minimal 2 karakter").max(100, "Nama dusun maksimal 100 karakter"),
  order: z.number().int().nonnegative().optional(),
});
