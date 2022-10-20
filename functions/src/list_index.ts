// import axios from "axios";
import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { db } from ".";
import { safeString } from "./common";
import { gramCounterBool } from "./gram";
// import fetch from 'node-fetch';
// const XLSX = require("xlsx");
// import { dfat_gov_au__consolidated_list1 } from "./dfat_gov_au__consolidated_list";
const cors = require('cors')({ origin: true });

export const test = functions.runWith({timeoutSeconds:500}).https
.onRequest(async (request, res) => {
  
    res.send(JSON.stringify(request.body));
  });

export const index_list = functions.runWith({timeoutSeconds:540}).https
.onRequest(async (request, res) => {
  cors(request, res,async () => {

    const listId:string=request.query.list as string;
    const fieldId:string=request.query.field as string;

    console.log(`indexing list ${listId} by ${fieldId}`)
    const items=
    await db.collection("list").doc(listId).collection('item').get();

    let counter = 0;
    let batch = db.batch();


    for(let itm of items.docs) {
      
      batch.set(
      db
        .collection('index')
        .doc('dfat_gov_au__consolidated_list'+'|'+safeString(itm.data()[fieldId]))
        ,{
          'ref': itm.ref,
          'target': itm.data()[fieldId],
          't': FieldValue.serverTimestamp(),
          ...gramCounterBool(itm.data()[fieldId], 2),
        });
        counter++;

        if (counter > 490) {
          await batch.commit();
          batch = db.batch();
          counter = 0;
        }
    }
    await batch.commit();

    console.log(`indexed list ${listId} by ${fieldId}: ${items.size} entities`)

    res.send(`indexed list ${request.query.list}`);

  })
});


export const index_list2 = functions.runWith({timeoutSeconds:540}).https
.onRequest(async (request, res) => {
  cors(request, res,async () => {

    const listId:string=request.query.list as string;
    const fieldId:string=request.query.field as string;
    const settings:any=request.body;

    console.log(`indexing list ${listId} by ${fieldId} with settings ${JSON.stringify(settings)}`)
    const items=
    await db.collection("list").doc(listId).collection('item').get();

    let counter = 0;
    let batch = db.batch();


    for(let itm of items.docs) {

      console.log(`parse item ${JSON.stringify(itm.data())}`)

      for(let setting of settings) {
        if(setting.type==='array') {
          console.log(`parse array ${JSON.stringify(itm.data()[setting.field])}`)

          if(!Array.isArray(itm.data()[setting.field])) {
            console.log(`object as array: ${JSON.stringify(itm.data()[setting.field])}`)
            addToBatch(batch, listId, itm.ref, itm.data()[setting.field][setting.subField])

            counter++;
            if (counter > 490) {
              await batch.commit();
              batch = db.batch();
              counter = 0;
            }
          } else {
            for(let entry of itm.data()[setting.field]) {
              console.log(`array entry ${JSON.stringify(entry)}`)
              
              addToBatch(batch, listId, itm.ref, entry[setting.subField])

              counter++;
              if (counter > 490) {
                await batch.commit();
                batch = db.batch();
                counter = 0;
              }
            }
          }
        } else {
          addToBatch(batch, listId, itm.ref, itm.data()[setting.field])

          counter++;
          if (counter > 490) {
            await batch.commit();
            batch = db.batch();
            counter = 0;
          }
        }
        
          
        }
    }
    await batch.commit();

    console.log(`indexed list ${listId} by ${fieldId}: ${items.size} entities`)

    res.send(`indexed list ${request.query.list}`);

  })
});


function addToBatch(batch:any, listId:any, ref:any, name:string)
{
  batch.set(
    db
      .collection('index')
      .doc(listId+'|'+safeString(name))
      ,{
        'ref': ref,
        'target': name,
        't': FieldValue.serverTimestamp(),
        ...gramCounterBool(name, 2),
      });
}