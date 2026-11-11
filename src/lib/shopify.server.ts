import { z } from "zod";
import { getRequestIP } from "@tanstack/react-start/server";
import type { StoreProduct, StoreVariant } from "./storefront";

const configuration = () => {
  const domain = process.env["SHOPIFY_STORE_DOMAIN"]?.trim();
  const token = process.env["SHOPIFY_STOREFRONT_PRIVATE_TOKEN"]?.trim();
  if (!domain && !token) return null;
  if (!domain || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain) || !token)
    throw new Error("The shop connection is incomplete. Please contact the Timber team.");
  return { domain, token };
};

async function graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const config = configuration();
  if (!config) throw new Error("Online checkout is not available in this preview.");
  let response: Response;
  const buyerIp = getRequestIP({ xForwardedFor: true });
  try {
    response = await fetch(`https://${config.domain}/api/2026-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": config.token,
        ...(buyerIp ? { "Shopify-Storefront-Buyer-IP": buyerIp } : {}),
      },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error("The shop is taking a little longer to respond. Please try again.");
  }
  if (!response.ok) throw new Error("The shop is temporarily unavailable. Please try again.");
  const result = (await response.json()) as { data?: T; errors?: unknown[] };
  if (result.errors?.length || !result.data)
    throw new Error("The shop could not load your request. Please try again.");
  return result.data;
}

type Connection<T> = { nodes: T[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
type RawProduct = {
  handle: string;
  title: string;
  description: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { nodes: { url: string }[] };
  collections: { nodes: { handle: string; title: string }[] };
  options: { name: string; values: string[] }[];
  metafields: ({ key: string; value: string } | null)[];
  variants?: Connection<StoreVariant>;
};
const productFields = `handle title description tags
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 12) { nodes { url } }
  collections(first: 50) { nodes { handle title } }
  options { name values }
  metafields(identifiers: [
    {namespace: "custom", key: "dimensions"},
    {namespace: "custom", key: "material"},
    {namespace: "custom", key: "installation"},
    {namespace: "custom", key: "specifications"},
    {namespace: "custom", key: "downloads"}
  ]) { key value }`;
const variantFields = `id title availableForSale price { amount currencyCode }
  selectedOptions { name value } image { url altText }`;

const downloadSchema = z.array(
  z.object({
    title: z.string(),
    url: z
      .string()
      .url()
      .refine((s) => s.startsWith("https://")),
  }),
);
const specificationSchema = z.array(z.object({ name: z.string(), value: z.string() }));
function jsonField<T>(value: string | undefined, schema: z.ZodType<T>, fallback: T): T {
  try {
    return schema.parse(JSON.parse(value || "null"));
  } catch {
    return fallback;
  }
}
function normalize(p: RawProduct): StoreProduct {
  const fields = Object.fromEntries(
    p.metafields.filter((x) => x !== null).map((x) => [x.key, x.value]),
  );
  return {
    slug: p.handle,
    name: p.title,
    purpose: p.description,
    family: p.collections.nodes[0]?.handle || "collection",
    families: p.collections.nodes.map((x) => x.handle),
    price: Number(p.priceRange.minVariantPrice.amount),
    currency: p.priceRange.minVariantPrice.currencyCode,
    gallery: p.images.nodes.length ? p.images.nodes.map((x) => x.url) : ["/brand/timber-mark.svg"],
    dims: fields["dimensions"] || "",
    material: fields["material"] || "",
    installation: fields["installation"] || "",
    featured: p.tags.includes("featured"),
    sample: false,
    source: "shopify",
    options: p.options,
    variants: p.variants?.nodes || [],
    specifications: jsonField(fields["specifications"], specificationSchema, []),
    downloads: jsonField(fields["downloads"], downloadSchema, []),
  };
}

export async function loadCatalogue() {
  if (!configuration()) return null;
  const products: RawProduct[] = [];
  let after: string | null = null;
  do {
    const data: { products: Connection<RawProduct> } = await graphql(
      `query Catalogue($after: String) {
      products(first: 100, after: $after) { nodes { ${productFields} } pageInfo { hasNextPage endCursor } }
    }`,
      { after },
    );
    products.push(...data.products.nodes);
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);
  const families = [
    ...new Map(
      products
        .flatMap((p) => p.collections.nodes)
        .map((c) => [
          c.handle,
          {
            slug: c.handle,
            name: c.title,
            principle: "",
            blurb: "",
            image:
              products.find((p) => p.collections.nodes.some((x) => x.handle === c.handle))?.images
                .nodes[0]?.url || "/brand/timber-mark.svg",
          },
        ]),
    ).values(),
  ];
  return { products: products.map(normalize), families };
}

export async function loadProduct(handle: string) {
  if (!configuration()) return { mode: "preview" as const, product: null };
  const data = await graphql<{ product: RawProduct | null }>(
    `query Product($handle: String!) {
    product(handle: $handle) { ${productFields}
      variants(first: 250) { nodes { ${variantFields} } pageInfo { hasNextPage endCursor } }
    }
  }`,
    { handle },
  );
  const p = data.product;
  if (p?.variants) {
    let after = p.variants.pageInfo.hasNextPage ? p.variants.pageInfo.endCursor : null;
    while (after) {
      const next: { product: { variants: Connection<StoreVariant> } | null } = await graphql(
        `query Variants($handle: String!, $after: String) {
        product(handle: $handle) { variants(first: 250, after: $after) { nodes { ${variantFields} } pageInfo { hasNextPage endCursor } } }
      }`,
        { handle, after },
      );
      if (!next.product) throw new Error("This product is no longer available.");
      p.variants.nodes.push(...next.product.variants.nodes);
      after = next.product.variants.pageInfo.hasNextPage
        ? next.product.variants.pageInfo.endCursor
        : null;
    }
  }
  return { mode: "shopify" as const, product: p ? normalize(p) : null };
}

export const checkoutInput = z.object({
  lines: z
    .array(
      z.object({
        merchandiseId: z.string().regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(30),
});

export async function checkout(input: z.infer<typeof checkoutInput>) {
  // Prices, stock, shipping and payment are determined by Shopify, never the browser basket.
  const data = await graphql<{
    cartCreate: {
      cart: { checkoutUrl: string; totalQuantity: number } | null;
      userErrors: { message: string }[];
      warnings: { message: string }[];
    };
  }>(
    `
      mutation Checkout($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
            totalQuantity
          }
          userErrors {
            message
          }
          warnings {
            message
          }
        }
      }
    `,
    { input: { lines: input.lines } },
  );
  const result = data.cartCreate;
  if (result.userErrors.length) throw new Error(result.userErrors.map((e) => e.message).join(" "));
  if (
    result.warnings.length ||
    !result.cart ||
    result.cart.totalQuantity !== input.lines.reduce((n, l) => n + l.quantity, 0)
  )
    throw new Error(
      "Some selections are no longer available in the requested quantity. Please review your bag.",
    );
  const url = new URL(result.cart.checkoutUrl);
  if (url.protocol !== "https:") throw new Error("Checkout is temporarily unavailable.");
  return { checkoutUrl: url.href };
}
