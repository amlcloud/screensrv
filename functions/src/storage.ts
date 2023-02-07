import { db,storage } from "./index";
import * as functions from "firebase-functions";
import {uploadString,ref, StorageReference} from 'firebase/storage' 



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

        var storageRef : StorageReference = ref(storage, 'lists');

        const metadata = {
          contentType: 'application/json',
        }
        try{
        await uploadString(ref(storageRef, `${list}.json`),jsonString,'base64',metadata).then(
          () => res.status(200).send('OK'))
        }catch(err){
            res.status(500).send(err)
            return
        }
    }catch(err){
        res.status(500).send(err)
    }
})