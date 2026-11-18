# Timber Acoustics project reference

Updated 18 November 2026. Start here when returning to the project or handing it to another developer. These documents consolidate the implementation, client direction, integration requirements, troubleshooting and audits discussed during the project.

## Read by task

| Document                                                                 | What it contains                                                                                                          |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| [Project overview and current status](PROJECT_REFERENCE.md)              | Architecture, routes, catalogue provenance, completed features, limitations, validation and Git history                   |
| [Deployment, admin access and troubleshooting](DEPLOYMENT_AND_ACCESS.md) | Environment-variable map, Vercel setup, the missing-admin-configuration error, login lifecycle and credential recovery    |
| [Shopify and admin implementation](shopify-and-admin.md)                 | Detailed importer behavior, client access requirements, Storefront integration and every admin screen                     |
| [Launch checklist and client request](LAUNCH_CHECKLIST.md)               | Ordered remaining work, acceptance checks and a reusable client handoff request                                           |
| [Complete placeholder/content/media audit](placeholder-content-audit.md) | Every known demo or draft content area, reference-media usage and all 79 products' structured-content gaps                |
| [Individual media inventory](media-content-audit.csv)                    | 2,019 records: local files, exact imported image/video URLs, placements, generated visuals and missing media associations |
| [Confirmed client/design direction](CLIENT_BRIEF.md)                     | Approved layout, visual/reference priorities and content direction                                                        |
| [Shopify technical map](SHOPIFY_INTEGRATION.md)                          | Server/data flow, live-versus-CSV behavior, metafield schemas and checkout constraints                                    |
| [Development React troubleshooting](DEV_SERVER.md)                       | Dev-server cache/duplicate-React incident, diagnosis and regression check                                                 |
| [Repository working instructions](../AGENTS.md)                          | Commands, routing conventions, SSR requirements, strict TypeScript constraints and Lovable history rules                  |

## Access information

The development account identifier is `admin@timberacoustics.local`; the login route is `/admin/login`. The configured account is read from server environment variables, not a user database.

The password is recorded only in the ignored local file `docs/private/admin-access.md` on the originating workstation. That file is deliberately absent from a Git clone. The ignored `.env.local` holds the password hash and session secret, not a recoverable plaintext password. Use a password manager for durable credential handoff and see [access and recovery](DEPLOYMENT_AND_ACCESS.md).

No working Shopify store token, confirmed Shopify store domain, client staff login, Vercel production-project identifier or public deployment URL is established by these documents. The user reported a Vercel deployment; its current environment settings and successful admin login have not been verified here.

## Interpreting status

- **Implemented** means the code exists and was inspected or checked locally.
- **Imported** means data came from the supplied CSV; it is not proof the current live store matches it.
- **Verified locally** means the stated check passed in this workspace at the recorded time.
- **Pending / unverified** means no live outcome or client approval has been established.
- Historical review screenshots and older test totals describe their original revision; they do not override the current status documents.

Media counts and product-field gaps are snapshots. Reimporting products or changing media requires updating the audit and inventory.

## Historical visual reviews

- [Homepage wireframe review](wireframe-review/README.md)
- [Product-page review](product-review/README.md)
- [Client review](client-review/README.md)
- [Earlier design review](design-review/README.md)
- [Alcove interaction experiment](alcove-experiment/README.md)

These preserve the visual decisions and evidence from earlier work; their sample-catalogue and disconnected-feature statements may predate the CSV/admin implementation.
