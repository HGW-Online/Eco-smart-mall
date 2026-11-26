# HGW Smart Wallet (نسخة تجريبية)

دخول بالبريد عبر Privy، وحساب ذكي (EIP-7702) ورعاية غاز عبر Alchemy Wallet APIs على **Base Sepolia** فقط.

## التشغيل (يحتاج Node 22)

1. `cp .env.example .env` ثم ضع مفتاح تطبيق Alchemy **HGW Universal Wallet** (ليس Master key).
2. `npm install`
3. `npm test` ثم `npm run dev` للتشغيل المحلي، أو `npm run build` للنشر (الناتج في `dist/`).

## إعدادات اللوحات

- **Privy:** فعّل الدخول بالبريد، وأضف إلى Allowed origins: `http://localhost:5173` و `https://hgw-online.github.io`.
- **Alchemy:** قائمة النطاقات تشمل `hgw-online.github.io`. للتجربة المحلية أضف `localhost` مؤقتاً وأزله بعد الانتهاء. تأكد أن Base Sepolia مفعلة.

## اختبار حقيقي

ادخل بالبريد، انسخ العنوان، أرسل إليه ETH تجريبياً من faucet، ثم أرسل مبلغاً صغيراً إلى عنوان آخر وتحقق منه في sepolia.basescan.org.

## قبل أي استخدام حقيقي

- مفتاح Alchemy ومعرف السياسة يظهران في المتصفح. تقييد النطاق وحدود السياسة يقللان الخطر ولا يلغيانه. توصي Alchemy بتمرير الطلبات عبر خادم في الإنتاج.
- ثبّت إصدارات المكتبات وارفع `package-lock.json`.
- الشبكة الحقيقية تحتاج سياسة غاز جديدة ومراجعة أمنية وقانونية.
