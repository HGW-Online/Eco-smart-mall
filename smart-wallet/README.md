# HGW Smart Wallet (نسخة تجريبية)

دخول بالبريد أو الجوال (SMS) أو الحسابات الاجتماعية عبر Privy، واستيراد محفظة بمفتاح خاص، وحساب ذكي (EIP-7702) ورعاية غاز عبر Alchemy Wallet APIs على **Base Sepolia** فقط.

## التشغيل (يحتاج Node 22)

1. `cp .env.example .env` ثم ضع مفتاح تطبيق Alchemy **HGW Universal Wallet** (ليس Master key).
2. `npm install`
3. `npm test` ثم `npm run dev` للتشغيل المحلي، أو `npm run build` للنشر (الناتج في `dist/`).

## إعدادات اللوحات

- **Privy:** فعّل Email وSMS وGoogle وApple وTwitter وGitHub وDiscord (أو احذف من `src/main.jsx` ما لا تريده)، وأضف إلى Allowed origins: `http://localhost:5173` و `https://hgw-online.github.io`.
- **Alchemy:** قائمة النطاقات تشمل `hgw-online.github.io`. للتجربة المحلية أضف `localhost` مؤقتاً وأزله بعد الانتهاء. تأكد أن Base Sepolia مفعلة.

## اختبار حقيقي

ادخل بالبريد، انسخ العنوان، أرسل إليه ETH تجريبياً من faucet، ثم أرسل مبلغاً صغيراً إلى عنوان آخر وتحقق منه في sepolia.basescan.org.

## قبل أي استخدام حقيقي

- استيراد المفتاح الخاص يمر عبر صفحتك، وأي كود خبيث فيها قد يسرقه. جرّبه بمفتاح تجريبي فقط، وراجع قرار إبقائه قبل الإطلاق.

- مفتاح Alchemy ومعرف السياسة يظهران في المتصفح. تقييد النطاق وحدود السياسة يقللان الخطر ولا يلغيانه. توصي Alchemy بتمرير الطلبات عبر خادم في الإنتاج.
- ثبّت إصدارات المكتبات وارفع `package-lock.json`.
- الشبكة الحقيقية تحتاج سياسة غاز جديدة ومراجعة أمنية وقانونية.
