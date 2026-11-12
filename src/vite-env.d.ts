/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_apiKey?: string;
  readonly VITE_API_KEY?: string;
  readonly VITE_authDomain?: string;
  readonly VITE_AUTH_DOMAIN?: string;
  readonly VITE_projectId?: string;
  readonly VITE_PROJECT_ID?: string;
  readonly VITE_storageBucket?: string;
  readonly VITE_STORAGE_BUCKET?: string;
  readonly VITE_messagingSenderId?: string;
  readonly VITE_MESSAGING_SENDER_ID?: string;
  readonly VITE_appId?: string;
  readonly VITE_APP_ID?: string;
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
  readonly VITE_payment_key?: string;
  readonly VITE_PAYMENT_KEY?: string;
  readonly VITE_API_URL?: string;
  readonly VITE_imgbb_key?: string;
  readonly VITE_IMGBB_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
