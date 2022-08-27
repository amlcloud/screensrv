import * as admin from "firebase-admin";
import { db } from "./index";
import { gramCounterBool } from "./gram";
import { k_combinations } from "./screen";
import QuerySnapshot = admin.firestore.QuerySnapshot;
type Query = admin.firestore.Query;

export async function search(name: string, gramSize: number, pres: number): Promise<number> {
  console.log(`search for ${name}`);
  var gramCounts: { [key: string]: any; } = gramCounterBool(name.toLowerCase(), gramSize);
  var comArr = Object.keys(gramCounts).map((key, index) => key);
  var a = k_combinations(comArr, Math.round(Object.keys(gramCounts).length * pres));
  let res: QuerySnapshot[] = await Promise.all(
    a.map((ar: any) => {
      let query: Query = db.collection('index');
      for (let key in ar) {
        query = query.where(ar[key], '==', true);
      }
      return query.get();
    }));
  const resultsCount = res.map((snap) => snap.size).reduce((prev, snap) => prev + snap)
  // Calculate # of results from query search

  let screenData: any[] = [];
  let data: any = {
    resultsCount,
    screenData,
  }
  let r: QuerySnapshot[] = await Promise.all(a.map((ar: any) => {
    let query: Query = db.collection('index');
      for (let key in ar) {
        query = query.where(ar[key], '==', true);
      }
      return query.get();
  }));
  for (let i of r) {
    for (let f of i.docs) {
      const screeninfo = await db.collection('search').doc(name).collection('res').doc(f.id).get();
      data.screenData.push(screeninfo);
  }};
  return Promise.resolve(resultsCount);
}