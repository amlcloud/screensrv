import * as functions from "firebase-functions";
import * as sanctions from "sanctions";
import { saveList } from "./common";


export const dfat_gov_au__consolidated_list = functions.pubsub
//.schedule("* * * * *")
.schedule("every 5 minutes")
.timeZone("Australia/Sydney")
.onRun(async () =>{ 
  console.log('fetch list...');
  await sanctions.dfat_gov_au__consolidated_list();
  console.log('saveList...');
  await saveList(await sanctions.dfat_gov_au__consolidated_list(), 
    'dfat_gov_au__consolidated_list', "Name of Individual or Entity");
  return null;
});

// //fetchUK in index.js
// export const gov_uk__financial_sanctions_list = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.gov_uk__financial_sanctions_list(), 
//     'dfat_gov_au__consolidated_list', "Name of Individual or Entity");
// });

export const ec_europa_eu__sanctions_list = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
  await sanctions.ec_europa_eu__sanctions_list();

    await saveList(await sanctions.ec_europa_eu__sanctions_list(), 
    'ec_europa_eu__sanctions_list', "Name of Individual or Entity");
});

export const government_nl__dnslt = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.government_nl__dnslt(), 
    'government_nl__dnslt', "Name of Individual or Entity");
});

// //Have to add in index.js
// export const worldbank_org__debarred_firms_and_individuals = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.worldbank_org__debarred_firms_and_individuals(), 
//     'worldbank_org__debarred_firms_and_individuals', "Name of Individual or Entity");
// });


export const un_org__consolidated_individuals = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.un_org__consolidated_individuals(), 
    'un_org__consolidated_individuals', "Name of Individual or Entity");
});

// Have to add in index.js
// export const un_org__consolidated_entities = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.un_org__consolidated_entities(), 
//     'un_org__consolidated_entities', "Name of Individual or Entity");
// });


export const treasury_gov__sdnl = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.treasury_gov__sdnl(), 
    'treasury_gov__sdnl', "Name of Individual or Entity");
});


export const pmddtc_state_gov__aeca_dsl = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.pmddtc_state_gov__aeca_dsl(), 
    'pmddtc_state_gov__aeca_dsl', "Name of Individual or Entity");
});

// Have to add in index.js
// export const trade_gov_csl = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.trade_gov_csl(), 
//     'trade_gov_csl', "Name of Individual or Entity");
// });


export const bis_doc_gov__denied_persons = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.bis_doc_gov__denied_persons(), 
    'bis_doc_gov__denied_persons', "Name of Individual or Entity");
});

//Have to add in index.js
// export const ecfr_gov__entity_list = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.ecfr_gov__entity_list(), 
//     'ecfr_gov__entity_list', "Name of Individual or Entity");
// });

// Have to add in index.js
// export const state_gov__nps = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.state_gov__nps(), 
//     'state_gov__nps', "Name of Individual or Entity");
// });


export const occ_gov__enforcement_actions = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.occ_gov_enforcement_actions(), 
    'occ_gov__enforcement_actions', "Name of Individual or Entity");
});

//Have to add in index.js
// export const ecfr_gov__militaryenduser = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.ecfr_gov__militaryenduser(), 
//     'ecfr_gov__militaryenduser', "Name of Individual or Entity");
// });

// Have to add in index.js
// export const ecfr_gov__unverified = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.ecfr_gov__unverified(), 
//     'ecfr_gov__unverified', "Name of Individual or Entity");
// });

// Have to add in index.js
// export const dgtresor_gouv_fr__national_freeze_registry = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.dgtresor_gouv_fr__national_freeze_registry(), 
//     'dgtresor_gouv_fr__national_freeze_registry', "Name of Individual or Entity");
// });

// Have to add in index.js
// export const gc_ca__consol_autonomous_sanctions = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.gc_ca__consol_autonomous_sanctions(), 
//     'gc_ca__consol_autonomous_sanctions', "Name of Individual or Entity");
// });

// Have to add in index.js
// export const publicsafety_gc_ca__counter_terrorism_entity = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.publicsafety_gc_ca__counter_terrorism_entity(), 
//     'gc_ca__consol_autonomous_sanctions', "Name of Individual or Entity");
// });



export const publicsafety_gc_ca__counter_terrorism_entity = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.publicsafety_gc_ca__counter_terrorism_entity(), 
    'publicsafety_gc_ca__counter_terrorism_entity', "Name of Individual or Entity");
});

// export const  = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.(), 
//     '', "Name of Individual or Entity");
// });
// export const  = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.(), 
//     '', "Name of Individual or Entity");
// });
// export const  = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.(), 
//     '', "Name of Individual or Entity");
// });
// export const  = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.(), 
//     '', "Name of Individual or Entity");
// });
// export const  = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.(), 
//     '', "Name of Individual or Entity");
// });
// export const  = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.(), 
//     '', "Name of Individual or Entity");
// });
// export const  = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.(), 
//     '', "Name of Individual or Entity");
// });
