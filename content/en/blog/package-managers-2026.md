---
title: "npm, pnpm, and Yarn in 2026: A Comparison of the Latest Versions"
description: "Release status, installation, security defaults, node_modules layout, and configuration files for npm 12, pnpm 12, and Yarn 4. Their protections overlap a lot. What differs is which ones are on by default, and whether a misconfigured setting stops the install."
date: 2026-11-04
tags:
  - npm
  - pnpm
  - Yarn
  - Node.js
  - Front-End
  - Security
category: frontend
translationKey: package-managers-2026
draft: false
---

> Up front: this post was researched and drafted with help from AI (Anthropic's Claude), then read and checked by me. The versions and defaults come from queries and test runs on November 4, 2026, using npm 11.20.0 (bundled with Node 26), npm 11.21.1, npm 12.2.1, pnpm 12.16.1, and Yarn 4.18.1. Everything else is based on official documentation, official changelogs, and npm registry publish data, linked at the end. These tools change quickly, so check the latest official docs. If I've gotten something wrong, corrections welcome.

The three tools' protections overlap a lot. **What differs is which ones are on by default, and whether a misconfigured setting stops the install.** For everyday commands and maintenance issues, see [npm Maintenance Notes](/en/blog/npm-maintenance-notes/).

## Release status

| Tool | Latest stable | Notes |
|---|---|---|
| npm | **12.2.1** | 12.0.0 was released in July 2026 and supports Node `^22.22.2 \|\| ^24.15.0 \|\| >=26`. **Node 26 LTS (26.13.0) bundles npm 11.20.0**, so you have to upgrade to get 12 |
| pnpm | **12.16.1** | 12.0.0 was released in August 2026. The CLI now ships as a standalone executable per platform (the official changelog calls it the Rust CLI). pnpm 11 still gets releases (11.28.10, October 2026) |
| Yarn | **4.18.1** | Released September 2026. Yarn 6, a rewrite in Rust, is marked as a preview in its official docs |
| Yarn Classic | 1.22.22 | No new release since March 2024 |

## Installation

**Node 25 and later no longer bundle Corepack**, so pnpm and Yarn have to be installed separately:

| Tool | Install and upgrade |
|---|---|
| npm | Bundled with Node; upgrade with `npm i -g npm@12` |
| pnpm | `npm i -g pnpm@12` or the official install script; upgrade with `pnpm self-update` |
| Yarn 4 | Official method: `npm i -g corepack`, then use `yarn` in your project; or `pnpm add -g yarn@4` |

pnpm 12 can install other package managers and verifies npm's signature before running them. For example, `pnx npm@11 ci` runs a one-off command with a specific npm version.

Pinning the package manager version:

- **pnpm and Yarn**: the `packageManager` field in `package.json`, which only accepts an exact version, for example `"packageManager": "pnpm@12.16.1"`.
- **npm**: the official docs have no `packageManager` field. Use `devEngines.packageManager` to check the version and stop when it doesn't match.

## Security defaults

Behavior with nothing configured:

| Protection | npm 11.20 / 11.21 | npm 12.2 | pnpm 12.16 | Yarn 4.18 |
|---|---|---|---|---|
| Release cooldown | `min-release-age`, **off by default** | Same | `minimumReleaseAge` **defaults to 1440 minutes** (non-strict) | `npmMinimalAgeGate` **defaults to 1440 minutes** |
| Dependency install scripts | Unapproved scripts **still run**, with a notice | Unapproved scripts are **blocked**, with a warning | Unapproved scripts are **blocked** | `enableScripts` **off by default** |
| Dependencies from git | `allow-git` defaults to `all` | Defaults to `none` | `blockExoticSubdeps` **on by default**: not allowed for transitive dependencies, allowed for direct ones | `approvedGitRepositories` empty by default (all blocked) |
| Dependencies from tarball URLs | `allow-remote` defaults to `all` | Defaults to `none` | Same as above (`blockExoticSubdeps`) | No equivalent setting found |
| Trust downgrade | None | None | `trustPolicy: no-downgrade`, opt-in | No equivalent setting found |
| SBOM | `npm sbom` | `npm sbom` | `pnpm sbom` | No built-in command found |

Watch the version: in the pnpm 10 docs, `minimumReleaseAge` defaults to 0 and `blockExoticSubdeps` to false. The table shows pnpm 12 defaults, and I tested that both are on by default.

**Strict mode for the cooldown**
- pnpm: the official docs state that the built-in 1440-minute default is non-strict. If no version is old enough, pnpm falls back to a newer one so the install still succeeds. **Only when you set `minimumReleaseAge` explicitly does `minimumReleaseAgeStrict` default to true**, and the install fails when no version is old enough.
- npm's `min-release-age` is measured in days and is strict as soon as you turn it on.
- Yarn: in my test, when the requested version was younger than 1440 minutes, the install failed and the version was marked as quarantined.

**Install script allowlists**

| | Where it lives | What it matches |
|---|---|---|
| npm | `allowScripts` in `package.json` (written by `npm install-scripts approve`) | Package plus version by default, so you re-approve after upgrading (`allow-scripts-pin=false` writes names only) |
| pnpm | `allowBuilds` in `pnpm-workspace.yaml` | Package name, optionally with a version |
| Yarn | `dependenciesMeta` in `package.json` | Package name |

With `strict-allow-scripts=true`, npm fails the install when there are unapproved scripts.

**When a setting is misspelled**
- npm: an unknown setting only prints an `Unknown project config` warning, and **the install carries on**. If CI runs an older npm, a protection might not take effect, leaving only an easy-to-miss warning.
- pnpm 12: an unknown setting in `pnpm-workspace.yaml` gets a suggestion for the correct name. When the project pins a pnpm version, the command fails.
- Yarn 4: in my test, an unknown setting in `.yarnrc.yml` fails immediately (`Unrecognized or legacy configuration settings found`) and the install doesn't continue.

## node_modules layout

| | npm | pnpm | Yarn 4 |
|---|---|---|---|
| Default layout | Flat, hoisted to the top level where possible | A shared store, assembled with hard links and symlinks | **Plug'n'Play**, no `node_modules` |
| Using a package you didn't declare (tested) | Works when it's hoisted to the top level | Project code can't import it | Can't import it |
| Packages duplicated across projects | Each project's `node_modules` has its own copy | Hard-linked from the shared store, same files | Read from the global cache |

- Yarn's `nodeLinker` can switch to `node-modules` or `pnpm`.
- pnpm's strict layout sometimes keeps tools from finding transitive dependencies. For example, during Nuxt development Vite couldn't find `@nuxtjs/mdc`; hoisting it to the root with `publicHoistPattern` fixed it.

## Configuration files

| | npm | pnpm 12 | Yarn 4 |
|---|---|---|---|
| Main config file | `.npmrc` | `pnpm-workspace.yaml` (single-package projects too) | `.yarnrc.yml` |
| Reads `.npmrc` | Everything | Tested: reads `registry`, ignores `engine-strict` and `save-exact` | Tested: doesn't read it |
| Overriding dependency versions | `overrides` in `package.json` | `overrides` in `pnpm-workspace.yaml` | `resolutions` in `package.json` |
| Install from the lockfile | `npm ci` | `pnpm install --frozen-lockfile` | `yarn install --immutable` |
| Run a one-off tool | `npx` | `pnpm dlx` / `pnx` | `yarn dlx` |

When moving from npm to pnpm, rewrite `engine-strict=true` from `.npmrc` as `engineStrict: true` in `pnpm-workspace.yaml`, or it won't take effect.

## Other differences

- **pnpm 12 can manage Node versions**: specify one in `devEngines.runtime` in `package.json`, and pnpm downloads it and verifies the Node.js release signatures. When the project doesn't specify one, a global `node` installed through pnpm reads the nearest `.nvmrc` or `.node-version`.
- **pnpm 12 lockfiles are deterministic**: dependency cycles are broken in a fixed way, so the same dependencies always produce the same lockfile.
- **npm needs no separate install**: it comes with Node and works without extra setup.

## Which to choose

My recommendations:

| Situation | Recommendation |
|---|---|
| You want safe defaults | pnpm 12 |
| Your team doesn't want another tool | npm 12, with `min-release-age` and `strict-allow-scripts` turned on, after confirming the npm version in CI supports them |
| Already on Yarn 4 | No need to switch; its defaults are already strict |
| Still on Yarn 1 | Move to Yarn 4 or pnpm |

## Further reading

- [npm Maintenance Notes: Node Versions, Package Sources, Lockfiles, and Common Problems](/en/blog/npm-maintenance-notes/)

## Related links

- [npm Docs — config](https://docs.npmjs.com/cli/using-npm/config "opens in new window"){target="_blank"}
- [pnpm — Settings](https://pnpm.io/settings "opens in new window"){target="_blank"}
- [pnpm — Dependency resolution settings (minimumReleaseAge, trustPolicy, blockExoticSubdeps)](https://pnpm.io/settings/dependency-resolution "opens in new window"){target="_blank"}
- [pnpm 10 settings (older defaults)](https://pnpm.io/10.x/settings "opens in new window"){target="_blank"}
- [pnpm — Motivation (the store and non-flat node_modules)](https://pnpm.io/motivation "opens in new window"){target="_blank"}
- [pnpm — Installation](https://pnpm.io/installation "opens in new window"){target="_blank"}
- [Yarn — .yarnrc.yml settings](https://yarnpkg.com/configuration/yarnrc "opens in new window"){target="_blank"}
- [Node.js 24 docs — Corepack (no longer distributed from v25)](https://nodejs.org/docs/latest-v24.x/api/corepack.html "opens in new window"){target="_blank"}
- [npm versions bundled with each Node.js release (official index.json)](https://nodejs.org/dist/index.json "opens in new window"){target="_blank"}
- [npm Docs — npm install-scripts](https://docs.npmjs.com/cli/commands/npm-install-scripts "opens in new window"){target="_blank"}
- [pnpm changelog (GitHub Releases)](https://github.com/pnpm/pnpm/releases "opens in new window"){target="_blank"}
- [Yarn — Installation](https://yarnpkg.com/getting-started/install "opens in new window"){target="_blank"}
- [Yarn 6 docs (preview)](https://v6.yarnpkg.com/concepts/yarn-6 "opens in new window"){target="_blank"}
