import { db } from "./index";
import * as functions from "firebase-functions";
import { getStorage } from "firebase-admin/storage";

export const storageWriteList = functions
	.runWith({ timeoutSeconds: 120, memory: "4GB" })
	.https.onRequest(async (req, res) => {
		if (req.method == "GET") {
			var list: any = req.query.list;
		} else if (req.method == "POST") {
			var list = req.body.list;
		}
		if (!list) {
			res.status(400).send('Parameter "list" - name of list was not provided');
			return;
		}

		var document = await db
			.collection("list")
			.doc(list)
			.collection("item")
			.get();

		document.docs.map((d) => d.data());

		// Convert the document data to a JSON string

		var jsonString = JSON.stringify(document);
		console.log("sting creqated");

		var storage = getStorage();
		console.log("storage getted");

		try {
			await storage.bucket().file(`${list}.json`).save(jsonString);
		} catch (err) {
			console.log(err);
			return;
		}
		res.status(200).send("OK");
	});
