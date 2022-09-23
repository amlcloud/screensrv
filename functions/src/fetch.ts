import * as functions from "firebase-functions";
const sanctions = require("sanctions");
import { saveList } from "./common";

export const dfat_gov_au__consolidated_list = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.dfat_gov_au__consolidated_list(), 
    'dfat_gov_au__consolidated_list', "Name of Individual or Entity");
});

export const gov_uk__financial_sanctions_list = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.gov_uk__financial_sanctions_list(), 
    'dfat_gov_au__consolidated_list', "Name of Individual or Entity");
});

export const ec_europa_eu__sanctions_list = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
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


export const worldbank_org__debarred_firms_and_individuals = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.worldbank_org__debarred_firms_and_individuals(), 
    'worldbank_org__debarred_firms_and_individuals', "Name of Individual or Entity");
});


export const un_org__consolidated_individuals = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.un_org__consolidated_individuals(), 
    'un_org__consolidated_individuals', "Name of Individual or Entity");
});


export const un_org__consolidated_entities = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.un_org__consolidated_entities(), 
    'un_org__consolidated_entities', "Name of Individual or Entity");
});


export const treasury_gov__sdnl = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.treasury_gov__sdnl(), 
    'treasury_gov__sdnl', "Name of Individual or Entity");
});


// export const pmddtc_state_gov__aeca_dsl = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.pmddtc_state_gov__aeca_dsl(), 
//     'pmddtc_state_gov__aeca_dsl', "Name of Individual or Entity");
// });


// export const trade_gov_csl = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.trade_gov_csl(), 
//     'trade_gov_csl', "Name of Individual or Entity");
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
