import * as functions from "firebase-functions";
import { db } from "./index";

//returns the list of items (in JSON) of the sanction list.
export const GetSanctionListEntities = functions.https.onRequest(
  async (req, res) => {

    // Checking if request method was POST or GET and if item was provided
    if(req.method == 'GET'){
      var list: any = req.query.list
    }else if(req.method == 'POST'){
      var list = req.body.list
    }
    if(!list){
      res.status(400).send('Parameter "list" - name of list was not provided')
      return
    }

    //Checking if user provided correct item
    const listDoc = await db.collection("list").doc(list).get()
    if (!listDoc.exists) {
      res.status(404).send("Item not found")
      return
    }

    //Sending response
    const responce = await db.collection("list").doc(list).collection('item').get()
    res.status(200).send(responce.docs.map((d) => d.data()))
  }
);
