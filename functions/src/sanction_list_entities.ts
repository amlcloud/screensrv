import * as functions from "firebase-functions";
import { db } from "./index";

//returns the list of items (in JSON) of the sanction list.
export const getSanctionsListEntities = functions
  .runWith({ timeoutSeconds: 60, memory: "1GB" })
  .https.onRequest(async (req, res) => {
    // Checking if request method was POST or GET and if item was provided
    if (req.method == "GET") {
      var list: any = req.query.list;
    } else if (req.method == "POST") {
      var list = req.body.list;
    }
    if (!list) {
      res.status(400).send('Parameter "list" - name of list was not provided');
      return;
    }

    //Checking if user provided correct item
    const listDoc = await db.collection("list").doc(list).get();
    if (!listDoc.exists) {
      res.status(404).send("Item not found");
      return;
    }

    //Removing empty string fields from maps and arrays
    function removeNullProperties(obj: { [x: string]: any }) {
      for (const propName in obj) {
        if (obj[propName] === null || obj[propName] === "") {
          delete obj[propName];
        } else if (typeof obj[propName] === "object") {
          removeNullProperties(obj[propName]);
        }
      }
      return obj;
    }

    //Removing empty arrays 
    function removeEmptyArrays(obj: { [x: string]: any }) {
      for (const propName in obj) {
        if (!obj[propName][0]) {
          delete obj[propName];
        }
      }
      return obj;
    }

    //Sending response
    var responce = await db.collection("list").doc(list).collection("item").limit(19000).get();
    console.log('data is prepared')

    try{
      res.status(200).send(responce.docs.map((d) =>removeEmptyArrays(removeNullProperties(d.data()))));
    }catch(err){
      res.status(500).send(err)
    }
  });
