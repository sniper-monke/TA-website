import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { PageHero } from "@/reference/components/Chrome";

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
  const location = useLocation();
  const enquiryParams = new URLSearchParams(location.searchStr);
  const enquiryProduct = enquiryParams.get("product")?.slice(0, 200);
  const selection = enquiryParams.get("selection")?.slice(0, 500);
  const requestedQuantity = enquiryParams.get("quantity")?.slice(0, 3);
  const initialMessage = enquiryProduct
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
          <div role="status" className="border border-signal p-10 text-center">
            <p className="font-display text-4xl">Your enquiry preview.</p>
            <p className="mt-3 text-muted-foreground">Demo form — nothing was sent.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="ta-contact-form grid gap-6 md:grid-cols-2"
          >
            <label className="grid gap-2">
              <span className="label-mono text-muted-foreground">Name</span>
              <input required name="name" autoComplete="name" className={field} />
            </label>
            <label className="grid gap-2">
              <span className="label-mono text-muted-foreground">Email</span>
              <input required type="email" name="email" autoComplete="email" className={field} />
            </label>
            <label className="grid gap-2">
              <span className="label-mono text-muted-foreground">Space type</span>
              <select name="type" className={field}>
                <option>Studio</option>
                <option>Home theatre</option>
                <option>Hi-fi room</option>
                <option>Workplace</option>
                <option>Other</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="label-mono text-muted-foreground">Room size (m²)</span>
              <input name="size" inputMode="numeric" className={field} />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="label-mono text-muted-foreground">Tell us about the room</span>
              <textarea
                required
                name="msg"
                rows={5}
                className={field}
                defaultValue={initialMessage}
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
