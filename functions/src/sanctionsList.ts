import * as functions from "firebase-functions";
import { db } from "./index";

// returns the list of JSON objects containing meta info about all sanction lists available on the system.

export const getSanctionsList = functions.https.onRequest(async (req, res) => {

    const listDoc =  db.collection('list');

  
    const responce = await listDoc.get()
    res.status(200).send(responce.docs.map((d) => d.data()));
  
  });