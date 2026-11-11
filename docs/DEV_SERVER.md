# Development React bundle check

If a tab reports an invalid hook call after a dependency rebuild or route update, check the dev bundle graph before changing component hooks. React and React DOM can have matching installed versions while different optimized React URLs create separate dispatchers in the browser.

The loading incident reported after the product-page work had `react.js?v=77f77c0b` alongside a newer renderer. Both old and current React URLs returned HTTP 200 and produced different React/dispatcher objects. The installed Lovable config wrapper enables `optimizeDeps.ignoreOutdatedRequests`; the project now overrides it to `false`, restoring Vite's outdated-request guard. Route-loaded dialog, slider and client bridge dependencies are also included up front to avoid late optimizer rebuilds when those routes open.

The existing React dedupe and plugins remain supplied by the wrapper. No React versions, dependency lockfiles or application hook implementations were changed for this fix.

## Verify against the running server

```sh
npm run dev
```

In a separate terminal, using the URL printed by Vite:

```sh
node scripts/check-dev-react.mjs http://127.0.0.1:8080
```

The check verifies that the root, catalogue, product component and renderer import the same optimized React URL. A deliberately obsolete React request must return HTTP 504 instead of being served as another React instance. That rejection is expected in this diagnostic.

Use one dev server per checkout and reuse it for browser QA. Separate Vite processes over the same `node_modules/.vite` directory can replace one another's optimized files while a tab retains older modules. Use a separate checkout or explicitly separate cache directories if concurrent servers are necessary.

After this configuration fix, refresh an already-open tab once with **Ctrl+Shift+R** to discard its old module graph. The running server automatically restarts when `vite.config.ts` changes; no reinstall is required.

The fix was browser-checked on the existing port 8080: homepage-to-catalogue navigation, direct catalogue loads, category filtering, product detail, image enlargement/Escape and mobile catalogue. Those checks used one React URL, kept the optimizer hash stable and reported no runtime exceptions or console errors.

The HTTP regression check, strict TypeScript, targeted ESLint and production build pass. All 13 tests pass with `npm test -- --maxWorkers=1 --no-file-parallelism`; the initial parallel attempt timed out while starting workers before any tests ran.

References: [React's invalid hook call guide](https://react.dev/warnings/invalid-hook-call-warning), [Vite dependency pre-bundling](https://vite.dev/guide/dep-pre-bundling).
