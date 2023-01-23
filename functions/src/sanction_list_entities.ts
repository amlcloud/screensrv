import * as functions from "firebase-functions";
import { db } from "./index";

//returns the list of items (in JSON) of the sanction list.
export const GetSanctionListEntities = functions.https.onRequest(
  async (req, res) => {
    const listDoc = await db.collection("list").doc(req.url.slice(1)).get();

    if (!listDoc.exists) {
      res.status(404).send("List not found");
      return;
    }

    const responce = await db.collection("list").doc(req.url.slice(1)).collection('item').get()
    res.status(200).send(responce.docs.map((d) => d.data()));
  }
);
