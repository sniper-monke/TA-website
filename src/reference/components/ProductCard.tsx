/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { Link } from "@/reference/router";
import { Reveal } from "@/reference/components/Reveal";
import { formatPrice } from "@/reference/lib/api";
import { mediaUrl } from "@/reference/lib/api";

const ProductCard = ({ product: p, familyName, index = 0 }) => (
  <Reveal delay={(index % 3) * 0.08}>
    <Link to={`/products/${p.slug}`} data-testid={`product-card-${p.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-md bg-timber-sand">
        <img
          src={mediaUrl(p.gallery[0])}
          alt={p.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-timber-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="label-quiet">{familyName}</p>
          <h3 className="mt-1.5 font-display text-xl font-light tracking-tight text-timber-ink transition-colors duration-300 group-hover:text-timber-orange">
            {p.name}
          </h3>
        </div>
        <p className="pt-4 text-sm font-normal text-timber-ink/70">{formatPrice(p.price)}</p>
      </div>
    </Link>
  </Reveal>
);

export default ProductCard;
