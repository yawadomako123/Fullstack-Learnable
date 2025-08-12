// firebase/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCN-_V5s-zkZUFkvsmQQzQZ4KsERRGjtVY",
  authDomain: "coursera-clone-ed195.firebaseapp.com",
  projectId: "coursera-clone-ed195",
  storageBucket: "coursera-clone-ed195.appspot.com",
  messagingSenderId: "626982036117",
  appId: "1:626982036117:ios:6e23cb0cff9cf7ee5db19c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
