import * as functions from "firebase-functions";
import { db } from "./index";

export const SanctionsList = functions.https.onRequest(async (req, res) => {

    const listDoc =  db.collection('list');

  
    const responce = await listDoc.get()
    res.status(200).send(responce.docs.map((d) => d.data()));
  
  });