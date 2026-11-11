import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useBasket } from "@/reference/context/BasketContext";
import { beginCheckout } from "@/lib/commerce";
import { money } from "@/lib/storefront";
import { PageHero } from "@/reference/components/Chrome";

export function ShoppingBagPage() {
  const { items, quantity, remove } = useBasket();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const products = items.filter((x) => x.kind === "product");
  const schemes = items.filter((x) => x.kind === "scheme");
  const live = products.filter((x) => x.variantId);
  const preview = products.some((x) => !x.variantId);
  const currencies = new Set(products.map((x) => x.currency || "INR"));
  const canCheckout = products.length > 0 && !preview && currencies.size === 1;
  const checkout = async () => {
    if (busy || !canCheckout) return;
    setBusy(true);
    setError("");
    try {
      const result = await beginCheckout({
        data: { lines: live.map((x) => ({ merchandiseId: x.variantId!, quantity: x.quantity })) },
      });
      window.location.assign(result.checkoutUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout could not be opened. Please try again.");
      setBusy(false);
    }
  };
  return (
    <>
      <PageHero eyebrow="Your shopping bag" title="A little closer to" italic="better sound.">
        Your products, finishes and room ideas, all in one place.
      </PageHero>
      <section className="ta-shell ta-shopping-layout" data-testid="basket-page">
        <div>
          {!items.length ? (
            <div className="ta-bag-empty" data-testid="basket-empty">
              <ShoppingBag size={36} strokeWidth={1} />
              <h2>Make room for better sound.</h2>
              <p>Explore acoustic panels, timber slats, diffusers and room kits.</p>
              <Link to="/products" className="ta-button">
                Explore products <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            items.map((item, i) => (
              <article className="ta-bag-line" key={item.id} data-testid={`basket-item-${i}`}>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="ta-bag-scheme">
                    Room
                    <br />
                    study
                  </div>
                )}
                <div>
                  <p className="ta-micro ta-rust">
                    {item.kind === "scheme"
                      ? "Custom room / Quote required"
                      : item.variantId
                        ? "Product"
                        : "Preview product"}
                  </p>
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                  {item.kind === "scheme" && item.scheme && (
                    <a
                      className="ta-text-link"
                      href={`/build-a-room?${new URLSearchParams({ ...item.scheme, room: item.scheme["roomType"] || "studio" })}`}
                    >
                      Revisit room
                    </a>
                  )}
                  <div className="ta-bag-quantity">
                    <button
                      disabled={busy || item.quantity <= 1}
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => quantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span aria-live="polite" data-testid={`basket-quantity-${i}`}>
                      {item.quantity}
                    </span>
                    <button
                      disabled={busy || item.quantity >= 99}
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => quantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      disabled={busy}
                      aria-label={`Remove ${item.name}`}
                      onClick={() => remove(item.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <span className="ta-bag-price">
                  {item.kind === "scheme"
                    ? "By quotation"
                    : money(item.unit_price * item.quantity, item.currency)}
                </span>
              </article>
            ))
          )}
          <Link to="/products" className="ta-text-link">
            Continue exploring <ArrowRight size={15} />
          </Link>
        </div>
        <aside className="ta-bag-summary">
          <p className="ta-micro ta-rust">Your selections</p>
          <h2>Order summary</h2>
          {[...currencies].map((currency) => (
            <div className="ta-bag-subtotal" key={currency}>
              <span>{preview ? "Preview subtotal" : "Product subtotal"}</span>
              <strong>
                {money(
                  products
                    .filter((x) => (x.currency || "INR") === currency)
                    .reduce((n, x) => n + x.quantity * x.unit_price, 0),
                  currency,
                )}
              </strong>
            </div>
          ))}
          {!products.length && <p>No products selected yet.</p>}
          <p className="ta-bag-fine">
            {preview
              ? "Sample products and indicative prices are shown for this design preview. Online purchasing will be available when the shop is connected."
              : "Shipping, taxes and current availability are confirmed at checkout."}
          </p>
          <button
            className="ta-button"
            disabled={!canCheckout || busy}
            onClick={checkout}
            data-testid="checkout-button"
          >
            {busy
              ? "Opening checkout…"
              : preview || !products.length
                ? "Checkout unavailable in preview"
                : "Continue to checkout"}
            <ArrowRight size={16} />
          </button>
          {error && (
            <p role="alert" className="ta-bag-error">
              {error}
            </p>
          )}
          {schemes.length > 0 && (
            <p className="ta-bag-fine">
              Your {schemes.length === 1 ? "custom room is" : "custom rooms are"} quoted separately
              from product purchases.
            </p>
          )}
          <div className="ta-bag-advice">
            <h3>A whole room in mind?</h3>
            <p>Talk through treatment, placement and installation with the team.</p>
            <Link to="/contact" className="ta-text-link">
              Request a project quote <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
      </section>
    </>
  );
}
