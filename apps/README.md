# HGW cross-platform packaging

Status: configuration/source scaffold. Web assets are prepared successfully. Dependencies, native builds, device QA, signing and store submission have **not** been run. The proposed app identifier `org.hgw.global` needs ownership and store availability verification before release.

The same responsive website powers Android/Samsung phones and tablets, iPhone/iPad, and Windows/macOS/Linux desktop shells. These packages retain the prototype's local-only data and do not add accounts, secure insurance services, payments or cross-device synchronization.

## Prerequisites and commands

Use Node 22+, install dependencies from this directory with `npm install`, then retain the generated lockfile and audit compatible versions before release. Native mobile tooling is required: Android Studio/SDK/JDK for Android, and macOS/Xcode plus Apple developer signing for iOS. Electron macOS signing also requires macOS.

- `npm run web:prepare`: copies the existing `../site` into ignored `www/`.
- First Android setup: `npm run mobile:init:android`, then `npm run mobile:android`.
- First iOS setup: `npm run mobile:init:ios`, then `npm run mobile:ios`.
- After changes: `npm run mobile:sync`.
- Desktop preview: `npm run desktop:dev`.
- Desktop packaging on supported hosts: `npm run desktop:windows`, `npm run desktop:mac`, or `npm run desktop:linux`.

Capacitor native projects are generated locally and currently ignored. Before a production release, manage them in version control under the release team's policy. Never commit signing keys.

## Release checklist

Verify touch/keyboard navigation, Arabic RTL and English, phone/tablet/desktop layouts, offline shell/update behavior, accessibility, local data lifecycle, installation and uninstall on actual target devices. Verify backend/auth/roles before real customer information or commerce.

Google Play and Galaxy Store require Android packages and store accounts; App Store requires Apple signing and review; Microsoft Store and other stores require their own packaging, metadata and policies. Screenshots, privacy disclosures, support links, ratings and review must match actual capabilities. No submission is included or claimed here.

PWA installation requires HTTPS (or localhost). Service worker scope is relative so GitHub Pages subdirectory hosting remains supported. Only explicitly listed static shell files are cached. Service workers may not operate in a desktop `file:` wrapper; desktop already includes the static assets.
