import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getCatalogue = createServerFn({ method: "GET" }).handler(async () => {
  const { loadCatalogue } = await import("./shopify.server");
  return loadCatalogue();
});

export const getStoreProduct = createServerFn({ method: "GET" })
  .validator(z.object({ handle: z.string().min(1).max(255) }))
  .handler(async ({ data }) => {
    const { loadProduct } = await import("./shopify.server");
    return loadProduct(data.handle);
  });

export const beginCheckout = createServerFn({ method: "POST" })
  .validator(
    z.object({
      lines: z
        .array(
          z.object({
            merchandiseId: z.string().regex(/^gid:\/\/shopify\/ProductVariant\/\d+$/),
            quantity: z.number().int().min(1).max(99),
          }),
        )
        .min(1)
        .max(30),
    }),
  )
  .handler(async ({ data }) => {
    const { checkout } = await import("./shopify.server");
    return checkout(data);
  });
