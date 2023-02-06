import {
	CollectionReference,
	DocumentReference,
	FieldValue,
} from "firebase-admin/firestore";
import { db } from "./index";
import { createHash } from "node:crypto";

const FIRESTORE_WRITE_BATCH_SIZE = 450;

export function safeString(unsafe: string): string {
	return unsafe.replace(/\//gi, "_");
}

export async function saveFields(jsonArray: any[], listId: string) {
	let dict: any = {};
	for (let item of jsonArray) {
		for (let key in item) {
			if (key in dict) {
				dict[key]["count"] = dict[key]["count"] + 1;
			} else {
				dict[key] = {
					type: Array.isArray(item[key]) ? "array" : typeof item[key],
					count: 1,
				};
			}
		}
	}
	let colRef: CollectionReference = db
		.collection("list")
		.doc(listId)
		.collection("fields");
	let counter = 0;
	let batch = db.batch();
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
export async function saveList(
	jsonArray: any[],
	listId: string,
	fieldId: string
) {
	let docRef: DocumentReference = db.collection("list").doc(listId);
	let hash = createHash("md5").update(JSON.stringify(jsonArray)).digest("hex");
	console.dir(`fetched list document with hash: ${hash}`);
	let doc = await docRef.get();
	if (doc.exists && doc.data()?.["lastUpdateHash"] === hash) {
		console.log("hash not changed, skip update");
		return;
	}
	try {
		await db.runTransaction(async (t) => {
			await t.set(docRef, {
				lastUpdateTime: FieldValue.serverTimestamp(),
				lastUpdateHash: hash,
			});
			for (let item of jsonArray) {
				await t.set(docRef.collection("item").doc(), item);
			}
			let dict: any = {};
			for (let item of jsonArray) {
				for (let key in item) {
					if (key in dict) {
						dict[key]["count"] = dict[key]["count"] + 1;
					} else {
						dict[key] = {
							type: Array.isArray(item[key]) ? "array" : typeof item[key],
							count: 1,
						};
					}
				}
			}
			for (let key in dict) {
				await t.set(docRef.collection("fields").doc(key), dict[key]);
			}
		});
	} catch (e) {
		console.log("saveList failure:", e);
	}
}

/**
 * Saves array of JSON objects into documents with IDs specified in one of the fields
 * of JSON object.
 *
 */
export async function saveDocuments(
	jsonArray: any[],
	colRef: CollectionReference,
	fieldId: string
) {
	let counter = 0;
	let batch = db.batch();

	for (let item of jsonArray) {
		batch.set(colRef.doc(), item);
		counter++;
		if (counter > FIRESTORE_WRITE_BATCH_SIZE) {
			await batch.commit();
			batch = db.batch();
			counter = 0;
		}
	}
	await batch.commit();
}
