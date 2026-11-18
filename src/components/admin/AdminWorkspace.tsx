import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowUpRight, Download, LogOut, RefreshCw, Search, X } from "lucide-react";
import { adminDashboard, adminLogout, adminProduct } from "@/lib/admin";
import { money, type StoreProduct } from "@/lib/storefront";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const tabs = ["Overview", "Products", "Media & quality", "Connection"] as const;
type Tab = (typeof tabs)[number];
function download(name: string, content: string, type = "text/csv") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const csvCell = (value: unknown) =>
  `"${String(value ?? "")
    .replace(/^[=+@\-\t\r]/, "'$&")
    .replaceAll('"', '""')}"`;
const needsReview = (p: StoreProduct) =>
  !p.dims ||
  !p.material ||
  !p.installation ||
  !p.purpose ||
  p.gallery[0] === "/brand/timber-mark.svg";

export function AdminWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Overview");
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("");
  const [sort, setSort] = useState("name");
  const [reviewOnly, setReviewOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const query = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => adminDashboard(),
    retry: false,
    staleTime: 0,
  });
  const detail = useQuery({
    queryKey: ["admin-product", selected],
    queryFn: () => adminProduct({ data: { handle: selected! } }),
    enabled: !!selected,
    retry: false,
  });
  const data = query.data;
  const products = useMemo(() => data?.products || [], [data]);
  const visible = useMemo(
    () =>
      products
        .filter((p) => {
          const keywords = [
            p.name,
            p.slug,
            ...(data?.productStats.find((s) => s.slug === p.slug)?.skus || []),
          ]
            .join(" ")
            .toLowerCase();
          return (
            keywords.includes(search.toLowerCase().trim()) &&
            (!family || p.families.includes(family)) &&
            (!reviewOnly || needsReview(p))
          );
        })
        .sort((a, b) =>
          sort === "price-up"
            ? a.price - b.price
            : sort === "price-down"
              ? b.price - a.price
              : a.name.localeCompare(b.name),
        ),
    [products, search, family, sort, reviewOnly, data],
  );
  const exportProducts = () => {
    const lines = [
      ["Handle", "Title", "Family", "Price", "Currency", "Source", "Images", "Needs review"],
      ...visible.map((p) => [
        p.slug,
        p.name,
        p.family,
        p.price,
        p.currency,
        p.source,
        p.gallery.length,
        needsReview(p),
      ]),
    ];
    download(
      "timber-catalogue-review.csv",
      lines.map((r) => r.map(csvCell).join(",")).join("\r\n"),
    );
  };
  const signOut = async () => {
    try {
      await adminLogout();
      queryClient.removeQueries({ queryKey: ["admin-dashboard"] });
      queryClient.removeQueries({ queryKey: ["admin-product"] });
      await navigate({ to: "/admin/login" });
    } catch {
      setActionError("Could not sign out. Please try again.");
    }
  };
  const p = detail.data?.product;
  return (
    <section className="ta-admin-workspace">
      <header className="ta-admin-heading">
        <div>
          <p className="label-eyebrow">Timber Acoustics / Team workspace</p>
          <h1>Store overview</h1>
          <p>Manage your catalogue, review content and check your store connection.</p>
        </div>
        <div className="ta-admin-actions">
          <a href="/" target="_blank" rel="noreferrer">
            View store <ArrowUpRight size={15} />
          </a>
          <button
            onClick={() => {
              void query.refetch();
            }}
            disabled={query.isFetching}
          >
            <RefreshCw size={15} />
            {query.isFetching ? "Checking…" : "Refresh"}
          </button>
          <button
            onClick={() => {
              void signOut();
            }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </header>
      <nav className="ta-admin-tabs" aria-label="Workspace sections">
        {tabs.map((name) => (
          <button
            key={name}
            aria-current={tab === name ? "page" : undefined}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </nav>
      {(query.error || actionError) && (
        <p role="alert" className="ta-admin-alert">
          {actionError || query.error?.message}
        </p>
      )}
      {query.isLoading && (
        <p role="status" className="ta-admin-card">
          Loading workspace…
        </p>
      )}
      {data && (
        <>
          <div className="ta-admin-status">
            <span className={`ta-admin-dot ${data.mode === "shopify" ? "connected" : ""}`} />
            <strong>
              {data.mode === "shopify"
                ? "Live Shopify catalogue"
                : data.mode === "error"
                  ? "Connection needs attention"
                  : "Shopify export loaded"}
            </strong>
            <span>
              {data.mode === "csv" ? "Checkout and inventory await connection" : data.domain}
            </span>
          </div>
          {data.error && (
            <p className="ta-admin-alert" role="alert">
              {data.error}
            </p>
          )}
          {tab === "Overview" && (
            <>
              <div className="ta-admin-stats">
                {[
                  ["Products", products.length],
                  ["Export variants", data.report.variants],
                  ["Export image references", data.report.images],
                  ["Collections", data.families.length],
                ].map(([label, count]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{Number(count).toLocaleString("en-IN")}</strong>
                  </div>
                ))}
              </div>
              <div className="ta-admin-columns">
                <section className="ta-admin-card">
                  <p className="label-eyebrow">Catalogue</p>
                  <h2>Your products, at a glance.</h2>
                  <p>Browse products, inspect variants and download a filtered catalogue.</p>
                  <div className="ta-admin-metrics">
                    <p>
                      <span>Catalogue source</span>
                      <strong>
                        {data.mode === "shopify"
                          ? "Live Shopify"
                          : data.mode === "error"
                            ? "Unavailable"
                            : "Shopify CSV export"}
                      </strong>
                    </p>
                    <p>
                      <span>Products available</span>
                      <strong>{products.length}</strong>
                    </p>
                    <p>
                      <span>Collections</span>
                      <strong>{data.families.length}</strong>
                    </p>
                  </div>
                  <button className="ta-admin-primary" onClick={() => setTab("Products")}>
                    Browse products <ArrowUpRight size={15} />
                  </button>
                </section>
                <section className="ta-admin-card">
                  <p className="label-eyebrow">Catalogue health</p>
                  <h2>Content to review</h2>
                  <p>{products.filter(needsReview).length} products have missing content fields.</p>
                  <div className="ta-admin-metrics">
                    {[
                      ["No dimensions", products.filter((p) => !p.dims).length],
                      ["No material details", products.filter((p) => !p.material).length],
                      ["No installation field", products.filter((p) => !p.installation).length],
                      [
                        "No product image",
                        products.filter((p) => p.gallery[0] === "/brand/timber-mark.svg").length,
                      ],
                    ].map(([label, count]) => (
                      <p key={label}>
                        <span>{label}</span>
                        <strong>{count}</strong>
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setReviewOnly(true);
                      setPage(0);
                      setTab("Media & quality");
                    }}
                  >
                    Review content <ArrowUpRight size={15} />
                  </button>
                </section>
              </div>
              <section className="ta-admin-card">
                <h2>Store operations</h2>
                <p>
                  Use your Shopify account for operational changes. This workspace does not yet
                  write to Shopify.
                </p>
                <div className="ta-admin-operation-links">
                  {[
                    ["Products & inventory", "products"],
                    ["Orders & fulfilment", "orders"],
                    ["Customers", "customers"],
                    ["Discounts", "discounts"],
                    ["Analytics", "dashboards"],
                    ["Store settings", "settings"],
                  ].map(([label, path]) =>
                    data.adminUrl ? (
                      <a
                        key={path}
                        href={`${data.adminUrl}/${path}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {label}
                        <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <span key={path}>
                        {label}
                        <small>Awaiting store connection</small>
                      </span>
                    ),
                  )}
                </div>
              </section>
            </>
          )}
          {(tab === "Products" || tab === "Media & quality") && (
            <>
              <div className="ta-admin-section-title">
                <div>
                  <h2>{tab === "Products" ? "Your catalogue" : "Media & content review"}</h2>
                  <p>
                    Search names, handles or exported SKUs. Open a product to inspect its variants.
                  </p>
                </div>
                <button onClick={exportProducts}>
                  <Download size={15} />
                  Export filtered CSV
                </button>
              </div>
              <div className="ta-admin-filters">
                <label className="ta-admin-search">
                  <Search size={16} />
                  <input
                    aria-label="Search products or SKUs"
                    placeholder="Search products or SKUs"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                  />
                </label>
                <select
                  aria-label="Collection"
                  value={family}
                  onChange={(e) => {
                    setFamily(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All collections</option>
                  {data.families.map((f) => (
                    <option key={f.slug} value={f.slug}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="name">Name A–Z</option>
                  <option value="price-up">Price low to high</option>
                  <option value="price-down">Price high to low</option>
                </select>
                <label>
                  <input
                    type="checkbox"
                    checked={reviewOnly}
                    onChange={(e) => {
                      setReviewOnly(e.target.checked);
                      setPage(0);
                    }}
                  />
                  Needs review
                </label>
              </div>
              <p className="ta-admin-muted">
                {visible.length} products · prices{" "}
                {data.mode === "csv" ? "from export, assumed INR" : "from Shopify"}
              </p>
              {tab === "Products" ? (
                <div className="ta-admin-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Collection</th>
                        <th>From</th>
                        <th>Media</th>
                        <th>Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.slice(page * 15, (page + 1) * 15).map((product) => (
                        <tr key={product.slug}>
                          <td>
                            <button
                              className="ta-admin-product-button"
                              onClick={() => setSelected(product.slug)}
                            >
                              <img src={product.gallery[0]} alt="" loading="lazy" />
                              <span>
                                {product.name}
                                <small>
                                  {data.productStats.find((s) => s.slug === product.slug)
                                    ?.variantCount ?? "Live"}{" "}
                                  variants
                                </small>
                              </span>
                            </button>
                          </td>
                          <td>
                            {data.families.find((f) => f.slug === product.family)?.name ||
                              product.family}
                          </td>
                          <td>{money(product.price, product.currency)}</td>
                          <td>{product.gallery.length} images</td>
                          <td>
                            <span
                              className={`ta-admin-badge ${needsReview(product) ? "review" : "complete"}`}
                            >
                              {needsReview(product) ? "Needs review" : "Complete"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="ta-admin-media-grid">
                  {visible.slice(page * 15, (page + 1) * 15).map((product) => (
                    <button key={product.slug} onClick={() => setSelected(product.slug)}>
                      <img src={product.gallery[0]} alt={product.name} loading="lazy" />
                      <strong>{product.name}</strong>
                      <span>{product.gallery.length} image references</span>
                      <small>
                        {[
                          !product.dims && "Dimensions",
                          !product.material && "Material",
                          !product.installation && "Installation",
                        ]
                          .filter(Boolean)
                          .join(", ") || "Core fields complete"}
                      </small>
                    </button>
                  ))}
                </div>
              )}
              {!visible.length && <p className="ta-admin-card">No products match these filters.</p>}
              <div className="ta-admin-pagination">
                <button disabled={page === 0} onClick={() => setPage((v) => v - 1)}>
                  Previous
                </button>
                <span>
                  Page {page + 1} of {Math.max(1, Math.ceil(visible.length / 15))}
                </span>
                <button
                  disabled={(page + 1) * 15 >= visible.length}
                  onClick={() => setPage((v) => v + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
          {tab === "Connection" && (
            <div className="ta-admin-connection">
              <section className="ta-admin-card">
                <p className="label-eyebrow">Shopify / Server connection</p>
                <h2>Store connection</h2>
                <div className="ta-admin-metrics">
                  <p>
                    <span>Store domain</span>
                    <strong>{data.domain || "Not configured"}</strong>
                  </p>
                  <p>
                    <span>Private token</span>
                    <strong>
                      {data.tokenConfigured ? "Configured (hidden)" : "Not configured"}
                    </strong>
                  </p>
                  <p>
                    <span>API health</span>
                    <strong>
                      {data.mode === "shopify"
                        ? "Catalogue query succeeded"
                        : data.mode === "error"
                          ? "Failed"
                          : "Not connected"}
                    </strong>
                  </p>
                </div>
                <p>
                  Add <code>SHOPIFY_STORE_DOMAIN</code> and{" "}
                  <code>SHOPIFY_STOREFRONT_PRIVATE_TOKEN</code> to server environment secrets.
                  Restart, then Refresh. Tokens are never displayed here.
                </p>
                <p>
                  Once connected, live Shopify data replaces the CSV. Failed connections show an
                  error rather than stale export data.
                </p>
                {data.adminUrl && (
                  <a href={data.adminUrl} target="_blank" rel="noreferrer">
                    Open Shopify admin <ArrowUpRight size={15} />
                  </a>
                )}
              </section>
            </div>
          )}
        </>
      )}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent
          className="ta-admin-product-dialog translate-x-0 translate-y-0"
          overlayClassName="ta-admin-dialog-overlay"
        >
          <DialogTitle>{p?.name || "Product details"}</DialogTitle>
          <DialogDescription>
            Inspect catalogue content, options and variant pricing. Changes are managed in Shopify.
          </DialogDescription>
          {detail.isFetching && <p role="status">Loading product…</p>}
          {detail.error && <p role="alert">{detail.error.message}</p>}
          {p && (
            <>
              <div className="ta-admin-detail-actions">
                <a
                  href={`/products/${encodeURIComponent(p.slug)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View storefront <ArrowUpRight size={14} />
                </a>
                <button
                  onClick={() =>
                    download(`${p.slug}.json`, JSON.stringify(p, null, 2), "application/json")
                  }
                >
                  <Download size={14} />
                  Download product JSON
                </button>
              </div>
              <p className="ta-admin-muted">
                {p.source === "csv"
                  ? "CSV snapshot · stock unknown · checkout disabled"
                  : "Live Shopify product"}
              </p>
              <div className="ta-admin-detail-gallery">
                {p.gallery.map((url, i) => (
                  <a key={`${url}-${i}`} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt={`${p.name} — image ${i + 1}`} loading="lazy" />
                  </a>
                ))}
              </div>
              <p className="ta-admin-description">
                {p.description || p.purpose || "No description supplied."}
              </p>
              <div className="ta-admin-metrics">
                {[
                  ["Handle", p.slug],
                  ["Dimensions", p.dims],
                  ["Material", p.material],
                  ["Installation", p.installation],
                ].map(([label, value]) => (
                  <p key={label}>
                    <span>{label}</span>
                    <strong>{value || "Not supplied"}</strong>
                  </p>
                ))}
              </div>
              <h3>Variants ({p.variants.length})</h3>
              <div className="ta-admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Options</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.variants.map((v) => (
                      <tr key={v.id}>
                        <td>{v.title}</td>
                        <td>{"sku" in v ? String(v.sku) || "—" : "—"}</td>
                        <td>{money(v.price.amount, v.price.currencyCode)}</td>
                        <td>
                          {p.source === "csv"
                            ? "Unknown from export"
                            : v.availableForSale
                              ? "Available"
                              : "Unavailable"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setSelected(null)}>
                <X size={14} />
                Close product
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
