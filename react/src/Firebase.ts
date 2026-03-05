import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const fallbackConfig = {
  apiKey: 'AIzaSyCoTvYoc-9rJingUTFxDomXgaAQ0bvnKv0',
  authDomain: 'sayt-9e245.firebaseapp.com',
  projectId: 'sayt-9e245',
  storageBucket: 'sayt-9e245.firebasestorage.app',
  messagingSenderId: '57903143719',
  appId: '1:57903143719:web:e4ffd3911174d4e49de702',
  measurementId: 'G-GHRT1FMTZL',
};

const firebaseConfig = fallbackConfig;

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
};

providers.google.setCustomParameters({ prompt: 'select_account' });

export { app, auth, providers };
