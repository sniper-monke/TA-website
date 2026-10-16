import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Catalogue } from "@/components/site/Catalogue";
import { PageHero } from "@/components/site/Chrome";
import { getFamily } from "@/data/products";

export const Route = createFileRoute("/collections/$family")({
  loader: ({ params }) => {
    const family = getFamily(params.family);
    if (!family) throw notFound();
    return { family };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Collection not found" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.family.name} — Timber Acoustics`;
    return { meta: [{ title: t }, { name: "description", content: loaderData.family.blurb }, { property: "og:title", content: t }, { property: "og:description", content: loaderData.family.blurb }] };
  },
  notFoundComponent: () => (
    <div className="px-5 pb-20 pt-40 text-center"><p className="font-display text-5xl">Unknown collection</p><Link to="/products" className="label-mono mt-6 inline-block underline">All products</Link></div>
  ),
  component: Collection,
});

function Collection() {
  const { family } = Route.useLoaderData();
  return (<><PageHero eyebrow={`${family.index} · ${family.principle}`} title={family.name}>{family.blurb}</PageHero><Catalogue family={family.slug} /></>);
}
