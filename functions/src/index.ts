import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
//import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//


//const serviceAccount = require("../screener-9631e-firebase-adminsdk-ipwv7-84336a16ac.json");

initializeApp();//{ credential: cert(serviceAccount) });

export var db = getFirestore();

// export { screen } from './screen';

export { onSearchCreate } from './screen';
export { getList } from './list';
export { getListDetails } from './list';
export { screen } from './screen';




