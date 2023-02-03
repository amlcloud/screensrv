import { db } from "./index";
import { storage} from 'firebase-admin';
import * as functions from "firebase-functions";


export const StorageWriteList = functions.runWith({timeoutSeconds: 60, memory: "1GB"}).https.onRequest(async (req,res) => {

    if (req.method == "GET") {
        var list: any = req.query.list;
      } else if (req.method == "POST") {
        var list = req.body.list;
      }
      if (!list) {
        res.status(400).send('Parameter "list" - name of list was not provided');
        return;
      }

        var document = await db.collection('list').doc(list).collection('item').get();

        document.docs.map((d) => d.data());


    // Convert the document data to a JSON string

    try{
        var jsonString = JSON.stringify(document);

        var bucket = storage().bucket();

        var file = bucket.file(`${list}.json`);
        try{
        file.createWriteStream({
            metadata: {
                contentType: 'application/json',
            },
            }).end(jsonString);
        }catch(err){
            res.status(500).send(err)
            return
        }
        res.status(200).send('Ok')
    }catch(err){
        res.status(500).send(err)
    }
})