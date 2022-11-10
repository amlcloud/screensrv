import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { DocumentSnapshot, FieldValue } from "firebase-admin/firestore";
import { db } from "./index";
import { gramCounterBool } from "./gram";
import QuerySnapshot = admin.firestore.QuerySnapshot;
type Query = admin.firestore.Query;

export const onSearchCreate = functions.firestore.document
  ('user/{userId}/search/{searchId}').onCreate(
    async (document: DocumentSnapshot, context) => {

      await _screen(document.id, 2, 0.9);

    });


export const screen = functions.runWith({timeoutSeconds:540}).https
.onRequest(async (request, res) => {
  const searchTarget:string=request.query.target as string;
  const precision:number=parseFloat(request.query.precision as string);

  const resultDoc=await db.collection('search').doc(searchTarget).get();

  if(resultDoc.exists) {
    res.send(resultDoc.data());
    return;
  }
  
  await _screen(searchTarget, 2, precision===undefined?0.9:precision);
  if(resultDoc.exists) {
    res.send(resultDoc.data());
    return;
  } else res.send('something went wrong');
});


export async function _screen(name: string, gramSize: number, pres: number): Promise<number> {
  console.log(`search for ${name}`);


  var gramCounts: { [key: string]: any; } = gramCounterBool(name.toLowerCase(), gramSize);

  // Object.keys(myObject).map(function(key, index) {
  //   myObject[key] *= 2;
  // });

  // var f = [];
  // function factorial (n) {
  //   if (n === 0 || n === 1)
  //     return 1;
  //   if (f[n] > 0)
  //     return f[n];
  //   return f[n] = factorial(n-1) * n;
  // }

  //const pres=0.90;
  const combinationsArraySize=Math.round(Object.keys(gramCounts).length * pres);
  console.log(`grams are: ${Object.keys(gramCounts).map((key, index) => key)} (${Object.keys(gramCounts).length}),\\\
   precision: ${pres}, combinations array size: ${combinationsArraySize}`);
  
   

  //console.log(`combinations: n!/(n-r)! ${factorial(Object.keys(gramCounts).length)/ factorial(Object.keys(gramCounts).length-Math.round(Object.keys(gramCounts).length*pres))}`);
  //console.log(`combinations: n!/(n-r)! ${factorial(10)/ factorial(10-9)}`);

  var comArr = Object.keys(gramCounts).map((key, index) => key);
  console.log(`comb arr: ${comArr}`);
  var a = k_combinations(comArr, combinationsArraySize);

  console.log(`combine entries: (${a.length} total)`);
  {
    let count = 0;
    for (let ar of a) {
      //console.log(`${gram}, ${'=='}, ${gramCounts[gram]}`);
      console.log(`${count}: ${ar}`);
      count++;
    }
  }
  //console.log(document.ref.parent.parent!.collection('index').path);
  let res: QuerySnapshot[] = await Promise.all(
    a.map((ar: any) => {

      let query: Query = db.collection('index');

      // console.log(`${ar.map()}`);
      for (let key in ar) {
        query = query.where(ar[key], '==', true);
      }
      return query.get();
      // .then((v)=>{
      //   if(!v.empty)
      //     console.log(`value: ${v.empty?'':v.docs.map((d)=>{d.data()['$name']})}`);
      // });
    }));

  console.log(res.map((snap) => snap.size).toString());

  const resultsCount = res.map((snap) => snap.size).reduce((prev, snap) => prev + snap)

  //:QuerySnapshot
  //let foundQS;
  await db.collection('search').doc(name)
    .set({
      'resultsCount': resultsCount,
      't': FieldValue.serverTimestamp()
    })

  for (let r of res) {
    //console.log(`${r.id} returned size: ${r.size}`);
    for (let f of r.docs) {

      console.log(`found: ${f.data()['target']} levenshtein: ${matchLevenshtein(f.data()['target'], name)}, gram: ${matchGram(f.data()['target'], name, 2)}`);

      // let existingSearchDoc=searchQS.docs.find((d) => d.data()['$']===f.data()['$'] );
      // if(existingSearchDoc===undefined) 
      {
        await db.collection('search').doc(name).collection('res').doc(f.id).set({
          "target": f.data()['target'],
          "ref": f.data()['ref'],
          "levScore": matchLevenshtein(f.data()['target'], name),
          "gramScore": matchGram(f.data()['target'], name, 2)
        });
      }


    }
    // if(r.size>0) {
    //   foundQS=r;
    //   break;
    // }
  }
  return Promise.resolve(resultsCount);
}

