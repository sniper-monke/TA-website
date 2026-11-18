import { randomBytes, pbkdf2Sync } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
let existing = "";
try {
  existing = await readFile(".env.local", "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (/^ADMIN_PASSWORD_HASH=.+/m.test(existing) && !process.argv.includes("--rotate"))
  throw new Error(
    "Admin already configured. Use --rotate to replace credentials and invalidate sessions.",
  );
const email =
  process.argv.find((a) => a.startsWith("--email="))?.slice(8) || "admin@timberacoustics.local";
if (!/^[\w.+-]+@[\w.-]+\.[a-z]+$/i.test(email)) throw new Error("Invalid email");
const password = randomBytes(24).toString("base64url");
const salt = randomBytes(16).toString("hex");
const hash = pbkdf2Sync(password, salt, 600000, 32, "sha256").toString("hex");
const values = {
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD_HASH: `pbkdf2:600000:${salt}:${hash}`,
  ADMIN_SESSION_SECRET: randomBytes(48).toString("base64url"),
};
for (const [key, value] of Object.entries(values)) {
  existing = existing.replace(new RegExp(`^${key}=.*\\r?\\n?`, "gm"), "");
  existing = existing.trimEnd() + `\n${key}=${value}\n`;
}
await writeFile(".env.local", existing, { mode: 0o600 });
console.log(
  `Local admin created. Save this password; only its hash is stored.\nEmail: ${email}\nPassword: ${password}\nURL: /admin/login\nRestart the dev server to load .env.local.`,
);
