import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

//const serviceAccount = require("../screener-9631e-firebase-adminsdk-ipwv7-84336a16ac.json");

initializeApp();//{ credential: cert(serviceAccount) });

export var db = getFirestore();

export { onSearchCreate } from './screen';
export { getList } from './list';
export { getListDetails } from './list';

export { dfat_gov_au__consolidated_list } from "./fetch";
export { gov_uk__financial_sanctions_list } from "./fetch";
export { ec_europa_eu__sanctions_list } from "./fetch";
export { government_nl__dnslt } from "./fetch";
export { worldbank_org__debarred_firms_and_individuals } from "./fetch";
export { un_org__consolidated_individuals } from "./fetch";
export { un_org__consolidated_entities } from "./fetch";
export { treasury_gov__sdnl } from "./fetch";
// export {  } from "./fetch";
// export {  } from "./fetch";
// export {  } from "./fetch";
// export {  } from "./fetch";
