import { DocumentReference, FieldValue } from 'firebase-admin/firestore';
import { db } from './index';
import { gramCounterBool } from "./gram";


export async function indexItem(itmRef: DocumentReference, gramSize: number, target: string, id: string) {
  console.log(`index '${target}' as id: '${id}', gramSize: ${gramSize}`);

  var gramCounts = gramCounterBool(target, gramSize);

  await
    db
      .collection('index')
      .doc(id)
      .set({
        '$': itmRef,
        '#': target,
        '_': FieldValue.serverTimestamp(),
        ...gramCounts,
      });
}
