import z from "zod";

const nameRegexTR = /^[A-Za-zÇĞİÖŞÜçğıöşü]+(?:[ '\-][A-Za-zÇĞİÖŞÜçğıöşü]+)*$/;

export const userTypeEnum = z.enum(["individual", "corporate"]);

const addressFields = {
  name: z
    .string({ error: "Geçerli bir ad girin" })
    .trim()
    .min(1, { error: "Boş bırakılamaz" })
    .max(64, { error: "En fazla 64 karakterden oluşabilir" })
    .regex(nameRegexTR, { error: "Geçerli bir ad girin" }),

  surname: z
    .string({ error: "Geçerli bir soyad girin" })
    .trim()
    .min(1, { error: "Boş bırakılamaz" })
    .max(64, { error: "En fazla 64 karakterden oluşabilir" })
    .regex(nameRegexTR, { error: "Geçerli bir soyad girin" }),
  phone: z
    .string()
    .trim()
    .min(1, { error: "Boş bırakılamaz" })
    .regex(/^[1-9][0-9]{9}$/, {
      error: "Telefon numarası 10 haneli olmalı",
    }),
  province: z
    .string({ error: "İl seçin" })
    .trim()
    .min(1, { error: "İl seçin" })
    .regex(nameRegexTR, { error: "İl seçin" }),
  district: z
    .string({ error: "İlçe seçin" })
    .trim()
    .min(1, { error: "İlçe seçin" }),
  addressLine: z
    .string()
    .trim()
    .min(8, { error: "En az 8 karakterden oluşmalı" }),
  isDefault: z.boolean(),
};

const billingAddressFields = {
  nameBill: z
    .string({ error: "Boş bırakılamaz" })
    .trim()
    .min(1, { error: "Boş bırakılamaz" })
    .max(64, { error: "En fazla 64 karakterden oluşabilir" })
    .regex(nameRegexTR, { error: "Geçerli bir ad girin" }),

  surnameBill: z
    .string({ error: "Boş bırakılamaz" })
    .trim()
    .min(1, { error: "Boş bırakılamaz" })
    .max(64, { error: "En fazla 64 karakterden oluşabilir" })
    .regex(nameRegexTR, { error: "Geçerli bir soyad girin" }),
  phoneBill: z
    .string({ error: "Boş bırakılamaz" })
    .trim()
    .min(1, { error: "Boş bırakılamaz" })
    .regex(/^[1-9][0-9]{9}$/, {
      error: "Telefon numarası 10 haneli olmalı",
    }),
  provinceBill: z
    .string({ error: "İl seçin" })
    .trim()
    .min(1, { error: "İl seçin" })
    .regex(nameRegexTR, { error: "İl seçin" }),
  districtBill: z
    .string({ error: "İlçe seçin" })
    .trim()
    .min(1, { error: "İlçe seçin" }),
  addressLineBill: z
    .string({ error: "Boş bırakılamaz" })
    .trim()
    .min(8, { error: "En az 8 karakterden oluşmalı" }),
};

const corporateFields = {
  firmName: z
    .string({
      error: "Boş bırakılamaz",
    })
    .min(1, "Boş bırakılamaz"),
  taxOffice: z
    .string({
      error: "Boş bırakılamaz",
    })
    .min(1, "Boş bırakılamaz"),
  taxId: z
    .string({
      error: "Boş bırakılamaz",
    })
    .min(1, "Boş bırakılamaz")
    .regex(/^\d{10,11}$/, {
      message:
        "Vergi no / TCKN sadece rakamlardan oluşmalı ve en az 10, en fazla 11 hane içermeli",
    }),
};

export const addressSchema = z.discriminatedUnion("userType", [
  // 🧍 Individual
  z.discriminatedUnion("sameAddress", [
    // individual + same address
    z.object({
      userType: z.literal("individual"),
      sameAddress: z.literal(true),
      ...addressFields,
    }),

    // individual + different billing
    z.object({
      userType: z.literal("individual"),
      sameAddress: z.literal(false),
      ...addressFields,
      ...billingAddressFields,
    }),
  ]),

  // 🏢 Corporate
  z.discriminatedUnion("sameAddress", [
    // corporate + same address
    z.object({
      userType: z.literal("corporate"),
      sameAddress: z.literal(true),
      ...addressFields,
      ...corporateFields,
    }),

    // corporate + different billing
    z.object({
      userType: z.literal("corporate"),
      sameAddress: z.literal(false),
      ...addressFields,
      ...corporateFields,
      ...billingAddressFields,
    }),
  ]),
]);

export type AddressFormValues = z.infer<typeof addressSchema>;
