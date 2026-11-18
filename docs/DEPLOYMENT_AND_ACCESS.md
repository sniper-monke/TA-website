# Deployment, admin access and troubleshooting

Updated 18 November 2026. This is the operational guide for local configuration and the user-reported Vercel deployment. A working production login/store connection has not yet been confirmed here.

## Credential types and storage

| Access                             | Purpose                                                           | Source / storage                                                                |
| ---------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Site team admin                    | Sign into this project's `/admin/login` and review catalogue data | Server environment settings; local development values in ignored `.env.local`   |
| Shopify staff/collaborator account | Operate the merchant's Shopify admin                              | Individual invitation from the client; separate Shopify identity/permissions    |
| Private Storefront API token       | Server-side product/collection reads and Shopify cart handoff     | Client's Headless storefront; local ignored env / hosting secrets               |
| Vercel project/team access         | Set deployment secrets, inspect builds/logs and redeploy          | Client/project owner grants access; no account password is stored in repository |

The original development email is `admin@timberacoustics.local`. Its current password is recorded on the originating workstation in ignored `docs/private/admin-access.md` and should also be saved in a password manager. The public/shareable docs intentionally contain no password, password hash, session secret or API token value.

The local-only credential note does not travel through Git. A fresh clone needs its own configured account or credentials supplied through the appropriate secret channel. The hash in `.env.local` cannot be reversed to recover a lost password.

## Environment variables: exact names and meaning

| Variable                           | Value shape                                                                     | Required for                     |
| ---------------------------------- | ------------------------------------------------------------------------------- | -------------------------------- |
| `ADMIN_EMAIL`                      | Configured login email                                                          | Site admin                       |
| `ADMIN_PASSWORD_HASH`              | Entire `pbkdf2:600000:<salt>:<64-character-hex-digest>` value                   | Site admin password verification |
| `ADMIN_SESSION_SECRET`             | Random generated string, at least 32 characters; setup generates a longer value | Sealed admin session cookies     |
| `SHOPIFY_STORE_DOMAIN`             | Permanent domain such as `example.myshopify.com`, without protocol or path      | Live Shopify connection          |
| `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` | Private Storefront token from the intended Headless storefront                  | Live Shopify connection          |

Use the exact names; none gets a `VITE_` prefix. A plaintext login password is not the value of `ADMIN_PASSWORD_HASH`. Admin access can work in CSV mode before Shopify credentials are available.

`.env.example` contains only empty/example configuration. `.env.local` is ignored and never pushed. A Git push or successful frontend deployment does not provision production secrets.

## Fix the Vercel error reported in this project

Reported message:

```text
Team access is not configured. Run npm run admin:setup on the server.
```

That message is thrown when an admin setting is absent or the session secret is shorter than 32 characters. It does not mean the application expects an interactive command shell inside a Vercel function.

