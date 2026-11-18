import { createFileRoute } from "@tanstack/react-router";
import ProductDetail from "@/reference/pages/ProductDetail";
import { notFound } from "@tanstack/react-router";
import { getStoreProduct } from "@/lib/commerce";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const { product } = await getStoreProduct({ data: { handle: params.slug } });
    if (!product) throw notFound();
    return product;
  },
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData();
  return <ProductDetail key={product.slug} initialProduct={product} />;
}
