// import axios from "axios";
import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import * as sanctions from "sanctions";
import { db } from ".";
import { safeString, saveList } from "./common";
import { gramCounterBool } from "./gram";
// import fetch from 'node-fetch';
// const XLSX = require("xlsx");
// import { dfat_gov_au__consolidated_list1 } from "./dfat_gov_au__consolidated_list";
const cors = require('cors')({ origin: true });

export const test = functions.runWith({timeoutSeconds:500}).https
.onRequest(async (request, res) => {
  
    res.send(JSON.stringify(request.body));
  });

export const index_list = functions.runWith({timeoutSeconds:540}).https
.onRequest(async (request, res) => {
  cors(request, res,async () => {

    const listId:string=request.query.list as string;
    const fieldId:string=request.query.field as string;

    console.log(`indexing list ${listId} by ${fieldId}`)
    const items=
    await db.collection("list").doc(listId).collection('item').get();

    let counter = 0;
    let batch = db.batch();


    for(let itm of items.docs) {
      
      batch.set(
      db
        .collection('index')
        .doc('dfat_gov_au__consolidated_list'+'|'+safeString(itm.data()[fieldId]))
        ,{
          'ref': itm.ref,
          'target': itm.data()[fieldId],
          't': FieldValue.serverTimestamp(),
          ...gramCounterBool(itm.data()[fieldId], 2),
        });
        counter++;

        if (counter > 490) {
          await batch.commit();
          batch = db.batch();
          counter = 0;
        }
    }
    await batch.commit();

    console.log(`indexed list ${listId} by ${fieldId}: ${items.size} entities`)

    res.send(`indexed list ${request.query.list}`);

  })
});


export const index_list2 = functions.runWith({timeoutSeconds:540}).https
.onRequest(async (request, res) => {
  cors(request, res,async () => {

    const listId:string=request.query.list as string;
    const fieldId:string=request.query.field as string;
    const settings:any=request.body;

    console.log(`indexing list ${listId} by ${fieldId} with settings ${JSON.stringify(settings)}`)
    const items=
    await db.collection("list").doc(listId).collection('item').get();

    let counter = 0;
    let batch = db.batch();


    for(let itm of items.docs) {

      console.log(`parse item ${JSON.stringify(itm.data())}`)

      for(let setting of settings) {
        if(setting.type==='array') {
          console.log(`parse array ${JSON.stringify(itm.data()[setting.field])}`)

          if(typeof itm.data()[setting.field] ==='object') {
            addToBatch(batch, listId, itm.ref, itm.data()[setting.field][setting.subField])

            counter++;
            if (counter > 490) {
              await batch.commit();
              batch = db.batch();
              counter = 0;
            }
          } else {
          for(let entry of itm.data()[setting.field].values) {
            console.log(`array entry ${entry}`)
            
            addToBatch(batch, listId, itm.ref, entry[setting.subField])

            counter++;
            if (counter > 490) {
              await batch.commit();
              batch = db.batch();
              counter = 0;
            }
          }
        }
        } else {
          addToBatch(batch, listId, itm.ref, itm.data()[setting.field])

          counter++;
          if (counter > 490) {
            await batch.commit();
            batch = db.batch();
            counter = 0;
          }
        }
        
          
        }
    }
    await batch.commit();

    console.log(`indexed list ${listId} by ${fieldId}: ${items.size} entities`)

    res.send(`indexed list ${request.query.list}`);

  })
});

function addToBatch(batch:any, listId:any, ref:any, name:string)
{
  batch.set(
    db
      .collection('index')
      .doc(listId+'|'+safeString(name))
      ,{
        'ref': ref,
        'target': name,
        't': FieldValue.serverTimestamp(),
        ...gramCounterBool(name, 2),
      });
}

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

export const government_nl__dutch_national_sanctions_list = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.government_nl__dutch_national_sanctions_list(), 
    'government_nl__dutch_national_sanctions_list', "Name of Individual or Entity");
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


export const treasury_gov__nonsdnl = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.treasury_gov__nonsdnl(), 
    'treasury_gov__nonsdnl', "Name of Individual or Entity");
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
    await saveList(await sanctions.occ_gov__enforcement_actions(), 
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


export const dgtresor_gouv_fr__national_freeze_registry = functions.pubsub
.schedule("5 11 * * *")
.timeZone("Australia/Sydney")
.onRun(async () => {
    await saveList(await sanctions.dgtresor_gouv_fr__national_freeze_registry(), 
    'dgtresor_gouv_fr__national_freeze_registry', "Name of Individual or Entity");
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
    await saveList(await sanctions.publicsafety_gc_ca__counter_terrorism_entity(), 
    'gc_ca__consol_autonomous_sanctions', "Name of Individual or Entity");
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
