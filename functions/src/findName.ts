import * as functions from "firebase-functions";
import { db } from "./index";


export const findName = functions.https.onRequest(async (req, res) => {

    if(req.method == 'GET'){
        var name: any = req.query.name
      }else if(req.method == 'POST'){
        var name = req.body.name
      }
      if(!name){
        res.status(400).send('Parameter "name" - name to search')
        return
      }
      
      let collection = db.collection('index')

      const snapshot = await collection.where('target', '==', name).get()
      
      if (snapshot.empty) {
        res.status(200).send('No matching documents.');
        return;
      }

      var array: any[] = []

      snapshot.docs.forEach(async (d) => {
        console.log(d.get('target'))
        console.log(d.get('ref'))
        let reference : string = d.get('ref')

        let item = await db.doc(reference).get()

        array.push(item.data())
    })


    res.status(200).send(array);

  });
  