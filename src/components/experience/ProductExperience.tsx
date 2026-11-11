import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Layers3,
  Maximize2,
  Minus,
  Plus,
  Ruler,
  SlidersHorizontal,
  Waves,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBasket } from "@/reference/context/BasketContext";
import { isStoreProduct, productGuidance, type ProductItem } from "@/lib/product-presentation";
import { money } from "@/lib/storefront";

type Props = { product: ProductItem; familyName?: string; related?: ProductItem[] };
type Option = { name: string; values: { id: string; label: string; swatch?: string }[] };

export function ProductExperience({
  product,
  familyName = product.family.replaceAll("-", " "),
  related = [],
}: Props) {
  const { add } = useBasket();
  const live = isStoreProduct(product) ? product : null;
  const demo = isStoreProduct(product) ? null : product;
  const guidance = productGuidance(product.family);
  const first = live?.variants.find((variant) => variant.availableForSale) || live?.variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    live
      ? Object.fromEntries(
          first?.selectedOptions.map((option) => [option.name, option.value]) || [],
        )
      : { Finish: demo?.finishes[0]?.id || "", Size: demo?.sizes[0] || "" },
  );
  const [image, setImage] = useState(product.gallery[0] || "/brand/timber-mark.svg");
  const [quantity, setQuantity] = useState(1);
  const options: Option[] = live
    ? live.options
        .filter((option) => !(option.name === "Title" && option.values[0] === "Default Title"))
        .map((option) => ({
          name: option.name,
          values: option.values.map((value) => ({ id: value, label: value })),
        }))
    : [
        {
          name: "Finish",
          values:
            demo?.finishes.map((finish) => ({
              id: finish.id,
              label: finish.name,
              swatch: finish.swatch,
            })) || [],
        },
        { name: "Size", values: demo?.sizes.map((size) => ({ id: size, label: size })) || [] },
      ];
  const variant = live?.variants.find((entry) =>
    entry.selectedOptions.every((option) => selected[option.name] === option.value),
  );
  const available = !live || !!variant?.availableForSale;
  const price = variant ? Number(variant.price.amount) : product.price;
  const currency = variant?.price.currencyCode || live?.currency || "INR";
  const description = options
    .map((option) => option.values.find((value) => value.id === selected[option.name])?.label)
    .filter(Boolean)
    .join(" / ");
  const quoteHref = `/contact?${new URLSearchParams({ product: product.name, selection: description, quantity: String(quantity), request: "quote" })}`;
  const roomFinish = (selected["Finish"] || "").toLowerCase();
  const roomParams = new URLSearchParams(
    ["oak", "walnut", "ebony"].includes(roomFinish)
      ? { finish: roomFinish }
      : ["charcoal", "rust", "bone"].includes(roomFinish)
        ? { felt: roomFinish }
        : {},
  );
  const downloads = live?.downloads || [];
  const specs = [
    ...new Map(
      [
        { name: "Category", value: familyName },
        ...(product.dims ? [{ name: "Dimensions", value: product.dims }] : []),
        ...(product.material ? [{ name: "Material", value: product.material }] : []),
        ...(demo?.nrc != null ? [{ name: "NRC (sample only)", value: demo.nrc.toFixed(2) }] : []),
        ...(live?.specifications || []),
        ...options
          .filter((option) => option.values.length)
          .map((option) => ({
            name: `${option.name} options`,
            value: option.values.map((value) => value.label).join(", "),
          })),
      ].map((spec) => [spec.name.toLowerCase(), spec]),
    ).values(),
  ];
  const selectOption = (name: string, value: string) => {
    const next = { ...selected, [name]: value };
    setSelected(next);
    const match = live?.variants.find((entry) =>
      entry.selectedOptions.every((option) => next[option.name] === option.value),
    );
    if (match?.image) setImage(match.image.url);
  };
  const changeImage = (direction: number) => {
    const index = Math.max(0, product.gallery.indexOf(image));
    setImage(
      product.gallery[(index + direction + product.gallery.length) % product.gallery.length] ||
        image,
    );
  };
  const addSelection = () => {
    if (!available) return;
    add(
      {
        kind: "product",
        slug: product.slug,
        name: product.name,
        description,
        unit_price: price,
        currency,
        image,
        ...(variant
          ? { variantId: variant.id }
          : { finish: selected["Finish"] || "", size: selected["Size"] || "" }),
      },
      quantity,
    );
  };
  const sections = [
    ["product-overview", "Overview"],
    ["product-performance", guidance.furniture ? "Use & fit" : "Acoustic performance"],
    ["product-specifications", "Specs & installation"],
    ["product-faqs", "FAQs"],
  ];
  const faqItems = [
    {
      question: guidance.furniture
        ? "Will my equipment fit?"
        : "How much treatment does my room need?",
      answer: guidance.furniture
        ? "Check the product dimensions against your equipment, including ventilation and cable clearances. Ask the team to confirm usable space and load ratings for the final product."
        : "Start with room dimensions, surface materials, listening positions and how the room is used. The team can help you plan placement and coverage; a product count alone cannot describe the result.",
    },
    {
      question: "Can I request a custom size or finish?",
      answer:
        "Share your requirements with the team through the custom-quote link. They will confirm which options are possible and provide a project-specific quotation.",
    },
    {
      question: "Where can I find technical documents?",
      answer: downloads.length
        ? "Available product documents are linked under Specifications & installation. Contact the team if you need a specific report or drawing."
        : "Verified product sheets and installation documents have not been supplied for this preview. You can request the information you need from the team.",
    },
    {
      question: product.sample
        ? "Can I buy this preview product?"
        : "How do purchases and custom projects work?",
      answer: product.sample
        ? "This is a design preview with sample products and indicative prices. You can save selections in the bag, but checkout is unavailable. Final product details will be confirmed before online purchasing is enabled."
        : "Standard available products can be added to your bag. Shipping, taxes, pricing and availability are confirmed at checkout. Custom room treatment and project requirements are quoted separately.",
    },
  ];
  return (
    <article
      className="ta-product-page"
      data-testid="product-detail"
      data-product-source={live ? "shopify" : "preview"}
    >
      <div className="ta-shell">
        <nav className="ta-product-breadcrumb" aria-label="Breadcrumb">
          <Link to="/products" data-testid="breadcrumb-products">
            Products
          </Link>
          <span>/</span>
          <a href={`/products?family=${encodeURIComponent(product.family)}`}>{familyName}</a>
          <span>/</span>
          <span aria-current="page">{product.name}</span>
        </nav>
        <section className="ta-product-hero" aria-label="Product and purchase options">
          <div className="ta-product-gallery">
            <div
              className="ta-product-thumbnails"
              role="group"
              aria-label="Product images"
              data-testid="product-thumbnails"
            >
              {product.gallery.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={image === url}
                  data-testid={`product-thumb-${index}`}
                  onClick={() => setImage(url)}
                >
                  <img src={url} alt="" loading={index ? "lazy" : "eager"} />
                </button>
              ))}
            </div>
            <div className="ta-product-main-photo">
              <img
                src={image}
                alt={variant?.image?.altText || `${product.name} product view`}
                data-testid="product-main-image"
              />
              <span className="ta-product-photo-note">
                {product.sample ? "Reference photography" : "Product gallery"}
              </span>
              <div className="ta-product-gallery-tools">
                {product.gallery.length > 1 && (
                  <div>
                    <button onClick={() => changeImage(-1)} aria-label="Previous product image">
                      <ChevronLeft size={17} />
                    </button>
                    <button onClick={() => changeImage(1)} aria-label="Next product image">
                      <ChevronRight size={17} />
                    </button>
                  </div>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <button aria-label="Enlarge product image">
                      <Maximize2 size={16} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="ta-product-zoom">
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogDescription>
                      {product.sample
                        ? "Reference photography for this design preview."
                        : "Product photograph"}
                    </DialogDescription>
                    <img src={image} alt={product.name} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="ta-product-purchase">
            <p className="ta-micro ta-rust">{familyName}</p>
            <h1 data-testid="product-name">{product.name}</h1>
            <p className="ta-product-purpose">{product.purpose}</p>
            <div className="ta-product-pricing">
              <p data-testid="product-price">{money(price, currency)}</p>
              <span>{product.sample ? "Sample price / per item" : "Per item"}</span>
            </div>
            <div className="ta-product-options">
              {options.map((option) => (
                <fieldset key={option.name}>
                  <legend>
                    {option.name}
                    <span>
                      {option.values.find((value) => value.id === selected[option.name])?.label}
                    </span>
                  </legend>
                  <div
                    className={
                      option.values.some((value) => value.swatch)
                        ? "ta-product-swatches"
                        : "ta-product-option-buttons"
                    }
                  >
                    {option.values.map((value) => (
                      <button
                        key={value.id}
                        onClick={() => selectOption(option.name, value.id)}
                        aria-label={value.label}
                        aria-pressed={selected[option.name] === value.id}
                        data-testid={
                          option.name === "Finish"
                            ? `finish-${value.id}`
                            : `option-${option.name.toLowerCase()}-${value.id.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`
                        }
                      >
                        {value.swatch && (
                          <span
                            className="ta-product-swatch"
                            style={{ backgroundColor: value.swatch }}
                          />
                        )}
                        {value.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="ta-product-buy-row">
              <div className="ta-product-quantity">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={15} />
                </button>
                <input
                  type="number"
                  min={1}
                  max={99}
                  step={1}
                  aria-label="Quantity"
                  value={quantity}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setQuantity(
                      Number.isFinite(value) ? Math.max(1, Math.min(99, Math.trunc(value))) : 1,
                    );
                  }}
                />
                <button
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                  disabled={quantity >= 99}
                >
                  <Plus size={15} />
                </button>
              </div>
              <button
                className="ta-button ta-product-add"
                data-testid="product-add-basket"
                disabled={!available}
                onClick={addSelection}
              >
                <Plus size={16} />
                {!available ? (variant ? "Sold out" : "Combination unavailable") : "Add to bag"}
              </button>
            </div>
            <div className="ta-product-purchase-links">
              <Link to="/basket" className="ta-text-link" data-testid="product-view-basket">
                View bag <ArrowRight size={14} />
              </Link>
              <a href={quoteHref} className="ta-text-link">
                Custom size or project? <ArrowUpRight size={14} />
              </a>
            </div>
            <p className="ta-product-purchase-note" role="status">
              {product.sample
                ? "Design preview. Prices and options are illustrative; purchasing is unavailable."
                : !available
                  ? "Choose an available option or ask the team about alternatives."
                  : "Shipping, taxes and availability are confirmed at checkout."}
            </p>
          </div>
        </section>
        <div className="ta-product-benefits" aria-label="Product considerations">
          {guidance.benefits.map((benefit, index) => {
            const Icon = [Waves, Layers3, SlidersHorizontal][index] || Check;
            return (
              <div key={benefit}>
                <Icon size={22} strokeWidth={1.3} />
                <span>{benefit}</span>
              </div>
            );
          })}
        </div>
      </div>
      <nav className="ta-product-section-nav" aria-label="Product sections">
        <div className="ta-shell">
          {sections.map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </div>
      </nav>
      <div className="ta-shell ta-product-details">
        <section
          id="product-overview"
          className="ta-product-overview"
          data-product-section="overview"
        >
          <div>
            <p className="ta-micro ta-rust">Overview</p>
            <h2>{guidance.headline}</h2>
            <p>{guidance.overview}</p>
            <a
              href={guidance.furniture ? quoteHref : `/build-a-room?${roomParams}`}
              className="ta-text-link"
              data-testid="product-configure-cta"
            >
              {guidance.furniture
                ? "Talk through your setup"
                : roomParams.size
                  ? "See this finish in a room"
                  : "Explore a room layout"}{" "}
              <ArrowUpRight size={15} />
            </a>
          </div>
          <figure>
            <img
              src={product.gallery[1] || product.gallery[0]}
              alt={`${product.name} material or room reference`}
              loading="lazy"
            />
            <figcaption>
              {product.sample
                ? "Reference photography / Illustrative material and room context"
                : "From the product gallery"}
            </figcaption>
          </figure>
        </section>
        <section
          id="product-performance"
          className="ta-product-performance"
          data-product-section="performance"
        >
          <div>
            <p className="ta-micro ta-rust">
              {guidance.furniture ? "Use & fit" : "Acoustic performance"}
            </p>
            <h2>{guidance.performanceTitle}</h2>
            <p>{guidance.performance}</p>
          </div>
          <aside>
            <Ruler size={26} strokeWidth={1.2} />
            <h3>{guidance.furniture ? "Confirm fit and assembly" : "Measured data matters"}</h3>
            <p>
              {guidance.furniture
                ? "Request the final dimensions, load rating and assembly guide for your setup."
                : "A verified frequency-response curve and test conditions have not been supplied. Request the relevant test report before specifying."}
            </p>
            <a href={quoteHref} className="ta-text-link">
              {guidance.furniture ? "Request a product sheet" : "Request verified test data"}
              <ArrowUpRight size={15} />
            </a>
          </aside>
        </section>
        <section
          id="product-specifications"
          className="ta-product-specification-section"
          data-product-section="specifications"
        >
          <div className="ta-product-section-heading">
            <p className="ta-micro ta-rust">The details</p>
            <h2>Specifications & installation.</h2>
            {product.sample && (
              <p>
                Sample specifications for this design preview. Confirm final product details with
                the team.
              </p>
            )}
          </div>
          <div className="ta-product-spec-grid">
            <dl>
              {specs.map((spec) => (
                <div key={spec.name}>
                  <dt>{spec.name}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
            <aside className="ta-product-downloads">
              <h3>Technical downloads</h3>
              {downloads.length ? (
                downloads.map((file) => (
                  <a href={file.url} key={file.url} target="_blank" rel="noopener noreferrer">
                    <Download size={17} />
                    <span>{file.title}</span>
                    <ArrowUpRight size={14} />
                  </a>
                ))
              ) : (
                <>
                  <p>
                    Verified product sheets and installation documents will be added with the final
                    catalogue.
                  </p>
                  <a href={quoteHref} className="ta-text-link">
                    Request a document <ArrowUpRight size={15} />
                  </a>
                </>
              )}
            </aside>
          </div>
          <div className="ta-product-installation">
            <h3>{guidance.furniture ? "Set up with care." : "Plan the installation."}</h3>
            <p>
              {product.installation || "Confirm the appropriate installation method with the team."}
              {product.sample ? " (Sample installation guidance.)" : ""}
            </p>
            <ol>
              {(guidance.furniture
                ? [
                    [
                      "Check your equipment",
                      "Confirm usable dimensions, ventilation and cable clearances.",
                    ],
                    [
                      "Confirm assembly",
                      "Follow the product-specific assembly guide and load limits.",
                    ],
                    ["Set up your space", "Keep access clear and review the setup before use."],
                  ]
                : [
                    [
                      "Plan the placement",
                      "Confirm the room layout, treatment positions and suitable surfaces.",
                    ],
                    [
                      "Confirm the mounting",
                      "Use the product-specific guide and appropriate fixings for the substrate.",
                    ],
                    [
                      "Fit, listen and review",
                      "Follow the installation instructions and reassess the room afterwards.",
                    ],
                  ]
              ).map(([title, copy], index) => (
                <li key={title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h4>{title}</h4>
                    <p>{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section id="product-faqs" className="ta-product-faqs" data-product-section="faqs">
          <div>
            <p className="ta-micro ta-rust">A little more clarity</p>
            <h2>
              Good questions.
              <br />
              Clear answers.
            </h2>
          </div>
          <div>
            {faqItems.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <Plus size={17} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
        {related.length > 0 && (
          <section
            className="ta-product-related"
            data-testid="related-products"
            data-product-section="related"
          >
            <div className="ta-product-related-heading">
              <h2>Related products.</h2>
              <Link to="/products" className="ta-text-link">
                Explore the range <ArrowRight size={16} />
              </Link>
            </div>
            <div>
              {related.slice(0, 3).map((item) => (
                <Link to="/products/$slug" params={{ slug: item.slug }} key={item.slug}>
                  <img src={item.gallery[0]} alt={item.name} loading="lazy" />
                  <div>
                    <p className="ta-micro">{item.family.replaceAll("-", " ")}</p>
                    <h3>{item.name}</h3>
                    <span>
                      {money(item.price, isStoreProduct(item) ? item.currency : "INR")}
                      {item.sample ? " / Sample" : ""}
                    </span>
                  </div>
                  <ArrowUpRight size={17} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <section className="ta-product-help" data-product-section="consultation">
        <div className="ta-shell">
          <div>
            <p className="ta-micro">A little guidance goes a long way</p>
            <h2>
              Need help choosing
              <br className="ta-mobile-break" /> the right{" "}
              {guidance.furniture ? "setup" : "treatment"}?
            </h2>
            <p>Share your room, dimensions and ideas with the team.</p>
          </div>
          <div>
            <a
              href={`/contact?${new URLSearchParams({ product: product.name })}`}
              className="ta-button ta-product-expert"
            >
              Consult the team <ArrowUpRight size={16} />
            </a>
            <a href={quoteHref} className="ta-button ta-product-quote">
              Get a custom quote <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
