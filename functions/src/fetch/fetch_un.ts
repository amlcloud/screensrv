import * as functions from "firebase-functions";
const sanctions = require("sanctions");
import { saveList } from "../common";
const listId = "webgate.ec.europa.eu";
const fieldId = "euReferenceNumber";

export const unList = functions.pubsub
  .schedule("5 11 * * *")
  .timeZone("Australia/Sydney")
  .onRun(async () => {
    console.log("This will be run every day at 11:05 AM");
    await fetchUNList();
    return null;
  });

export async function fetchUNList() {
  try {
    const list = await sanctions.fetchUN();
    await saveList(list, listId, fieldId);
  } catch (error) {
    console.log("error ", error);
  }
}


// import * as functions from "firebase-functions";
// const nodeFetch = require("node-fetch");
// // import { FieldValue } from 'firebase-admin/firestore';
// import * as Xml2js from "xml2js";
// import { db } from "./index";

// import { createHash } from "node:crypto";

// export const fetchUNlist = functions.pubsub.schedule("5 11 * * *").timeZone("Australia/Sydney").onRun(async () => {
//   console.log("This will be run every day at 11:05 AM");
//   await fetchUN();
//   return null;
// });


// export async function fetchUN(): Promise<void> {
//   const listId = "scsanctions.un.org";
//   const response = await nodeFetch("https://scsanctions.un.org/resources/xml/en/consolidated.xml");
//   const bodyXML = await response.text();

//   let parseString = (new Xml2js.Parser({ explicitArray: false }))
//     .parseString; // require('xml2js').parseString;

//   return new Promise((resolve, reject) =>
//     parseString(bodyXML, async (err: any, result: any) => {
//       if (err) reject(err);

//       let hash = createHash("md5").update(bodyXML).digest("hex");
//       console.dir(`fetched list document with hash: ${hash}`);
//       // const listDoc = await db
//       //   .collection('list')
//       //   .doc(listId)
//       //   .get();

//       // if (listDoc.exists && listDoc.data()!['lastUpdateHash'] === hash) {
//       //   console.log('hash not changed, skip update');
//       //   return;
//       // }

//       // console.dir(result['CONSOLIDATED_LIST']['INDIVIDUALS']['INDIVIDUAL']);

//       await db
//         .collection("list")
//         .doc(listId)
//         .update(
//           {
//             // 'lastUpdateTime': FieldValue.serverTimestamp(),
//             "lastUpdateHash": hash,
//           }
//         );

//       const individualsArray = result["CONSOLIDATED_LIST"]["INDIVIDUALS"]["INDIVIDUAL"];
//       console.log(`individuals count: ${individualsArray.length}`);

//       for (const ind of individualsArray) {
//         // console.log(ind['DATAID']);

//         const itmRef = db
//           .collection("list")
//           .doc(listId)
//           .collection("item").doc(ind["DATAID"]);


//         await itmRef.set(
//           ind
//         );

//         let fullName = "";
//         ["FIRST_NAME", "SECOND_NAME", "THIRD_NAME"].forEach((name: string) => {
//           if (ind[name] !== undefined) {
//             fullName += " " + ind[name].toString().trim();
//           }
//         });
//         fullName = fullName.trim();

//         // break;
//       }

//       resolve(result);
//     }));
// }
