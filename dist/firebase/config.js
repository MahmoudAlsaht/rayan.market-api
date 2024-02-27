"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
// Todo: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
// 	apiKey: process.env.APIKEY,
// 	authDomain: process.env.AUTHDOMAIN,
// 	projectId: process.env.PROJECTID,
// 	storageBucket: process.env.STORAGEBUCKET,
// 	messagingSenderId: process.env.MESSAGINGSENDERID,
// 	appId: process.env.APPID,
// 	measurementId: process.env.MEASUREMENTID,
// };
const firebaseConfig = {
    apiKey: 'AIzaSyCVL9W1UNttUwTEj5DEHEM85d3W9dn3n0g',
    authDomain: 'mstore-e4ba8.firebaseapp.com',
    projectId: 'mstore-e4ba8',
    storageBucket: 'mstore-e4ba8.appspot.com',
    messagingSenderId: '465441869515',
    appId: '1:465441869515:web:c399aaf3a5af41806b154e',
    measurementId: 'G-8BEMVJZ024',
};
// Initialize Firebase
exports.app = (0, app_1.initializeApp)(firebaseConfig);
const firebaseDb = () => (0, firestore_1.getFirestore)(exports.app);
exports.default = firebaseDb;
//# sourceMappingURL=config.js.map