"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = exports.auth = exports.storage = exports.analytics = exports.app = void 0;
const app_1 = require("firebase/app");
const analytics_1 = require("firebase/analytics");
const storage_1 = require("firebase/storage");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyBmVLOays8uJvHTVfakeNdRclu0oyYQQkc',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'glovia-ac45a.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'glovia-ac45a',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'glovia-ac45a.firebasestorage.app',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '431707701756',
    appId: process.env.FIREBASE_APP_ID || '1:431707701756:web:d06ea8aaa62538f16b3279',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-EKFX6HNRFT',
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.app = app;
const analytics = (0, analytics_1.getAnalytics)(app);
exports.analytics = analytics;
const storage = (0, storage_1.getStorage)(app);
exports.storage = storage;
const auth = (0, auth_1.getAuth)(app);
exports.auth = auth;
const firestore = (0, firestore_1.getFirestore)(app);
exports.firestore = firestore;
//# sourceMappingURL=firebase.config.js.map