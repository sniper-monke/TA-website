import assert from "node:assert/strict";

// Run against an already-running dev server; do not create a second optimizer
// over the same checkout's node_modules/.vite cache.
const origin = new URL(process.argv[2] || "http://127.0.0.1:8080");
async function get(path) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, `${path} returned ${response.status}`);
  return response.text();
}
const modules = [
  "/src/routes/__root.tsx",
  "/src/reference/pages/Products.tsx",
  "/src/components/experience/ProductExperience.tsx",
  "/node_modules/.vite/deps/react-dom_client.js",
];
const reactUrls = [];
for (const path of modules) {
  const source = await get(path);
  const match = source.match(/(?:["'])(\/node_modules\/\.vite\/deps\/react\.js\?v=[^"']+)["']/);
  assert.ok(match, `No optimized React import found in ${path}`);
  reactUrls.push(match[1]);
}
assert.equal(
  new Set(reactUrls).size,
  1,
  `React URLs differ across renderer and routes: ${JSON.stringify(reactUrls)}`,
);
const staleUrl = new URL(reactUrls[0], origin);
staleUrl.searchParams.set("v", "stale-react-regression");
const stale = await fetch(staleUrl, { signal: AbortSignal.timeout(30000) });
assert.equal(
  stale.status,
  504,
  "An obsolete React URL must be rejected, not served as another React instance",
);
console.log(`PASS: renderer and routes share ${reactUrls[0]}; obsolete React requests return 504.`);
