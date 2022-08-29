import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

//const serviceAccount = require("../screener-9631e-firebase-adminsdk-ipwv7-84336a16ac.json");

initializeApp();//{ credential: cert(serviceAccount) });

export var db = getFirestore();

export { onSearchCreate } from './screen';
export { getList } from './list';
export { getListDetails } from './list';
export { screen } from './screen';
export { fetchAU } from "./fetch/fetch_au";
export { fetchNL } from "./fetch/fetch_nl";
export { fetchEU } from "./fetch/fetch_eu";
export { fetchUSA } from "./fetch/fetch_usa";
// export { fetchUKList } from "./fetch/fetch_uk";
