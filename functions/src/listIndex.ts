// import axios from "axios";
import { DocumentReference, FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { db } from ".";
import { safeDocumentID, safeIndexingTarget } from "./common";
import { gramCounterBool } from "./gram";
import { Query, QuerySnapshot } from "firebase-admin/firestore";
const cors = require("cors")({ origin: true });

export const test = functions
  .runWith({ timeoutSeconds: 500 })
  .https.onRequest(async (request, res) => {
    console.log(
      `This is a test parameter: ${request.query.test_parameter as string}`
    );

    res.send(JSON.stringify(request.body));
  });

export const indexList = functions
  .runWith({ timeoutSeconds: 540 })
  .https.onRequest(async (request, res) => {
    cors(request, res, async () => {
      const listId: string = request.query.list as string;
      const fieldId: string = request.query.field as string;

      console.log(`indexing list ${listId} by ${fieldId}`);
      const items = await db
        .collection("list")
        .doc(listId)
        .collection("item")
        .get();

      let counter = 0;
      let batch = db.batch();

      for (let itm of items.docs) {
        batch.set(
          db
            .collection("index")
            .doc(listId + "|" + safeDocumentID(itm.data()[fieldId])),
          {
            ref: itm.ref,
            target: itm.data()[fieldId],
            t: FieldValue.serverTimestamp(),
            ...gramCounterBool(itm.data()[fieldId], 2),
          }
        );
        counter++;

        if (counter > 490) {
          await batch.commit();
          batch = db.batch();
          counter = 0;
        }
      }
      await batch.commit();

      console.log(
        `indexed list ${listId} by ${fieldId}: ${items.size} entities`
      );

      res.send(`indexed list ${request.query.list}`);
    });
  });

export const indexList2 = functions
  .runWith({ timeoutSeconds: 540 })
  .https.onRequest(async (request, res) => {
    cors(request, res, async () => {
      const listId: string = request.query.list as string;
      const deleteRequest = request.query.delete as string;
      const statusColRef = db.collection("indexStatus");
      const statusDocRef = await statusColRef
        .where("listId", "==", listId)
        .get();
      let statusRef: DocumentReference;
      let indexing: boolean = false;
      if (statusDocRef.docs.length > 0) {
        statusRef = statusDocRef.docs[0].ref;
        indexing = statusDocRef.docs[0].data().indexing;
      } else {
        statusRef = await statusColRef.add({
          listId: listId,
          count: 0,
          total: 0,
        });
      }
      if (indexing) {
        res.send(
          `list ${request.query.list} is indexing. please try again later.`
        );
      } else {
        await statusRef.update({ count: 0, indexing: true });
        await deleteLargeColByQuery(
          db.collection("index").where("listId", "==", listId)
        );
        if (deleteRequest !== "true") {
          let counter = 0;
          let indexMap = new Map<DocumentReference, boolean>();
          let batch = db.batch();
          const reference = await db.collection("list").doc(listId);
          const indexConfigs = await reference.collection("indexConfigs").get();
          const items = await reference.collection("item").get();
          await statusRef.update({ total: items.size });
          for (let indexConfig of indexConfigs.docs) {
            let entityIndexFields = await indexConfig.ref
              .collection("entityIndexFields")
              .orderBy("createdTimestamp")
              .get();
            // var valid = true;
            // for (let entityIndexField of entityIndexFields.docs) {
            //   if (!entityIndexField.data().valid) {
            //     valid = false;
            //     break;
            //   }
            // }
            if (
              //valid &&
              entityIndexFields.docs.length > 0
            ) {
              let type = indexConfig.data().type;
              for (let item of items.docs) {
                if (type === "Single field") {
                  let value: string =
                    item.data()[entityIndexFields.docs[0].data().value];
                  if (!Array.isArray(value)) {
                    let indexDocRef = undefined;
                    if (value != undefined) {
                      indexDocRef = addToBatch(
                        batch,
                        listId,
                        type,
                        item.ref,
                        value
                      );
                    }
                    counter++;
                    if (indexDocRef !== undefined) indexMap.set(item.ref, true);
                    if (counter > 490) {
                      statusRef.update({ count: [...indexMap.keys()].length });
                      await batch.commit();
                      batch = db.batch();
                      counter = 0;
                    }
                  }
                } else if (type === "Multiple fields") {
                  var containsArray = false;
                  var name = "";
                  for (let entityIndexField of entityIndexFields.docs) {
                    let value: string =
                      item.data()[entityIndexField.data().value];
                    if (Array.isArray(value)) {
                      containsArray = true;
                      break;
                    }
                    if (value != undefined) {
                      name += (name.length > 0 ? " " : "") + value;
                    }
                  }
                  if (!containsArray) {
                    const indexDocRef = addToBatch(
                      batch,
                      listId,
                      type,
                      item.ref,
                      name
                    );

                    counter++;
                    if (indexDocRef !== undefined) indexMap.set(item.ref, true);
                    if (counter > 490) {
                      statusRef.update({ count: [...indexMap.keys()].length });
                      await batch.commit();
                      batch = db.batch();
                      counter = 0;
                    }
                  }
                } else if (type === "Array of values") {
                  let values: string[] =
                    item.data()[entityIndexFields.docs[0].data().value];
                  if (Array.isArray(values)) {
                    for (let value of values) {
                      let indexDocRef = null;
                      if (value != undefined) {
                        indexDocRef = addToBatch(
                          batch,
                          listId,
                          type,
                          item.ref,
                          value
                        );
                      }
                      counter++;
                      if (indexDocRef !== undefined)
                        indexMap.set(item.ref, true);

                      if (counter > 490) {
                        statusRef.update({
                          count: [...indexMap.keys()].length,
                        });
                        await batch.commit();
                        batch = db.batch();
                        counter = 0;
                      }
                    }
                  }
                }
              }
            }
          }
          statusRef.update({
            count: [...indexMap.keys()].length,
            indexing: false,
          });
          await batch.commit();
        }
        res.send(`indexed list ${request.query.list}`);
      }
    });
  });

function addToBatch(
  batch: any,
  listId: any,
  type: string,
  ref: any,
  name: string
): DocumentReference | undefined {
  if (name === undefined) {
    console.log(`undefined name for ${ref.path}, list: ${listId}}`);
    return undefined;
  }

  let target = safeIndexingTarget(name);

  const indexDocRef = db
    .collection("index")
    .doc(listId + "|" + safeDocumentID(name));
  batch.set(indexDocRef, {
    ref: ref,
    listId: listId,
    type: type,
    target: target,
    t: FieldValue.serverTimestamp(),
    ...gramCounterBool(target, 2),
  });
  return indexDocRef;
}

export async function deleteLargeColByQuery(query: Query) {
  let batch = db.batch();
  let counter = 0;

  let chunk: QuerySnapshot;
  do {
    chunk = await query.select().limit(450).get();
    for (const l of chunk.docs) {
      batch.delete(l.ref);
      counter++;

      if (counter > 450) {
        await batch.commit();
        batch = db.batch();
        counter = 0;
      }
    }
    await batch.commit();
    batch = db.batch();
    counter = 0;
  } while (chunk.size > 0);
}
