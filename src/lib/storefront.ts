export type StoreVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: { name: string; value: string }[];
  image: { url: string; altText: string | null } | null;
};

export type StoreProduct = {
  slug: string;
  name: string;
  family: string;
  families: string[];
  purpose: string;
  price: number;
  currency: string;
  gallery: string[];
  dims: string;
  material: string;
  installation: string;
  featured: boolean;
  sample: boolean;
  source: "shopify";
  options: { name: string; values: string[] }[];
  variants: StoreVariant[];
  specifications: { name: string; value: string }[];
  downloads: { title: string; url: string }[];
};

export const money = (amount: number | string, currency = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(Number(amount));
