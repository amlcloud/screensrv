import { CollectionReference, DocumentReference, FieldValue } from "firebase-admin/firestore";
import { db } from "./index";
import { createHash } from "node:crypto";
import { deleteLargeColByQuery } from "./list_index";

const FIRESTORE_WRITE_BATCH_SIZE = 450;

export function safeDocumentID(unsafe: string):string {
  return unsafe.replace(/\//gi, '_');
}

export function safeIndexingTarget(unsafe: string):string {
  return unsafe.replace(/[^A-Za-z0-9- ]/g, '').trim();
}

export async function saveFields(jsonArray: any[], listId: string) {
  let dict: any = {};
  for (let item of jsonArray) {
    for (let key in item) {
      if (key in dict) {
        dict[key]['count'] = dict[key]['count'] + 1;
      } else {
        dict[key] = {type: Array.isArray(item[key]) ? 'array' : typeof(item[key]), count: 1};
      }
    }
  }
  let batch = db.batch();
  let counter = 0;
  let colRef: CollectionReference = db.collection('list').doc(listId).collection('fields');
  let fields = await colRef.listDocuments();
  for (let i = 0; i < fields.length; i++) {
    batch.delete(fields[i]);
    counter++;
    if (counter > FIRESTORE_WRITE_BATCH_SIZE) {
      await batch.commit();
      batch = db.batch();
      counter = 0;
    }
  }
  for (let key in dict) {
    batch.set(colRef.doc(key), dict[key]);
    counter++;
    if (counter > FIRESTORE_WRITE_BATCH_SIZE) {
      await batch.commit();
      batch = db.batch();
      counter = 0;
    }
  }
  await batch.commit();
}

// Saving list
export async function updateList(jsonArray: any[], listId: string) {
  let docRef: DocumentReference = db.collection("list").doc(listId);
  let hash = createHash("md5").update(JSON.stringify(jsonArray)).digest("hex");
  console.dir(`fetched list document with hash: ${hash}`);
  let doc = await docRef.get();
  if (doc.exists && doc.data()?.["lastUpdateHash"] === hash) {
    console.log("hash not changed, skip update");
    return;
  }

  docRef.collection('history').add(doc.data()!);

  await docRef.set(
    {
      "lastUpdateTime": FieldValue.serverTimestamp(),
      "lastUpdateHash": hash,
      "lastUpdateCount": jsonArray.length,
    }, {merge: true}
  );

  await deleteLargeColByQuery(docRef.collection("item"));

  const itemCol = await docRef.collection("item").get();
  console.log(`deleted items, current size: ${itemCol.size}`);

  console.log(`save ${jsonArray.length} documents`);
  await saveDocuments(jsonArray, docRef.collection("item"));
  await saveFields(jsonArray, listId);
}

/**
 * Saves array of JSON objects into documents with IDs specified in one of the fields
 * of JSON object.
 *
 */
export async function saveDocuments(jsonArray: any[], colRef: CollectionReference) {
  let counter = 0;
  let batch = db.batch();

  for (let item of jsonArray) {
    batch.set(colRef.doc(), item);
    counter++;
    if (counter > FIRESTORE_WRITE_BATCH_SIZE) {
      console.log(`commit batch of ${counter} documents`);
      await batch.commit();
      batch = db.batch();
      counter = 0;
    }
  }
  console.log(`commit batch of ${counter} documents`);
  await batch.commit();
}

