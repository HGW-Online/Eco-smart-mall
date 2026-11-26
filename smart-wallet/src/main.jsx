import React from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';
import App from './App.jsx';
import './style.css';

const config = {
  appId: import.meta.env.VITE_PRIVY_APP_ID,
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  policyId: import.meta.env.VITE_ALCHEMY_POLICY_ID,
};

const root = createRoot(document.getElementById('root'));

if (!config.appId || !config.apiKey || !config.policyId) {
  root.render(<main><h1>الإعدادات ناقصة</h1><p>انسخ <code>.env.example</code> إلى <code>.env</code> وأكمل القيم.</p></main>);
} else {
  root.render(
    <PrivyProvider
      appId={config.appId}
      config={{
        loginMethods: ['email'],
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        embeddedWallets: { ethereum: { createOnLogin: 'all-users' }, showWalletUIs: false },
      }}
    >
      <App config={config} />
    </PrivyProvider>,
  );
}
