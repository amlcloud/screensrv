import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import {getStorage} from 'firebase/storage'

//const serviceAccount = require("../screener-9631e-firebase-adminsdk-ipwv7-84336a16ac.json");

initializeApp({
    // Im not sure that we need to add all the fields or just this one so im not deploying it now.
    //  Oleksii 
    storageBucket: "screener-9631e.appspot.com"
});//{ credential: cert(serviceAccount) });

export var db = getFirestore();
export var storage = getStorage();

export { onSearchCreate } from './screen';
export { getList } from './list';
export { getListDetails } from './list';
export {GetSanctionsList} from './sanctions_list'
export {GetSanctionsListEntities} from './sanction_list_entities'
export {GetSanctionsListItemEntity} from './sanction_list_item_entity'

export { index_list }  from './list_index';
export { index_list2 }  from './list_index';
export { test }  from './list_index';
export { screen }  from './screen';
export {StorageWriteList} from './storage'

export { dfat_gov_au__consolidated_list } from "./fetch";
// export { gov_uk__financial_sanctions_list } from "./fetch";
export { ec_europa_eu__sanctions_list } from "./fetch";
export { government_nl__dutch_national_sanctions_list } from "./fetch";
// export { worldbank_org__debarred_firms_and_individuals } from "./fetch";
export { un_org__consolidated_individuals } from "./fetch";
// export { un_org__consolidated_entities } from "./fetch";
export { treasury_gov__nonsdnl } from "./fetch";
export { pmddtc_state_gov__aeca_dsl } from "./fetch";
// export { trade_gov_csl } from "./fetch";
export { bis_doc_gov__denied_persons } from "./fetch";
// export { ecfr_gov__entity_list } from "./fetch";
// export { state_gov__nps } from "./fetch";
export { occ_gov__enforcement_actions } from "./fetch";
//export { ecfr_gov__militaryenduser } from "./fetch";
// export { ecfr_gov__unverified } from "./fetch";
export { dgtresor_gouv_fr__national_freeze_registry } from "./fetch";
// export { ecfr_gov__militaryenduser } from "./fetch";
// // export { ecfr_gov__unverified } from "./fetch";
// // export { dgtresor_gouv_fr__national_freeze_registry } from "./fetch";
// export { gc_ca__consol_autonomous_sanctions } from "./fetch";


export { GetSanctionLists } from "./GetSanctionLists";
