/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { useRef, useState } from "react";
import { Link } from "@/reference/router";
import { ArrowRight, Check, Minus, Plus, Trash2, ShoppingBag, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { useBasket } from "@/reference/context/BasketContext";
import { api, errorMessage, formatPrice, mediaUrl } from "@/reference/lib/api";
import { PageHero } from "@/reference/components/Chrome";
import { FadePage } from "@/reference/components/Reveal";
import { Field, ErrorNotice } from "@/reference/components/Forms";

export default function Basket() {
  const { items, quantity, remove, clear, total } = useBasket();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
    website: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const request = useRef({ id: crypto.randomUUID(), body: "" });
  const update = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const payload = {
      ...form,
      items: items.map((x) => ({
        kind: x.kind,
        quantity: x.quantity,
        ...(x.kind === "product"
          ? { slug: x.slug, finish: x.finish, size: x.size }
          : { scheme: x.scheme }),
      })),
    };
    const body = JSON.stringify(payload);
    if (request.current.body && request.current.body !== body)
      request.current.id = crypto.randomUUID();
    request.current.body = body;
    try {
      const { data } = await api.post("/enquiries", { ...payload, request_id: request.current.id });
      setResult(data);
      clear();
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  if (result)
    return (
      <FadePage>
        <section className="success-screen shell" data-testid="enquiry-success">
          <span className="success-icon">
            <Check size={32} />
          </span>
          <p className="label-eyebrow">A quieter room starts here</p>
          <h1 className="editorial-title">
            Your ideas.
            <br />
            <em>Safely saved.</em>
          </h1>
          <p data-testid="enquiry-reference">Enquiry {result.reference}</p>
          <p className="max-w-lg text-sm leading-relaxed" data-testid="enquiry-delivery-status">
            {result.email_status === "pending_configuration"
              ? "Your enquiry is saved in the team inbox. Email notifications are not configured yet."
              : "Your enquiry is saved in the team inbox. The email notification is being processed."}
          </p>
          <p className="text-sm" data-testid="enquiry-confirmed-total">
            Current indicative total: {formatPrice(result.total)}. This is not an order or a
            payment.
          </p>
          <Link to="/products" className="action-button" data-testid="enquiry-continue">
            Back to the collection <ArrowRight size={16} />
          </Link>
        </section>
      </FadePage>
    );
  return (
    <FadePage>
      <PageHero
        eyebrow="Your shortlist / 01"
        title="Good sound starts"
        italic="with a conversation."
      />
      {!items.length ? (
        <section className="shell empty-basket" data-testid="basket-empty">
          <ShoppingBag size={36} strokeWidth={1} />
          <h2>Your room is a blank canvas.</h2>
          <p>Find a piece. Build a scheme. Make it yours.</p>
          <Link to="/products" className="action-button" data-testid="basket-explore">
            Explore the collection <ArrowRight size={16} />
          </Link>
        </section>
      ) : (
        <section className="shell basket-layout" data-testid="basket-page">
          <div>
            <div className="section-rule">
              <span>Your selections</span>
              <span data-testid="basket-count">
                {items.length} {items.length === 1 ? "selection" : "selections"}
              </span>
            </div>
            {items.map((item, i) => (
              <motion.article
                layout
                className="basket-item"
                key={item.id}
                data-testid={`basket-item-${i}`}
              >
                <div className="basket-item-image">
                  {item.image ? (
                    <img src={mediaUrl(item.image)} alt={item.name} />
                  ) : (
                    <Layers size={40} strokeWidth={1} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="label-eyebrow">
                    {item.kind === "scheme" ? "Room scheme" : "Collection"}
                  </p>
                  <h2>{item.name}</h2>
                  <p
                    className="text-xs leading-relaxed opacity-70"
                    data-testid={`basket-options-${i}`}
                  >
                    {item.description}
                  </p>
                  {item.kind === "scheme" && (
                    <Link
                      to={`/build-a-room?${new URLSearchParams({ room: item.scheme.roomType, ...item.scheme }).toString()}`}
                      className="text-xs underline mt-2 inline-block"
                      data-testid={`basket-view-scheme-${i}`}
                    >
                      View scheme
                    </Link>
                  )}
                  <div className="quantity-control">
                    <button
                      aria-label="Decrease quantity"
                      data-testid={`basket-minus-${i}`}
                      disabled={busy || item.quantity <= 1}
                      onClick={() => quantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span data-testid={`basket-quantity-${i}`}>{item.quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      data-testid={`basket-plus-${i}`}
                      disabled={busy || item.quantity >= 99}
                      onClick={() => quantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      disabled={busy}
                      className="ml-3"
                      aria-label={`Remove ${item.name}`}
                      data-testid={`basket-remove-${i}`}
                      onClick={() => remove(item.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <p className="basket-price" data-testid={`basket-price-${i}`}>
                  {formatPrice(item.unit_price * item.quantity)}
                </p>
              </motion.article>
            ))}
            <div className="basket-total">
              <span>Indicative total</span>
              <strong data-testid="basket-total">{formatPrice(total)}</strong>
            </div>
            <p className="fine-print" data-testid="basket-estimate-note">
              INR Â· Indicative catalogue pricing, not a quotation. The team will confirm
              specifications, installation, delivery and taxes. Latest catalogue prices are applied
              on submission.
            </p>
          </div>
          <form onSubmit={submit} className="enquiry-form" data-testid="enquiry-form">
            <p className="label-eyebrow">Let's make room for better sound</p>
            <h2>Tell us about your space.</h2>
            <fieldset disabled={busy} className="space-y-5">
              <Field
                id="enquiry-name"
                label="Your name *"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                value={form.name}
                onChange={update("name")}
              />
              <Field
                id="enquiry-email"
                label="Email address *"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
              />
              <Field
                id="enquiry-phone"
                label="Phone (optional)"
                type="tel"
                autoComplete="tel"
                maxLength={40}
                value={form.phone}
                onChange={update("phone")}
              />
              <Field
                id="enquiry-message"
                label="Room dimensions, ideas, questions"
                multiline
                rows={4}
                maxLength={3000}
                value={form.message}
                onChange={update("message")}
              />
              <div className="honeypot" aria-hidden="true">
                <input
                  data-testid="enquiry-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={update("website")}
                />
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  data-testid="enquiry-consent"
                  required
                  checked={form.consent}
                  onChange={update("consent")}
                />
                <span>
                  I agree to the Timber team using these details to respond to my enquiry.
                </span>
              </label>
              <ErrorNotice id="enquiry-error">{error}</ErrorNotice>
              <button className="action-button w-full" data-testid="enquiry-submit" disabled={busy}>
                {busy ? "Saving your enquiryâ€¦" : "Send enquiry"}
                <ArrowRight size={16} />
              </button>
            </fieldset>
            <p className="fine-print">
              No checkout. No payment. Just a conversation about your room.
            </p>
          </form>
        </section>
      )}
    </FadePage>
  );
}
