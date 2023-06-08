import { db } from "./index";
const nodeFetch = require("node-fetch");
import * as functions from "firebase-functions";
import * as sanctions from "sanctions";
import { updateList } from "./common";
import { DocumentSnapshot } from "firebase-admin/firestore";

export async function fetchJSON(url:String) {
  
    // Make the API Call
    const response = await nodeFetch(url, {
      method: "GET",
    //   headers: new nodeFetch.Headers({
    //     apiKey: API_KEY,
    //   }),
    });
  
    // get the data
    const text = await response.text();
    
    console.log('response: '+text.substring(0, 100));

    const responseJson = JSON.parse(text);
    console.log('responseJson: '+JSON.stringify(responseJson).substring(0, 100));
    console.log(`items found: ${responseJson.length}`);
  
    // Generate the hash in the list document
    // const hash = createHash("md5").update(text).digest("hex");
    // console.log(`fetched list document with hash: ${hash}`);
  
    // let res: { [key: string]: any }[] = [];
    // // update docs in the batch
    // // const batches: Array<Array<any>> = [[]];
    // data.forEach((item: any) => {
    //   res.push(item);
    // });
  
    return responseJson;
  }

async function fetchList(listId: string) {
  const listDoc:DocumentSnapshot = await db.collection("list").doc(listId).get();
  console.log('listDoc: '+JSON.stringify(listDoc.data()));
  if (!listDoc.exists || !listDoc.data()!['artifactId']===undefined) {
    console.log('artifactId not found');
    return;
  }
  const artifactId = listDoc.get('artifactId');

  console.log('artifact id: '+artifactId);
  const url = "https://asia-northeast1-avtomat-40a28.cloudfunctions.net/get_artifact_data?artifactId="+artifactId;
  console.log(`fetch list from ${url}...`);
  var json = await fetchJSON(url);
  console.log('saveList...');
  await updateList(json, listId);
}
  
export const ec_europa_eu__sanctions_list = functions
.runWith({ timeoutSeconds: 540 })
.pubsub
    .schedule(
        "*/15 * * * *"
        //"5 11 * * *"
    )
    .timeZone("Australia/Sydney")
    .onRun(async () => fetchList('ec_europa_eu__sanctions_list'));

export const un_org__consolidated_individuals = functions
.runWith({ timeoutSeconds: 540 })
.pubsub
    .schedule(
        "*/15 * * * *"
        //"5 11 * * *"
    )
    .timeZone("Australia/Sydney")
    .onRun(async () => fetchList('un_org__consolidated_individuals'));

    // export const un_org__consolidated_individuals = functions.pubsub
    // .schedule("5 11 * * *")
    // .timeZone("Australia/Sydney")
    // .onRun(async () => {
    //     await updateList(await sanctions.un_org__consolidated_individuals(), 
    //     'un_org__consolidated_individuals', "Name of Individual or Entity");
    // });
        

export const dfat_gov_au__consolidated_list = functions
.runWith({ timeoutSeconds: 540 })
.pubsub
.schedule("*/15 * * * *")
.timeZone("Australia/Sydney")
.onRun(async () => fetchList('dfat_gov_au__consolidated_list'));

export const treasury_gov__ofac_sdnl = functions
.runWith({ timeoutSeconds: 540 })
.pubsub
.schedule("*/15 * * * *")
.timeZone("Australia/Sydney")
.onRun(async () => fetchList('treasury_gov__ofac_sdnl'));



export const government_nl__dutch_national_sanctions_list = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await updateList(await sanctions.government_nl__dutch_national_sanctions_list(), 
    'government_nl__dutch_national_sanctions_list');
});

// //Have to add in index.js
// export const worldbank_org__debarred_firms_and_individuals = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.worldbank_org__debarred_firms_and_individuals(), 
//     'worldbank_org__debarred_firms_and_individuals', "Name of Individual or Entity");
// });



// Have to add in index.js
// export const un_org__consolidated_entities = functions.pubsub
// .schedule("5 11 * * *")
// .timeZone("Australia/Sydney")
// .onRun(async () => {
//     await saveList(await sanctions.un_org__consolidated_entities(), 
//     'un_org__consolidated_entities', "Name of Individual or Entity");
// });


export const treasury_gov__nonsdnl = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await updateList(await sanctions.treasury_gov__nonsdnl(), 
    'treasury_gov__nonsdnl');
});


export const pmddtc_state_gov__aeca_dsl = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await updateList(await sanctions.pmddtc_state_gov__aeca_dsl(), 
    'pmddtc_state_gov__aeca_dsl');
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
    await updateList(await sanctions.bis_doc_gov__denied_persons(), 
    'bis_doc_gov__denied_persons');
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
    await updateList(await sanctions.occ_gov__enforcement_actions(), 
    'occ_gov__enforcement_actions');
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


export const dgtresor_gouv_fr__national_freeze_registry = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await updateList(await sanctions.dgtresor_gouv_fr__national_freeze_registry(), 
    'dgtresor_gouv_fr__national_freeze_registry');
});

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
    await updateList(await sanctions.publicsafety_gc_ca__counter_terrorism_entity(), 
    'gc_ca__consol_autonomous_sanctions');
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
