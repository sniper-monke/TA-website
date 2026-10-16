import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/site/Chrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Timber Acoustics" },
      { name: "description", content: "Professional and project enquiries for Timber Acoustics, including shipping to UAE and the Gulf." },
      { property: "og:title", content: "Contact — Timber Acoustics" },
      { property: "og:description", content: "Start a project enquiry with Timber Acoustics." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const field = "w-full border bg-card px-4 py-3 outline-none focus:border-signal";
  return (
    <>
      <PageHero eyebrow="Enquiries" title="Talk to us">Studios, architects, integrators and homeowners. Now shipping to UAE and Gulf countries.</PageHero>
      <div className="mx-auto max-w-3xl px-5 py-16">
        {sent ? (
          <div role="status" className="border border-signal p-10 text-center"><p className="font-display text-4xl">Thanks.</p><p className="mt-3 text-muted-foreground">Demo form — nothing was sent.</p></div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-6 md:grid-cols-2">
            <label className="grid gap-2"><span className="label-mono text-muted-foreground">Name</span><input required name="name" autoComplete="name" className={field} /></label>
            <label className="grid gap-2"><span className="label-mono text-muted-foreground">Email</span><input required type="email" name="email" autoComplete="email" className={field} /></label>
            <label className="grid gap-2"><span className="label-mono text-muted-foreground">Space type</span><select name="type" className={field}><option>Studio</option><option>Home theatre</option><option>Hi-fi room</option><option>Workplace</option><option>Other</option></select></label>
            <label className="grid gap-2"><span className="label-mono text-muted-foreground">Room size (m²)</span><input name="size" inputMode="numeric" className={field} /></label>
            <label className="grid gap-2 md:col-span-2"><span className="label-mono text-muted-foreground">Tell us about the room</span><textarea required name="msg" rows={5} className={field} /></label>
            <button className="label-mono bg-signal py-4 text-accent-foreground transition-colors hover:bg-foreground md:col-span-2">Send enquiry (demo)</button>
          </form>
        )}
      </div>
    </>
  );
}
