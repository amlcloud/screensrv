
const assert = require("assert");
const initializeApp = require("firebase-admin/app").initializeApp;
const cert = require("firebase-admin/app").cert;
const getFirestore = require("firebase-admin/firestore").getFirestore;
// import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = require("../screener-9631e-firebase-adminsdk-ipwv7-84336a16ac.json");

console.log("running");

// require('../lib/fetch_au').fetchAU();
// require('../lib/fetch_nl').fetchNL();
// require('../lib/fetch_eu').fetchEU();
require("../lib/fetch_usa").fetchUSA();

