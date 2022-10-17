// import axios from "axios";
import * as functions from "firebase-functions";
import * as sanctions from "sanctions";
import { saveList } from "./common";
// import fetch from 'node-fetch';
// const XLSX = require("xlsx");
// import { dfat_gov_au__consolidated_list1 } from "./dfat_gov_au__consolidated_list";
const cors = require('cors')({ origin: true });

export const get_dfat_gov_au__consolidated_list = functions.runWith({timeoutSeconds:500}).https
.onRequest(async (request, res) => {
  cors(request, res,async () => {

    console.log('load list...');
    const result=await sanctions.dfat_gov_au__consolidated_list();
    console.log('saveList...');
    await saveList(await sanctions.dfat_gov_au__consolidated_list(), 
      'dfat_gov_au__consolidated_list', "Name of Individual or Entity");
      res.send(result);

//   console.log('fetch list...');
//   //const res=await dfat_gov_au__consolidated_list1();
//   // const resp = 
//   const response = await fetch('https://www.dfat.gov.au/sites/default/files/regulation8_consolidated.xls');
// // const body = await response.buffer();//.text();
// // console.log(`${body}`);
// // console.log('axios...');
//   // await axios({
//   //   method: "GET",
//   //   url: "https://www.dfat.gov.au/sites/default/files/regulation8_consolidated.xls",
//   //   responseType: "arraybuffer",
//   // }).then(response => {
//   //   console.log(response.data);
//   //   return res.status(200).json({
//   //     message: response.data.ip
//   //   })
//   // })
//   // .catch(err => {
//   //   return res.status(500).json({
//   //     error: err
//   //   })
//   // })
//   const buffers: any = [];
//   console.log("pushing to buffer");
//     buffers.push(await response.buffer());
//     const buffer = Buffer.concat(buffers);
//     const workbook = XLSX.read(buffer);
//     const sheetName = workbook.SheetNames[0];
//     console.log("sheetName ", sheetName);

//     // CONVERT SHEET TO JSON
//   const auIndividuals = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
//   console.log("au Individuals count ", auIndividuals.length);

//   let result = [];
//   for (const person of auIndividuals as any) {
//     // console.log(
//     //   `loop # ${++count} -- looping over ${person["Name of Individual or Entity"]}`
//     // );

//     let p: any = {};

//     p["Reference"] = person["Reference"] || "";
//     p["Name of Individual or Entity"] =
//       person["Name of Individual or Entity"] || "";
//     p["Type"] = person["Type"] || "";
//     p["Name Type"] = person["Name Type"] || "";
//     p["Date of Birth"] = person["Date of Birth"] || "";
//     p["Place of Birth"] = person["Place of Birth"] || "";
//     p["Citizenship"] = person["Citizenship"] || "";
//     p["Address"] = person["Address"] || "";
//     p["Additional Information"] = person["Additional Information"] || "";
//     p["Listing Information"] = person["Listing Information"] || "";
//     p["Committees"] = person["Committees"] || "";
//     p["Control Date"] = person["Control Date"] || "";

//     const docId = person["Name of Individual or Entity"];

//     console.log("docId ", docId);

//     result.push(p);
//   }

  
//   res.send(result);
//   // res.send('done');
  })
});


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
<<<<<<< HEAD
    'publicsafety_gc_ca__counter_terrorism_entity', "Name of Individual or Entity");
=======
    'gc_ca__consol_autonomous_sanctions', "Name of Individual or Entity");
>>>>>>> 76842aa4b1bc9af47f3b39382c73cad3b4ae25e6
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
