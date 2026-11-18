import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { PageHero } from "@/reference/components/Chrome";
import { useBasket } from "@/reference/context/BasketContext";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Timber Acoustics" },
      {
        name: "description",
        content: "Start a conversation about acoustic treatment for your space.",
      },
      { property: "og:title", content: "Contact — Timber Acoustics" },
      { property: "og:description", content: "Start a project enquiry with Timber Acoustics." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const preview = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (sent) preview.current?.focus();
  }, [sent]);
  const location = useLocation();
  const { items } = useBasket();
  const enquiryParams = new URLSearchParams(location.searchStr);
  const enquiryProduct = enquiryParams.get("product")?.slice(0, 200);
  const selection = enquiryParams.get("selection")?.slice(0, 500);
  const requestedQuantity = enquiryParams.get("quantity")?.slice(0, 3);
  const basketEnquiry = enquiryParams.get("basket") === "1";
  const initialMessage = basketEnquiry
    ? `I'd like a quote for these selections:\n${items.map((item) => `${item.quantity} × ${item.name}${item.description ? ` — ${item.description}` : ""}`).join("\n")}\n\nRoom details and requirements:\n`
    : enquiryProduct
      ? `${enquiryParams.get("request") === "quote" ? "I'd like a quote for" : "I'm interested in"} ${enquiryProduct}.${selection ? `\nOptions: ${selection}` : ""}${requestedQuantity ? `\nQuantity: ${requestedQuantity}` : ""}\n\nRoom details and requirements:\n`
      : "";
  const field = "w-full border bg-card px-4 py-3 outline-none focus:border-signal";
  return (
    <>
      <PageHero
        eyebrow="Enquiries / Start a conversation"
        title="Tell us about"
        italic="your space."
      >
        For studios, architects, designers and homes. A little detail is a good place to start.
      </PageHero>
      <div className="mx-auto max-w-3xl px-5 py-16">
        {enquiryProduct && (
          <p className="ta-contact-product-note">
            Your enquiry: <strong>{enquiryProduct}</strong>. Your selection is included in the
            message below.
          </p>
        )}
        <p className="ta-contact-preview-note">
          Design preview · Enquiries are not delivered yet. You can explore the form below.
        </p>
        {sent ? (
          <div
            ref={preview}
            tabIndex={-1}
            className="ta-enquiry-preview border border-signal p-6 sm:p-10"
          >
            <p className="font-display text-4xl">Your enquiry preview.</p>
            <p className="mt-3 text-muted-foreground">Demo form — nothing was sent.</p>
            <dl className="mt-6 grid gap-4">
              <div>
                <dt className="label-mono">Name</dt>
                <dd>{draft["name"]}</dd>
              </div>
              <div>
                <dt className="label-mono">Email</dt>
                <dd>{draft["email"]}</dd>
              </div>
              <div>
                <dt className="label-mono">Space type</dt>
                <dd>{draft["type"]}</dd>
              </div>
              <div>
                <dt className="label-mono">Your message</dt>
                <dd className="whitespace-pre-wrap break-words">{draft["msg"]}</dd>
              </div>
            </dl>
            <button
              className="ta-button mt-6"
              type="button"
              onClick={() => {
                setSent(false);
                requestAnimationFrame(() => nameInput.current?.focus());
              }}
            >
              Edit enquiry
            </button>
          </div>
        ) : (
          <form
            key={initialMessage}
            onSubmit={(e) => {
              e.preventDefault();
              setDraft(Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>);
              setSent(true);
            }}
            className="ta-contact-form grid gap-6 md:grid-cols-2"
          >
            <label className="grid gap-2">
              <span className="label-mono text-muted-foreground">Name</span>
              <input
                ref={nameInput}
                required
                name="name"
                autoComplete="name"
                defaultValue={draft["name"]}
                className={field}
              />
            </label>
            <label className="grid gap-2">
              <span className="label-mono text-muted-foreground">Email</span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                defaultValue={draft["email"]}
                className={field}
              />
            </label>
            <label className="grid gap-2">
              <span className="label-mono text-muted-foreground">Space type</span>
              <select name="type" defaultValue={draft["type"]} className={field}>
                <option>Studio</option>
                <option>Home theatre</option>
                <option>Hi-fi room</option>
                <option>Workplace</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label-mono text-muted-foreground">Room size (m²)</span>
              <input
                name="size"
                type="number"
                min="0.1"
                step="any"
                inputMode="decimal"
                defaultValue={draft["size"]}
                className={field}
              />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="label-mono text-muted-foreground">Tell us about the room</span>
              <textarea
                required
                name="msg"
                rows={5}
                className={field}
                defaultValue={draft["msg"] ?? initialMessage}
              />
            </label>
            <button className="label-mono bg-signal py-4 text-accent-foreground transition-colors hover:bg-foreground md:col-span-2">
              Preview enquiry
            </button>
          </form>
        )}
      </div>
    </>
  );
}
