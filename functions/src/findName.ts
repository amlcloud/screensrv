import * as functions from "firebase-functions";
import { db } from "./index";


export const findName = functions.https.onRequest(async (req, res) => {

    //Taking POST or GET request and checking for parameters provided
    if(req.method == 'GET'){
        var name: any = req.query.name
      }else if(req.method == 'POST'){
        var name = req.body.name
      }
      if(!name){
        res.status(400).send('Parameter "name" - name to search')
        return
      }

      // Exequting the query and checking for result
      let collection = db.collection('index')
      const snapshot = await collection.where('target', '==', name).get()
      if (snapshot.empty) {
        res.status(200).send('No matching documents.');
        return;
      }

      //Retrive data from all references and send them in responce
      Promise.all(snapshot.docs.map(async (d) => {

        let reference = d.get('ref');

        let item = await reference.get();
        
        return item.data();
      })).then(results => {
        res.status(200).send(results);
      });
  });