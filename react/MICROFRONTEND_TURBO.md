# Turborepo + Microfrontends (minimal example)

This file outlines a minimal Turborepo structure and example snippets to get a host + one remote running using Module Federation (webpack) or Vite federation.

Layout (monorepo):

- apps/
  - host/        # shell that loads remotes
  - mfe1/        # microfrontend (remote)
- packages/
  - ui/          # shared UI primitives
- package.json   # workspace config
- turbo.json     # turborepo pipeline

Example `package.json` workspaces (root):

```json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "devDependencies": {
    "turbo": "^1.7.0"
  }
}
```

Minimal `turbo.json`:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {}
  }
}
```

Webpack Module Federation snippets:

- Host `webpack.config.js` (expose remotes):

```js
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    mfe1: 'mfe1@http://localhost:3001/remoteEntry.js'
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
})
```

- Remote `mfe1` `webpack.config.js` (expose App):

```js
new ModuleFederationPlugin({
  name: 'mfe1',
  filename: 'remoteEntry.js',
  exposes: { './App': './src/App' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
})
```

Vite federation alternative: use `vite-plugin-federation` for similar runtime imports.

Run (dev):

```bash
# from repo root
npm run --workspace apps/mfe1 dev
npm run --workspace apps/host dev
```

Notes:

- Use Turborepo to cache and orchestrate builds; keep `ui` primitives versioned and stable.
- For production, host can use static URLs to remoteEntry artifacts and Turborepo can help with build order and caching.

If you want, I can scaffold a runnable starter (host + mfe1) with either webpack Module Federation or Vite federation in this repo.

Why Microfrontends (summary):

- Microfrontends split large frontends into smaller, independently deployable microapps.
- Benefits: team autonomy, incremental migration, independent deploys, and clearer ownership.
- Costs: extra infra, more complex debugging, and potential runtime/bundle overhead.

Recommended when:

- Multiple teams own different parts of the UI.
- You need to migrate a large legacy app incrementally.
- Independent deployments and release cadence are required.

