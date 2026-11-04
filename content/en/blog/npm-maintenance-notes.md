---
title: "npm Maintenance Notes: Node Versions, Package Sources, Lockfiles, and Common Problems"
description: "Front-end projects are quick to start, but if Node versions, package sources, lockfiles, and version ranges aren't handled carefully, problems show up during maintenance. These notes cover what an npm project needs from setup to day-to-day upkeep: pinning Node and npm, private package sources, updating dependencies, what to do when an install fails, npm ci, scripts, audit, version ranges, overrides, and .npmrc."
date: 2026-11-04
tags:
  - npm
  - Node.js
  - Front-End
  - Security
category: frontend
translationKey: npm-maintenance-notes
draft: false
---

> Up front: this post was researched and drafted with help from AI (Anthropic's Claude), then read and checked by me. Commands and defaults were checked against the official npm 12 docs and run on npm 11.20.0 (bundled with Node 26), 11.21.1, and 12.2.1. Sources are linked at the end. If I've gotten something wrong, corrections welcome.

Front-end projects are quick to start, but if Node versions, package sources, lockfiles, and version ranges aren't handled carefully, you find out the hard way during maintenance. For a comparison of npm, pnpm, and Yarn, see [the other post](/en/blog/package-managers-2026/).

## 1. Pin the Node version

Packages may restrict which Node versions they support, so Node itself needs pinning too. I recommend installing Node through a version manager rather than the installer from the official site: the installer gives you one version at a time, which makes switching between projects awkward. Using nvm as an example (currently v0.40.8):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.8/install.sh | bash
```

The install script downloads nvm to `~/.nvm` and tries to add the loading lines to your shell profile (for example `~/.zshrc`). After reopening the terminal:

```bash
nvm install 26        # install the latest Node 26.x
nvm use 26            # switch to Node 26
nvm ls                # list installed versions
nvm alias default 26  # default version for new terminals
```

Put a `.nvmrc` file (containing `26`) in the project root, and running `nvm use` inside the project switches to the right version.

`.nvmrc` is only a hint: someone who doesn't switch versions can still install. To enforce the check, add `engines` to `package.json` and turn on `engine-strict=true` in `.npmrc`:

```json
"engines": { "node": ">=26 <27" }
```

## 2. Pin the npm version

npm comes with Node, but **installing the latest Node doesn't mean you have the latest npm**: Node 26 (26.13.0) bundles npm 11.20.0, while the latest is npm 12.2.1. To upgrade:

```bash
npm i -g npm@12
```

`devEngines` in `package.json` checks the Node and npm versions before `install`, `ci`, and `run`, and stops when they don't match:

```json
"devEngines": {
  "runtime": { "name": "node", "version": ">=26", "onFail": "error" },
  "packageManager": { "name": "npm", "version": ">=12", "onFail": "error" }
}
```

`engines` checks the environment of people *using* the package; `devEngines` checks the environment of people *working on* the project.

## 3. Private package sources

If your company has a private registry, **send only the private packages there and leave everything else on the default**. In the project's `.npmrc`:

```ini
@mycompany:registry=https://npm.mycompany.com/
//npm.mycompany.com/:_authToken=${NPM_TOKEN}
```

- Packages starting with `@mycompany/` come from the company registry; everything else comes from the public npm registry as usual. Since you never switch the whole registry, you can't forget to switch it back.
- Always pass the token through an environment variable; never hard-code it in the file.

You can also set it with a command:

```bash
npm config set @mycompany:registry=https://npm.mycompany.com/
```

If you switch the whole registry and install packages while it's switched, `package-lock.json` records that source's URL (an internal `192.168.x.x`, for example), and installs fail in other environments. That's another reason not to switch the whole registry.

## 4. Updating dependencies

First, see what can be updated:

```bash
npm outdated
```

It lists the current version (Current), the latest version within your range (Wanted), and the version tagged `latest` on the registry (Latest).

- **Only up to the latest within your range**: `npm update`.
- **Up to the latest major version**: use the interactive mode of [npm-check-updates](https://github.com/raineorshine/npm-check-updates) and pick one by one:

  ```bash
  npx npm-check-updates -i
  ```

**Upgrade a small batch at a time, and run your tests after each batch.** If you upgrade everything at once, it's hard to tell which package broke things.

**Let new versions wait a day**: set `min-release-age=1` in `.npmrc` (the unit is days), and versions published less than a day ago won't be installed. This lowers the risk of installing a version that was just released and hasn't been found to be broken yet, including one with malicious code injected. If no version meets the condition, npm fails with an error.

## 5. What to do when an install fails

**Don't delete `package-lock.json` at the first error.** The lockfile records "the set of versions that currently works". If you delete it together with `node_modules` and reinstall, every dependency, including transitive ones you never touched, jumps to the latest version within its range. The original problem might go away, but new ones appear, and you won't know what changed.

A better order:

1. Reinstall from the lockfile with `npm ci` (it removes `node_modules` first).
2. If that doesn't help, use `npm ls <package>` to find which package and version is causing the problem.
3. Update only that package with `npm install <package>@<version>`; the lockfile only changes the parts related to it.

**The cache is almost never the problem.** npm verifies cache integrity on both write and read, and refetches corrupted data automatically. The official docs say there's no reason to clear the cache except to reclaim disk space. To check the cache:

```bash
npm cache verify
```

Cache location: `~/.npm` on macOS/Linux, `%LocalAppData%\npm-cache` on Windows.

## 6. npm ci vs. npm install

| | `npm install` | `npm ci` |
|---|---|---|
| Based on | `package.json`, updating the lockfile when needed | **Requires** `package-lock.json` |
| Lockfile and package.json disagree | Updates the lockfile | Exits with an error and changes no files |
| Install a single package | Yes | No, only the whole project at once |
| Existing `node_modules` | Kept and updated | Removed entirely first |
| Writes package.json / lockfile | Yes | Never |

**Always use `npm ci` for CI and deployment** so the installed versions match the lockfile exactly.

## 7. scripts: your own commands

The `scripts` field in `package.json` holds commands you define yourself; both names and contents are up to you:

```json
"scripts": {
  "dev": "nuxt dev",
  "build": "nuxt build",
  "lint": "eslint .",
  "check": "npm run lint && npm run test"
}
```

- Run one with `npm run <name>`; plain `npm run` lists every available script.
- While a script runs, `node_modules/.bin` is added to PATH, so you can write `nuxt` or `eslint` directly, without a full path or a global install.
- Pass arguments to the command after `--`: `npm run lint -- --fix`.
- `test` and `start` don't need `run`: `npm test`, `npm start`.
- Prefixing a name with `pre` or `post` runs it automatically before or after: if you define `prebuild`, `npm run build` runs it first.

Watch out for the install lifecycle scripts (`preinstall`, `install`, `postinstall`): **these scripts in your dependencies run automatically when you install**, and a malicious package can use that to run anything on your machine. npm 12 blocks unapproved ones by default; the npm 11 bundled with Node 26 only prints a warning and **runs them anyway** (I tested this). The approval list lives in `allowScripts` in `package.json`:

```bash
npm install-scripts approve esbuild   # writes the approval to allowScripts
```

## 8. npm audit: checking for known vulnerabilities

```bash
npm audit                          # list packages with known vulnerabilities
npm audit --json                   # output as JSON
npm audit fix                      # upgrade to fixed versions within your ranges
npm audit fix --dry-run            # show what would happen without changing anything
npm audit fix --package-lock-only  # change only the lockfile, not node_modules
npm audit fix --omit=dev           # leave devDependencies alone
npm audit signatures               # verify registry signatures and provenance
```

**Be very careful with `npm audit fix --force`**: it upgrades major versions to fix vulnerabilities, which can easily break your project. Check with `--dry-run` first.

A reported vulnerability doesn't always affect you. For example, one that only exists in a development tool and needs special input to trigger may pose no real risk to a static site. Read the details before deciding.

## 9. npx: running one-off tools

For tools you only want to run once, without a global install, use npx:

```bash
npx npm-check-updates
```

npx uses packages already installed in the project first. If the project doesn't have it, npx asks first, then downloads it to npm's cache folder and runs it. Downloading and running means executing code straight from the internet, so **get the package name right** to avoid installing a different package with a similar name.

## 10. Native module build failures

Packages with C/C++ native code are compiled with node-gyp during install. node-gyp's official documentation states that macOS needs the Xcode Command Line Tools:

```bash
xcode-select --install
```

Some native packages ship prebuilt binaries, such as `better-sqlite3` and `sharp`, so on common platforms they don't need to be compiled locally.

## 11. Version ranges

Versions follow the `major.minor.patch` format:

| Syntax | Range |
|---|---|
| `^1.2.2` | `>=1.2.2 <2.0.0` (the left-most non-zero number stays fixed) |
| `~1.2.2` | `>=1.2.2 <1.3.0` (the minor version stays fixed) |
| `1.2.2` | Only 1.2.2 |
| `^0.2.3` | `>=0.2.3 <0.3.0` (`^` is stricter for versions starting with 0) |
| `^0.0.3` | Only 0.0.3 |

The semver spec defines 0.x as initial development, where anything may change at any time. npm's `^` rule is "don't change the left-most non-zero number", so for 0.x the range gets narrower.

Prerelease ordering:

```
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0
```

**The lockfile is what actually pins versions.** As long as you commit `package-lock.json` and use `npm ci` in CI, `^` won't install unexpected versions. The cost of `save-exact=true` (writing exact versions on install) is that every small fix has to be upgraded by hand. My recommendation: for applications, the lockfile is enough. For packages you publish for others, I also don't recommend exact versions, because it makes it harder for users' projects to share a single version with other packages.

## 12. peerDependencies

`peerDependencies` means: "to use me, your project also needs X." For example, `vue-router` lists `vue` in its peerDependencies: it needs Vue, but uses the copy in your project instead of installing its own.

Since npm 7, peerDependencies are installed automatically; when packages require conflicting versions that can't be resolved, the install may fail. `--legacy-peer-deps`, often used to get around the error, makes npm **ignore peerDependencies entirely**, which only hides the problem. Find out which two packages require conflicting versions first, then decide which side to upgrade.

## 13. overrides: forcing the version of a transitive dependency

When a transitive dependency conflicts with your project, or has a known vulnerability the upstream hasn't fixed yet, you can force a version in `package.json`:

```json
"overrides": {
  "package-name": "version"
}
```

- It only works in the project's root `package.json`.
- It's a temporary fix: **write down why, and come back to remove it later**. The real fix is to find the package causing the conflict and wait for an upstream fix or switch packages.

## 14. Example .npmrc

```ini
# --- Package sources ---
# Only company packages use the private source; token from an environment variable
# @mycompany:registry=https://npm.mycompany.com/
# //npm.mycompany.com/:_authToken=${NPM_TOKEN}

# --- Environment ---
# Refuse to install when the Node version doesn't match engines in package.json
engine-strict=true

# --- Supply chain protection ---
# Don't install versions published less than 1 day ago (unit: days)
min-release-age=1
# Don't allow dependencies from git or URLs (npm 12 already defaults to none)
allow-git=none
allow-remote=none
# Fail the install when there are unapproved install scripts
strict-allow-scripts=true
```

- **`ignore-scripts=true` isn't recommended**: it blocks every install script, including ones legitimate packages need. Use the `allowScripts` allowlist to permit only packages you've reviewed.
- **Check that your npm version supports these settings**: npm only prints an `Unknown project config` warning for settings it doesn't recognize, and **the install carries on**. If CI runs an older npm than you do locally, a protection might not take effect, leaving only an easy-to-miss warning.

### Configuration precedence

From highest to lowest (higher entries override lower ones):

1. Command-line flags (for example `--registry=…`)
2. Environment variables (starting with `npm_config_`, for example `npm_config_registry`)
3. Project config: `project-directory/.npmrc`, usually committed to git
4. User config: `~/.npmrc` (on Windows, `C:\Users\username\.npmrc`), for personal tokens
5. Global config: `$PREFIX/etc/npmrc`
6. npm's built-in defaults

To see what's currently applied:

```bash
npm config list      # list settings
npm config list -l   # include defaults
```

## Further reading

- [npm, pnpm, and Yarn in 2026: A Comparison of the Latest Versions](/en/blog/package-managers-2026/)

## Related links

- [npm Docs — config (settings and precedence)](https://docs.npmjs.com/cli/using-npm/config "opens in new window"){target="_blank"}
- [npm Docs — npm ci](https://docs.npmjs.com/cli/commands/npm-ci "opens in new window"){target="_blank"}
- [npm Docs — scripts](https://docs.npmjs.com/cli/using-npm/scripts "opens in new window"){target="_blank"}
- [npm Docs — npm cache](https://docs.npmjs.com/cli/commands/npm-cache "opens in new window"){target="_blank"}
- [npm Docs — npm audit](https://docs.npmjs.com/cli/commands/npm-audit "opens in new window"){target="_blank"}
- [npm Docs — package.json (devEngines, overrides)](https://docs.npmjs.com/cli/configuring-npm/package-json "opens in new window"){target="_blank"}
- [Semantic Versioning spec](https://semver.org/ "opens in new window"){target="_blank"}
- [npm Docs — npm install-scripts](https://docs.npmjs.com/cli/commands/npm-install-scripts "opens in new window"){target="_blank"}
- [npm Docs — npm outdated](https://docs.npmjs.com/cli/commands/npm-outdated "opens in new window"){target="_blank"}
- [npm Docs — npm exec (npx)](https://docs.npmjs.com/cli/commands/npm-exec "opens in new window"){target="_blank"}
- [npm versions bundled with each Node.js release (official index.json)](https://nodejs.org/dist/index.json "opens in new window"){target="_blank"}
- [node-gyp — Installation (macOS needs the Xcode Command Line Tools)](https://github.com/nodejs/node-gyp#installation "opens in new window"){target="_blank"}
- [nvm](https://github.com/nvm-sh/nvm "opens in new window"){target="_blank"}
- [npm-check-updates](https://github.com/raineorshine/npm-check-updates "opens in new window"){target="_blank"}
