// lib/locations.ts
import rawProvinces from "./provinces.json";
import rawDistricts from "./districts.json";

export const provinces = rawProvinces.map((p) => p.name);

export const districtsByProvince = rawDistricts.reduce<
  Record<string, string[]>
>((acc, d) => {
  acc[d.province] ??= [];
  acc[d.province].push(d.name);
  return acc;
}, {});
