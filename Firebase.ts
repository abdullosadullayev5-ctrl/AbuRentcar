    import { getApp, getApps, initializeApp } from 'firebase/app';
    import { getAnalytics, isSupported } from 'firebase/analytics';
    import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

    const firebaseConfig = {
    apiKey: 'AIzaSyC4zsGQq4Kej-r0GxfoWRkNqCnAImKzxS4',
    authDomain: 'loyixa-84b39.firebaseapp.com',
    projectId: 'loyixa-84b39',
    storageBucket: 'loyixa-84b39.firebasestorage.app',
    messagingSenderId: '185172472066',
    appId: '1:185172472066:web:f1aacf073094875b97521b',
    measurementId: 'G-BT8ZWRCEEG',
    };

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const auth = getAuth(app);

    void isSupported()
    .then((supported) => {
        if (supported) getAnalytics(app);
    })
    .catch(() => undefined);

    const providers = {
    google: new GoogleAuthProvider(),
    apple: new OAuthProvider('apple.com'),
    microsoft: new OAuthProvider('microsoft.com'),
    };

    providers.google.setCustomParameters({ prompt: 'select_account' });

    export { app, auth, providers };
