import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const fallbackConfig = {
  apiKey: 'AIzaSyC4zsGQq4Kej-r0GxfoWRkNqCnAImKzxS4',
  authDomain: 'loyixa-84b39.firebaseapp.com',
  projectId: 'loyixa-84b39',
  storageBucket: 'loyixa-84b39.firebasestorage.app',
  messagingSenderId: '185172472066',
  appId: '1:185172472066:web:f1aacf073094875b97521b',
  measurementId: 'G-BT8ZWRCEEG',
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

if (typeof window !== 'undefined') {
  // Avoid analytics issues in non-browser environments.
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
