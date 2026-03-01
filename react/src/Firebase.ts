import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
  throw new Error('Firebase config is missing. Set VITE_FIREBASE_* vars in react/.env.');
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

if (typeof window !== 'undefined') {
  void import('firebase/analytics')
    .then(({ getAnalytics, isSupported }) => isSupported().then((supported) => supported && getAnalytics(app)))
    .catch(() => undefined);
}

const providers = {
  google: new GoogleAuthProvider(),
  apple: new OAuthProvider('apple.com'),
  microsoft: new OAuthProvider('microsoft.com'),
};

providers.google.setCustomParameters({ prompt: 'select_account' });

export { app, auth, providers };