1. Open the correct Vercel project and its **Settings / Environment Variables** page.
2. Add `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` using the complete values from the account you intend to deploy. Existing development values are available privately in `.env.local`; use a separate production account for final client handoff.
3. Select **Production** for production deployments and **Preview** as well if testing there. Check any branch-specific preview scoping.
4. Save and redeploy. Updating settings does not update a deployment that is already running; [Vercel requires a new deployment](https://vercel.com/docs/environment-variables/managing-environment-variables).
5. Open the new deployment's `/admin/login` and use the email/plaintext password corresponding to the uploaded hash.
6. If the message persists, check the project, environment and deployed revision, then check that all three values are nonempty and the secret has at least 32 characters. Paste values without extra wrapping quotes or newlines.

Do not add a random account-generation command to the build to work around this error. Generating credentials at build time does not provide a managed, stable production account or send its secrets into the host configuration.

Current `vercel.json` sets framework `tanstack-start`, install command `npm ci` and build command `npm run build`. Do not add duplicate Vite/TanStack plugins to address an environment-variable error.

The Vercel integration was suggested during troubleshooting, but no authenticated configuration operation was completed in this session. No live project URL or confirmed production environment values are recorded here.

## Create or rotate the local account

From the repository root:

```powershell
# Only when no local account exists:
npm run admin:setup

# Explicitly replace the existing local account:
npm run admin:setup -- --rotate --email=team@example.com
```

The script writes a new hash/session secret into `.env.local` and prints a generated password once. It preserves an existing account unless `--rotate` is supplied. It does not create a Shopify staff account or a user in a remote database.

After rotation, save the new plaintext password in the private note/password manager, restart local development and update all three Vercel admin settings together if deploying that account. Redeploy so the new server configuration is loaded. The previous password then no longer verifies against the new hash, and existing sessions become invalid after the new configuration is active.

The setup script always targets `.env.local`; it has no separate production-output option. If you want a distinct production identity, generate it in a separate private working copy rather than inadvertently replacing an account you still need locally. Copy the resulting settings into the host's secret UI.

## What the admin session provides

- One server-configured account, PBKDF2-SHA256 password hash, random salt and 600,000 iterations.
- HTTP-only sealed session cookie, eight-hour lifetime, SameSite=Strict and Secure in production.
- Existing TanStack CSRF protection; server functions independently enforce authentication.
- No-store responses for admin state. Sign-out clears the server session and relevant browser query state.
- Ten sign-in attempts per minute per process. Shared production rate limiting remains a host-level task because this counter does not span multiple server instances.
- No password-reset email, multi-user roles, MFA or audit-log implementation.

## Connect Shopify on Vercel

1. Obtain the permanent store domain, intended Headless storefront and private Storefront token from the client. Follow the [Shopify/client handoff](shopify-and-admin.md).
2. Add `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_PRIVATE_TOKEN` to the intended Vercel deployment environments. Redeploy.
3. Sign into the site admin, open **Connection** and click **Refresh**. A successful catalogue query must report live Shopify mode; merely having a token value present is not proof the API works.
4. Check products are published to that Headless channel, collections match navigation and required metafields are exposed to Storefront.
5. Verify actual option selection, availability, currencies, galleries and documents. The live source replaces the CSV fallback.
6. Run the agreed end-to-end checkout/order validation from the [launch checklist](LAUNCH_CHECKLIST.md).

The current adapter reads `custom.dimensions`, `custom.material`, `custom.installation`, `custom.specifications` and `custom.downloads`. Existing CSV custom-field names differ; see the [technical map](SHOPIFY_INTEGRATION.md) before assuming the same content appears automatically when switching to live mode.

## Troubleshooting table

| Symptom                                                | Likely boundary                                              | Action                                                                                                                   |
| ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Team access is not configured                          | Missing admin env or short session secret                    | Set all three admin variables in correct host environment; redeploy                                                      |
| Email or password is incorrect                         | Email/hash/password mismatch                                 | Use the password paired with the deployed hash, or deliberately rotate and update all account settings                   |
| Repeated sign-in fails with rate-limit message         | Per-process attempt budget                                   | Allow the one-minute window to pass, then retry with correct credentials                                                 |
| Login succeeds but protected page fails                | Session/cookie/config/runtime issue                          | Check HTTPS, same deployment domain, deployed secret consistency and server logs; validate the cookie is being set       |
| Connection says configured but query fails             | Token/domain/publication/permission/API mismatch             | Read actual query outcome; confirm correct private Storefront token and domain rather than inferring from presence alone |
| Live catalogue is empty                                | Channel publication or storefront permissions                | Confirm intended products/collections are published and accessible                                                       |
| Live product fields disappear compared with CSV        | Different supported metafield names/schema/access            | Map/migrate approved values into the live adapter's fields; verify Storefront access                                     |
| CSV product says purchasing coming soon                | No live IDs/availability                                     | Expected snapshot guard; configure Shopify and verify the live product                                                   |
| Room builder says scheme unavailable                   | Old `slat-panel-2400` handle                                 | Implement real product/configuration mapping; adding admin credentials does not fix it                                   |
| Contact shows preview/nothing sent                     | No enquiry-delivery backend                                  | Implement/test enquiry submission; do not interpret the UI as an email receipt                                           |
| Invalid hook call only in dev after rebuild/navigation | Stale or duplicate optimized React module                    | Follow [DEV_SERVER.md](DEV_SERVER.md), reuse one server and refresh the browser module graph                             |
| GitHub rejects an oversized FFmpeg file                | Old experiment history includes unrelated temporary binaries | Publish intended changes from clean current main; do not force push or just add a deletion commit                        |

## Validation boundary

Local authentication and catalogue tests passed before the original main push. The user subsequently reported the missing-admin-settings error on Vercel. Instructions to correct it were supplied, but successful production configuration/login has not been established. No production order/payment has been placed or verified by this documentation pass.
