/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useParams } from "@/reference/router";
import { errorMessage, fetchFamilies, fetchProduct, fetchProducts } from "@/reference/lib/api";
import { ErrorNotice } from "@/reference/components/Forms";
import { FadePage } from "@/reference/components/Reveal";
import { ProductExperience } from "@/components/experience/ProductExperience";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [families, setFamilies] = useState([]);
  const [all, setAll] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [supportingError, setSupportingError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setProduct(null);
    setNotFound(false);
    setLoadError("");
    setSupportingError(false);
    Promise.allSettled([fetchProduct(slug), fetchFamilies(), fetchProducts()]).then(([p, f, a]) => {
      if (!active) return;
      if (p.status === "fulfilled") setProduct(p.value);
      else if (p.reason.response?.status === 404) setNotFound(true);
      else setLoadError(errorMessage(p.reason));
      setFamilies(f.status === "fulfilled" ? f.value : []);
      setAll(a.status === "fulfilled" ? a.value : []);
      setSupportingError(f.status === "rejected" || a.status === "rejected");
    });
    return () => {
      active = false;
    };
  }, [slug, attempt]);

  if (loadError)
    return (
      <FadePage>
        <section className="shell pt-40 pb-32">
          <ErrorNotice id="product-load-error">{loadError}</ErrorNotice>
          <button
            className="action-button"
            data-testid="product-load-retry"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Try again
          </button>
        </section>
      </FadePage>
    );

  if (notFound) {
    return (
      <FadePage>
        <div
          className="grid min-h-[70vh] place-items-center px-6 pt-24 text-center"
          data-testid="product-not-found"
        >
          <div>
            <p className="label-eyebrow">Not found</p>
            <h1 className="mt-4 font-display text-4xl font-light text-timber-ink">
              Product not found
            </h1>
            <Link
              to="/products"
              data-testid="back-to-catalogue"
              className="mt-8 inline-block rounded-full bg-timber-ink px-7 py-3 text-[11px] uppercase tracking-[0.2em] text-timber-cream transition-colors hover:bg-timber-orange"
            >
              Back to catalogue
            </Link>
          </div>
        </div>
      </FadePage>
    );
  }

  if (!product) {
    return (
      <FadePage>
        <div className="grid min-h-[70vh] place-items-center pt-24" data-testid="product-loading">
          <p className="label-quiet">Loading product…</p>
        </div>
      </FadePage>
    );
  }

  const related = all
    .filter((r) => r.family === product.family && r.slug !== product.slug)
    .concat(all.filter((r) => r.featured && r.family !== product.family))
    .slice(0, 4);

  return (
    <FadePage>
      {supportingError && (
        <div className="shell pt-28">
          <ErrorNotice id="product-supporting-error">
            Some collection details could not be loaded. Your product selection is still available.
          </ErrorNotice>
          <button
            className="text-link"
            data-testid="product-supporting-retry"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Reload collection details
          </button>
        </div>
      )}
      <ProductExperience
        key={product.slug}
        product={product}
        familyName={
          families.find((family) => family.slug === product.family)?.name ||
          product.family.replaceAll("-", " ")
        }
        related={related}
      />
    </FadePage>
  );
}
