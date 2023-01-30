import * as functions from "firebase-functions";
import { db } from "./index";

//returns the list of items (in JSON) of the sanction list.
export const GetSanctionsListItemEntity = functions.runWith({memory: "512MB"}).https.onRequest(
  async (req, res) => {

    // Checking if request method was POST or GET and if list and item was provided
    if(req.method == 'GET'){
      var list: any = req.query.list
      var item: any = req.query.item
    }else if(req.method == 'POST'){
      var list = req.body.list
      var item = req.body.item
    }
    if(!list){
      res.status(400).send('Parameter "list" - name of list was not provided')
      return
    }else if (!item){
      res.status(400).send('Parameter "item" - name of item was not provided')
      return
    }

    //Checking if user provided correct list and item
    const listDoc = await db.collection("list").doc(list).get()
    if (!listDoc.exists) {
      res.status(404).send("List not found")
      return
    }
    const itemDoc = await db.collection("list").doc(list).collection('item').doc(item).get()
    if(!itemDoc.exists) {
        res.status(404).send('No such item in this list')
        return
    }

    //Sending response
    res.status(200).send(itemDoc.data())
  }
);
