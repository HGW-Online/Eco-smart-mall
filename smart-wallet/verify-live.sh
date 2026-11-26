#!/usr/bin/env bash
# يفحص النسخة المنشورة: الصفحة، ونافذة الدخول، ومفتاح Alchemy من نطاق الموقع.
set -uo pipefail
cd "$(dirname "$0")"
site=$1
sleep 45

fail=0
for path in '' smart-wallet/ smart-wallet/manifest.webmanifest smart-wallet/apple-touch-icon.png; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$site$path")
  echo "::notice title=http::$code /$path"
  [ "$code" = 200 ] || fail=1
done

answer=$(curl -s "https://base-sepolia.g.alchemy.com/v2/$VITE_ALCHEMY_API_KEY" \
  -H 'Content-Type: application/json' -H 'Origin: https://hgw-online.github.io' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}')
case "$answer" in
  *0x14a34*) echo "::notice title=alchemy::key works from site origin (Base Sepolia)" ;;
  *) echo "::error title=alchemy::${answer:0:300}"; fail=1 ;;
esac

npm install --no-save --no-package-lock playwright@1 >/dev/null 2>&1
npx playwright install --with-deps chromium >/dev/null 2>&1
node smoke.cjs "${site}smart-wallet/" || fail=1
exit $fail
