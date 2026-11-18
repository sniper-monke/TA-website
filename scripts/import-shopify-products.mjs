import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

// Shopify exports contain quoted HTML, embedded newlines and escaped quotes.
export function parseCsv(input) {
  const rows = [];
  let row = [],
    field = "",
    quoted = false;
  input = input.replace(/^\uFEFF/, "");
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c === '"') {
      if (quoted && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (quoted || field === "") quoted = !quoted;
      else throw new Error("Unexpected quote in CSV");
    } else if (c === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && input[i + 1] === "\n") i++;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (quoted) throw new Error("Unterminated CSV field");
  row.push(field);
  if (row.some(Boolean)) rows.push(row);
  const headers = rows.shift() || [];
  for (const name of ["Handle", "Title", "Variant Price", "Published", "Status"])
    if (!headers.includes(name)) throw new Error(`Missing Shopify CSV column: ${name}`);
  return rows.map((values, index) => {
    if (values.length !== headers.length)
      throw new Error(`Wrong column count at record ${index + 2}`);
    return Object.fromEntries(headers.map((key, i) => [key, values[i] || ""]));
  });
}

export function plainText(html = "") {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<\/(?:p|div|li|tr|h[1-6])>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
      if (entity[0] === "#") {
        const code =
          entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
        return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
      }
      return (
        { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }[entity.toLowerCase()] ||
        match
      );
    })
    .replace(/[\t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// CSV exports omit collection membership. These are provisional display groups.
export function familyFor(title, tags) {
  const text = `${title} ${tags}`.toLowerCase();
  if (/bass trap|tube trap/.test(text)) return "bass-traps";
  if (/room kit/.test(text)) return "room-kits";
  if (/diffus|qrd|abfuser/.test(text)) return "diffusion";
  if (/timberslat|timber slat/.test(text)) return "timberslat";
  if (
    /table|desk|rack|stand|chair|pegboard/.test(title.toLowerCase()) &&
    !/divider|partition|standing|panels|qrd/.test(title.toLowerCase())
  )
    return "racks-and-tables";
  if (/panel|absor|foam|cloud|booth/.test(text)) return "absorption";
  return "accessories-and-materials";
}

const httpsUrl = (value) => {
  if (!value) return null;
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("Product images must use HTTPS");
  return url.href;
};

export function convertProducts(rows, currency = "INR") {
  const groups = new Map();
  for (const row of rows) {
    if (!row["Handle"]) throw new Error("Product record has no handle");
    const group = groups.get(row["Handle"]) || [];
    group.push(row);
    groups.set(row["Handle"], group);
  }
  const products = [];
  let excluded = 0;
  for (const [handle, records] of groups) {
    const main = records.find((r) => r["Title"]);
    if (!main) throw new Error(`Missing product title for ${handle}`);
    if (main["Published"].toLowerCase() !== "true" || main["Status"] !== "active") {
      excluded++;
      continue;
    }
    const options = [1, 2, 3]
      .filter((i) => main[`Option${i} Name`])
      .map((i) => ({
        name: main[`Option${i} Name`],
        values: [...new Set(records.map((r) => r[`Option${i} Value`]).filter(Boolean))],
        position: i,
      }));
    const variants = records
      .filter((r) => r["Variant Price"] !== "")
      .map((r, index) => {
        const price = Number(r["Variant Price"]);
        if (!Number.isFinite(price) || price < 0)
          throw new Error(`Invalid variant price for ${handle}`);
        const selectedOptions = options.map((o) => ({
          name: o.name,
          value: r[`Option${o.position} Value`],
        }));
        if (selectedOptions.some((o) => !o.value))
          throw new Error(`Missing variant option for ${handle}`);
        const image = httpsUrl(r["Variant Image"]);
        return {
          id: `csv:${handle}:${index + 1}`,
          title: selectedOptions.map((o) => o.value).join(" / "),
          sku: r["Variant SKU"],
          availableForSale: false,
          price: { amount: r["Variant Price"], currencyCode: currency },
          compareAtPrice: r["Variant Compare At Price"] || null,
          selectedOptions,
          image: image ? { url: image, altText: r["Image Alt Text"] || main["Title"] } : null,
        };
      });
    if (!variants.length) throw new Error(`No priced variants for ${handle}`);
    const gallery = [
      ...new Set(
        records
          .filter((r) => r["Image Src"])
          .sort((a, b) => Number(a["Image Position"]) - Number(b["Image Position"]))
          .map((r) => httpsUrl(r["Image Src"])),
      ),
    ];
    const field = (name, key) => plainText(main[`${name} (product.metafields.custom.${key})`]);
    const family = familyFor(main["Title"], main["Tags"]);
    products.push({
      slug: handle,
      name: main["Title"],
      family,
      families: [family],
      purpose: (plainText(main["SEO Description"]) || plainText(main["Body (HTML)"])).slice(0, 260),
      description: plainText(main["Body (HTML)"]),
      price: Math.min(...variants.map((v) => Number(v.price.amount))),
      currency,
      gallery: gallery.length ? gallery : ["/brand/timber-mark.svg"],
      dims: field("Sizes and Configuration", "sizes_and_configuration"),
      material: field("Materials & Compatibility", "materials_compatibility"),
      installation: field("Installation Instructions", "installation_instructions"),
      featured: /(?:^|,\s*)(best seller|featured)(?:,|$)/i.test(main["Tags"]),
      sample: false,
      source: "csv",
      options: options.map(({ name, values }) => ({ name, values })),
      variants,
      specifications: [
        ["Product information", field("Product Information", "product_information")],
        ["Key highlights", field("Key Highlights", "key_highlights")],
        ["In the box", field("What's in the Box", "what_s_in_the_box")],
        ["Care", field("Maintenance and Care", "maintenance_and_care")],
      ]
        .filter(([, value]) => value)
        .map(([name, value]) => ({ name, value })),
      downloads: [],
      vendor: main["Vendor"],
      tags: main["Tags"]
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      seo: { title: main["SEO Title"], description: main["SEO Description"] },
    });
  }
  return { products, excluded };
}

async function main() {
  const input = process.argv[2] || "docs/products_export_1 (1).csv";
  const currency = process.argv[3] || "INR";
  new Intl.NumberFormat("en", { style: "currency", currency });
  const rows = parseCsv(await readFile(input, "utf8"));
  const { products, excluded } = convertProducts(rows, currency);
  const labels = {
    absorption: "Absorption Panels",
    timberslat: "TimberSlat",
    "bass-traps": "Bass Traps",
    diffusion: "Diffusion",
    "room-kits": "Room Kits",
    "racks-and-tables": "Racks & Tables",
    "accessories-and-materials": "Accessories & Materials",
  };
  const families = Object.entries(labels)
    .filter(([slug]) => products.some((p) => p.family === slug))
    .map(([slug, name], index) => ({
      slug,
      name,
      index: String(index + 1).padStart(2, "0"),
      principle: "",
      blurb: "",
      image: products.find((p) => p.family === slug).gallery[0],
    }));
  const report = {
    sourceFile: input.replaceAll("\\", "/"),
    rows: rows.length,
    products: products.length,
    variants: products.reduce((n, p) => n + p.variants.length, 0),
    images: products.reduce((n, p) => n + p.gallery.length, 0),
    excluded,
    currency,
    currencyAssumed: true,
    collectionsInferred: true,
    inventoryAvailable: false,
    shopifyIdsAvailable: false,
  };
  await writeFile(
    "src/data/shopify-products.json",
    JSON.stringify({ report, families, products }, null, 2) + "\n",
  );
  console.log(JSON.stringify(report, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  await main();
