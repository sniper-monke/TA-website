import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseCsv, convertProducts, plainText, familyFor } from "./import-shopify-products.mjs";

test("parses quoted multiline HTML, commas, escaped quotes and BOM", () => {
  const rows = parseCsv(
    '\uFEFFHandle,Title,Variant Price,Published,Status,Body\r\na,"A, B",10,true,active,"<p>He said ""hello""</p>\nNext"\r\n',
  );
  assert.equal(rows[0].Title, "A, B");
  assert.equal(rows[0].Body, '<p>He said "hello"</p>\nNext');
  assert.throws(
    () => parseCsv('Handle,Title,Variant Price,Published,Status\na,"broken'),
    /Unterminated/,
  );
});
test("converts the client export without inventing stock or Shopify IDs", async () => {
  const rows = parseCsv(await readFile("docs/products_export_1 (1).csv", "utf8"));
  const { products, excluded } = convertProducts(rows);
  assert.equal(products.length, 79);
  assert.equal(excluded, 0);
  assert.equal(
    products.reduce((n, p) => n + p.variants.length, 0),
    1186,
  );
  assert.equal(new Set(products.map((p) => p.slug)).size, 79);
  for (const p of products) {
    assert.equal(p.price, Math.min(...p.variants.map((v) => Number(v.price.amount))));
    assert(p.variants.every((v) => !v.availableForSale && v.id.startsWith("csv:")));
    assert(
      p.gallery.every((url) => url.startsWith("https://") || url === "/brand/timber-mark.svg"),
    );
    for (const v of p.variants)
      for (const o of v.selectedOptions)
        assert(p.options.find((x) => x.name === o.name).values.includes(o.value));
  }
  assert.equal(plainText("<script>alert(1)</script><p>A &amp; B</p>"), "A & B");
  assert.equal(familyFor("Timberslat Soffit Bass Traps", "slat"), "bass-traps");
  const unpublished = rows.map((r) => ({ ...r, Published: "false" }));
  assert.equal(convertProducts(unpublished).products.length, 0);
});