/**
 * K-combinations
 * 
 * Get k-sized combinations of elements in a set.
 * 
 * Usage:
 *   k_combinations(set, k)
 * 
 * Parameters:
 *   set: Array of objects of any type. They are treated as unique.
 *   k: size of combinations to search for.
 * 
 * Return:
 *   Array of found combinations, size of a combination is k.
 * 
 * Examples:
 * 
 *   k_combinations([1, 2, 3], 1)
 *   -> [[1], [2], [3]]
 * 
 *   k_combinations([1, 2, 3], 2)
 *   -> [[1,2], [1,3], [2, 3]
 * 
 *   k_combinations([1, 2, 3], 3)
 *   -> [[1, 2, 3]]
 * 
 *   k_combinations([1, 2, 3], 4)
 *   -> []
 * 
 *   k_combinations([1, 2, 3], 0)
 *   -> []
 * 
 *   k_combinations([1, 2, 3], -1)
 *   -> []
 * 
 *   k_combinations([], 0)
 *   -> []
 */
export function k_combinations(set: any, k: any): any {
  var i, j, combs, head, tailcombs;

  // There is no way to take e.g. sets of 5 elements from
  // a set of 4.
  if (k > set.length || k <= 0) {
    return [];
  }

  // K-sized set has only one K-sized subset.
  if (k === set.length) {
    return [set];
  }

  // There is N 1-sized subsets in a N-sized set.
  if (k === 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  // Assert {1 < k < set.length}

  // Algorithm description:
  // To get k-combinations of a set, we want to join each element
  // with all (k-1)-combinations of the other elements. The set of
  // these k-sized sets would be the desired result. However, as we
  // represent sets with lists, we need to take duplicates into
  // account. To avoid producing duplicates and also unnecessary
  // computing, we use the following approach: each element i
  // divides the list into three: the preceding elements, the
  // current element i, and the subsequent elements. For the first
  // element, the list of preceding elements is empty. For element i,
  // we compute the (k-1)-computations of the subsequent elements,
  // join each with the element i, and store the joined to the set of
  // computed k-combinations. We do not need to take the preceding
  // elements into account, because they have already been the i:th
  // element so they are already computed and stored. When the length
  // of the subsequent list drops below (k-1), we cannot find any
  // (k-1)-combs, hence the upper limit for the iteration:
  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    // head is a list that includes only our current element.
    head = set.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
}

function matchLevenshtein(inOne: string, inTwo: string) {
  const one = inOne.toLowerCase(), two = inTwo.toLowerCase();
  return _distance(one, two)
}

function matchGram(inOne: string, inTwo: string, gramSize: number) {

  const one = inOne.toLowerCase(), two = inTwo.toLowerCase();

  //  console.log(`${one} vs ${two} levenshtein: ${_distance(one, two)} (${levenshtein(one, two)}) `);

  var gramCountsOne: { [key: string]: any; } = gramCounterBool(one, gramSize);
  var gramCountsTwo: { [key: string]: any; } = gramCounterBool(two, gramSize);
  // console.log(`one grams: ${Object.keys(gramCountsOne).map((key, index)=>key)}`);
  // console.log(`two grams: ${Object.keys(gramCountsTwo).map((key, index)=>key)}`);


  //var combinedGram: string[] = Object(gramCountsOne).keys;
  //combinedGram = Object(gramCountsTwo).keys.filter((d)=>gramCountsOne[d]!==undefined)
  //+Object(gramCountsTwo).keys;

  // combinedGram = combinedGram.concat(
  //   gramCountsTwo.filter((item) => Object(gramCountsOne).keys.indexOf(item) < 0)
  // );


  // for(var i=0; i<combinedGram.length; i++) {
  //   let countLeft=gramCountsOne[combinedGram[i]]===undefined?0:gramCountsOne[combinedGram[i]];
  //   let countRight=gramCountsOne[combinedGram[i]]===undefined?0:gramCountsOne[combinedGram[i]];
  //}

  let dotProduct = 0;
  for (let gramCount in gramCountsOne) {
    if (gramCountsTwo[gramCount] !== undefined) {
      //console.log(`add ${gramCountsTwo[gramCount]}*${gramCountsOne[gramCount]}`);
      dotProduct += gramCountsTwo[gramCount] * gramCountsOne[gramCount];
    }
  }
  //console.log(`dotProduct: ${dotProduct}`);

  let oneLen;
  {
    let powAgg = 0;
    for (let gramCount in gramCountsOne) {
      powAgg += gramCountsOne[gramCount] * gramCountsOne[gramCount];
    }
    oneLen = Math.sqrt(powAgg);
    //console.log(`one vector magnitude: ${oneLen}`);
  }

  let twoLen;
  {
    let powAgg = 0;
    for (let gramCount in gramCountsTwo) {
      powAgg += gramCountsTwo[gramCount] * gramCountsTwo[gramCount];
    }
    twoLen = Math.sqrt(powAgg);
    //console.log(`two vector magnitude: ${twoLen}`);
  }

  //console.log(`magnitude: ${dotProduct/(oneLen*twoLen)}`);
  return dotProduct / (oneLen * twoLen);
}


const _distance = (str1 = '', str2 = '') => {
  const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
  for (let i = 0; i <= str1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= str2.length; j += 1) {
    track[j][0] = j;
  }
  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator, // substitution
      );
    }
  }
  return track[str2.length][str1.length];
}

