# Electron + Next.js + React + Tailwind Template

A minimal desktop app starter. Next.js builds your UI into a static site, and Electron shows it in a native window. No Nextron, no extra tooling, just a handful of files you can read in five minutes.

**Stack:** Electron 44 · Next.js 16 (static export) · React 19 · Tailwind CSS 4 · TypeScript · electron-builder

## Requirements

- Node.js 20.9 or newer
- npm

## Quick start

```bash
npm install
npm run dev
```

An Electron window opens with hot reload. Edit `src/app/page.tsx` and the window updates as you save.

## Scripts

| Script               | What it does                                                    |
| -------------------- | --------------------------------------------------------------- |
| `npm run dev`        | Starts Next.js and Electron together, with hot reload           |
| `npm run build`      | Builds the static site into `out/`                              |
| `npm start`          | Builds the site, then opens it in Electron (production preview) |
| `npm run dist`       | Builds an installer for the OS you are currently on             |
| `npm run dist:win`   | Builds a Windows installer (`.exe`)                             |
| `npm run dist:mac`   | Builds macOS installers (`.dmg`, `.pkg`)                        |
| `npm run dist:linux` | Builds Linux packages (`.AppImage`, `.deb`, `.rpm`)             |

Installers are written to the `dist/` folder.

## Project structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx      Root layout (wraps every page)
│   │   └── page.tsx        Your home page
│   └── styles/
│       └── globals.css     Tailwind import
├── main.js                 Electron entry point (opens the window)
├── next.config.ts          Next.js config (static export)
├── postcss.config.mjs      Enables Tailwind
├── tsconfig.json           TypeScript config
└── package.json            Scripts and electron-builder settings
```

## How it works

1. **Next.js** builds your React app into plain HTML, CSS and JS in the `out/` folder (`output: "export"` in `next.config.ts`).
2. **`main.js`** is the Electron entry point. It creates the window and loads either the dev server or the built files.
3. **In development** (`--dev` flag), the window loads `http://localhost:3000` and retries until Next.js is ready.
4. **In production**, [`electron-serve`](https://github.com/sindresorhus/electron-serve) serves the `out/` folder to the window. A static Next.js export uses absolute paths like `/_next/...`, which would break if loaded straight from disk, and `electron-serve` makes them resolve correctly.
   The project uses `"type": "module"`, so `main.js` and `next.config.ts` use `import` / `export` syntax, not `require`.

## Building installers

```bash
npm run dist:win
```

What you get on each platform:

- **Windows:** an NSIS installer with a setup wizard. Users can pick the install folder, and it adds Start Menu and desktop shortcuts. It installs per user, so no admin prompt.
- **macOS:** a `.dmg` (drag into Applications) and a `.pkg` (installer wizard). Remove `"pkg"` from `build.mac.target` if you only want the `.dmg`.
- **Linux:** `.deb` (Debian/Ubuntu), `.rpm` (Fedora/RHEL) and an `.AppImage` (a single file you run directly).

### Cross-platform limits

- macOS installers can only be built **on a Mac**.
- Linux builds are unreliable on Windows. Use WSL or CI.
- The easiest way to get all three is to let CI build each one on its own OS, for example with a GitHub Actions matrix over `windows-latest`, `macos-latest` and `ubuntu-latest`.

### Before you ship

- **App name and ID:** change `name`, `appId`, `productName` and `shortcutName` in `package.json`.
- **Author:** set `author` to `"Your Name <you@example.com>"`. The `.deb` build fails without an email.
- **Icons:** create a `build/` folder with `icon.ico` (Windows), `icon.icns` (macOS) and `icon.png` (Linux, 512×512 or larger). electron-builder picks them up automatically. Without them you get the default Electron icon.
- **`.rpm` on Ubuntu/Debian:** building it needs the `rpm` tool (`sudo apt install rpm`), or remove `"rpm"` from `build.linux.target`.
- **Code signing:** unsigned apps trigger Windows SmartScreen and macOS Gatekeeper warnings. Fixing that needs code-signing certificates.

## Styling with Tailwind

Tailwind v4 needs no `tailwind.config.js`. It is enabled by two things:

- `postcss.config.mjs` registers the `@tailwindcss/postcss` plugin.
- `src/app/globals.css` contains `@import "tailwindcss";` and is imported in `layout.tsx`.
  Use utility classes directly in your components:

```tsx
<button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">Click me</button>
```

## Troubleshooting

**Dev window stays blank or never opens**
Make sure nothing else is using port 3000. If Next.js starts on another port (like 3001), `main.js` will never find it.

**`Electron Security Warning (Insecure Content-Security-Policy)`**
Harmless in development. Next's dev server needs `eval` for hot reload, and the warning disappears in packaged builds.

**`EBUSY: resource busy or locked ... app.asar` during build**
Something is holding the previous build open. Close any running copy of the app from `dist/`, close Explorer windows inside `dist/`, then delete `dist/` and rebuild. Antivirus scanning the new build can also cause it. Excluding the `dist/` folder usually fixes it.

**`'next' is not recognized`**
Run `npm install`. `next` must be listed in `devDependencies`.

**`module is not defined in ES module scope`**
A `.js` file is using `require` or `module.exports` while `"type": "module"` is set. Convert it to `import` / `export`, or rename it to `.cjs`.

**Unstyled page**
Check that `layout.tsx` has `import "./globals.css";` and that `postcss.config.mjs` sits next to `package.json`.

## License

MIT
