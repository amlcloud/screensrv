// import axios from "axios";
import { FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { db } from ".";
import { safeString } from "./common";
import { gramCounterBool } from "./gram";
const cors = require('cors')({ origin: true });

export const test = functions.runWith({timeoutSeconds:500}).https
.onRequest(async (request, res) => {
  
    console.log(`This is a test parameter: ${request.query.test_parameter as string}`)
    
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
        .doc(listId+'|'+safeString(itm.data()[fieldId]))
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
    let indices = await db.collection('index').where('listId', '==', listId).get();
    indices.forEach(index => {
      index.ref.delete();
    });
    let counter = 0;
    let batch = db.batch();
    const reference = await db.collection('list').doc(listId);
    const indexConfigs = await reference.collection('indexConfigs').get();
    const items = await reference.collection('item').get();
    for (let indexConfig of indexConfigs.docs) {
      let entityIndexFields = await indexConfig.ref.collection('entityIndexFields').get();
      var valid = true;
      let fields = [];
      for (let entityIndexField of entityIndexFields.docs) {
        let data = entityIndexField.data();
        if (!data.valid) {
          valid = false;
          break;
        }
        fields.push(data.value);
      }
      if (valid && fields.length > 0) {
        let type = indexConfig.data().type;
        for (let item of items.docs) {
          if (type === 'Single field') {
            let value = item.data()[fields[0]];
            if (!Array.isArray(value)) {
              addToBatch(batch, listId, item.ref, value);
              counter++;
              if (counter > 490) {
                await batch.commit();
                batch = db.batch();
                counter = 0;
              }
            }
          } else if (type === 'Multiple fields') {
            var containsArray = false;
            var name = '';
            for (let field of fields) {
              let value = item.data()[field];
              if (Array.isArray(value)) {
                containsArray = true;
                break;
              }
              name += (name.length > 0 ? ' ' : '') + value;
            }
            if (!containsArray) {
              addToBatch(batch, listId, item.ref, name);
              counter++;
              if (counter > 490) {
                await batch.commit();
                batch = db.batch();
                counter = 0;
              }
            }
          } else if (type === 'Array of values') {
            let values = item.data()[fields[0]];
            if (Array.isArray(values)) {
              for (let value of values) {
                addToBatch(batch, listId, item.ref, value);
                counter++;
                if (counter > 490) {
                  await batch.commit();
                  batch = db.batch();
                  counter = 0;
                }
              }
            }
          }
        }
      }
    }
    await batch.commit();
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
        'listId': listId,
        'target': name,
        't': FieldValue.serverTimestamp(),
        ...gramCounterBool(name, 2),
      });
}