import { useSession as createSession, setResponseHeader } from "@tanstack/react-start/server";
import { catalogue, importReport, importedProducts } from "./catalogue.server";

function config() {
  const email = process.env["ADMIN_EMAIL"]?.trim().toLowerCase();
  const hash = process.env["ADMIN_PASSWORD_HASH"];
  const secret = process.env["ADMIN_SESSION_SECRET"];
  if (!email || !hash || !secret || secret.length < 32)
    throw new Error("Team access is not configured. Run npm run admin:setup on the server.");
  return { email, hash, secret };
}
const session = () =>
  createSession<{ email: string; version: string }>({
    name: "timber-admin",
    password: config().secret,
    maxAge: 28800,
    sessionHeader: false,
    cookie: {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "strict",
      path: "/",
    },
  });
export async function verifyPassword(password: string, stored: string) {
  const [algorithm, rounds, salt, expected] = stored.split(":");
  if (
    algorithm !== "pbkdf2" ||
    rounds !== "600000" ||
    !salt ||
    !expected ||
    !/^[a-f0-9]{64}$/.test(expected)
  )
    return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: new TextEncoder().encode(salt), iterations: 600000 },
    key,
    256,
  );
  const actual = Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, "0")).join("");
  let difference = 0;
  for (let i = 0; i < actual.length; i++)
    difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return difference === 0;
}
// Bounded per-process budget. Production also needs rate limiting at the host across instances.
let attempts = 0;
let windowStart = 0;
export async function login(email: string, password: string) {
  setResponseHeader("Cache-Control", "no-store");
  const now = Date.now();
  if (now - windowStart > 60000) {
    attempts = 0;
    windowStart = now;
  }
  if (++attempts > 10) throw new Error("Too many sign-in attempts. Try again in a minute.");
  const settings = config();
  const valid = await verifyPassword(password, settings.hash);
  if (!valid || email.trim().toLowerCase() !== settings.email)
    throw new Error("Email or password is incorrect.");
  const current = await session();
  await current.clear();
  await current.update({ email: settings.email, version: settings.hash });
  return { ok: true };
}
export async function identity() {
  setResponseHeader("Cache-Control", "no-store");
  try {
    const settings = config();
    const current = await session();
    return current.data.email === settings.email && current.data.version === settings.hash
      ? { email: settings.email }
      : null;
  } catch {
    return null;
  }
}
export async function logout() {
  await (await session()).clear();
  return { ok: true };
}
export async function dashboard() {
  if (!(await identity())) throw new Error("Sign in to view the workspace.");
  const domain = process.env["SHOPIFY_STORE_DOMAIN"]?.trim() || "";
  const validDomain = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain);
  let data;
  let error = "";
  try {
    data = await catalogue();
  } catch (cause) {
    error = cause instanceof Error ? cause.message : "Shopify could not be reached.";
  }
  return {
    report: importReport,
    products: data?.products || [],
    families: data?.families || [],
    productStats: !process.env["SHOPIFY_STOREFRONT_PRIVATE_TOKEN"]
      ? importedProducts.map((p) => ({
          slug: p.slug,
          variantCount: p.variants.length,
          skus: p.variants.map((v) => ("sku" in v ? String(v.sku) : "")).filter(Boolean),
        }))
      : [],
    mode: error ? "error" : process.env["SHOPIFY_STOREFRONT_PRIVATE_TOKEN"] ? "shopify" : "csv",
    error,
    domain: validDomain ? domain : "",
    tokenConfigured: !!process.env["SHOPIFY_STOREFRONT_PRIVATE_TOKEN"],
    adminUrl: validDomain ? `https://${domain}/admin` : null,
  };
}
