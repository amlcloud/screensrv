import { DocumentData } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { db } from "./index";


export const ScreenName =  functions.https.onRequest( async (req,res) => {
    //getting variables from request and checking them 
    if(req.method == 'GET'){
        var name: any = req.query.name as string
        var precision: any = req.query.precision
    }else if(req.method == 'POST'){
        var name: any = req.body.name as string
        var precision = req.body.precision
    }
    if(!name){
        res.status(400).send('Parameter "name"  was not provided')
        return
    }else if (!precision || precision <  0.9 || precision > 1){
        res.status(400).send('Parameter 0.9 < "precison" < 1')
        return
    }
    console.log(`searching for ${name} with ${precision} precision`)

    let target = '-'+name.toLowerCase().replace(' ','')+'-'
    let chunks : string[] = []
    for(let i = 0; i < target.length - 1; i++){
        chunks.push(target[i] + target[i+1])
    }
    let target_points : number = Math.floor(chunks.length * precision);
    console.log('data is ready for search, ' + `string: ${target} ,elements: ${chunks} , ${chunks.length} chunks ,points: ${target_points}`)



    //Function takes array of strings and  returns all combinations of given number amount of strings from this array 
    // so if ['a','b','c'], 2 provided, it will return [['a','b'],['a','c'],['c','b']]
    function combinations(array: string[], num: number) {
        let result: string[][] = [];

        function helper(start: number, combination: string[]) {
          if (combination.length === num) {
            result.push(combination);
            return;
          }

          for (let i = start; i < array.length; i++) {
            helper(i + 1, [...combination, array[i]]);
          }
        }
      
        helper(0, []);
        return result;
      }

    let target_combinations : string[][] = combinations(chunks, target_points)
    console.log('combinations created: ' + target_combinations.length)


    let index = db.collection('index')
    let results: FirebaseFirestore.DocumentData[] = []; 



    let promises: Promise<void>[] = []

    //Function takes array of combinations and data and checks for simular words  and pushes them into array
    async function getResults(combs : string[], ref: FirebaseFirestore.Query<DocumentData>){
        return new Promise<void>(async (resolve) => {
            console.log(`searching ${combs}`)
            let query = ref.where(combs[0], '==', true);
            let snapshot= await query.get()
            if (snapshot.empty) {
                console.log(combs[0] + 'empty(')
                resolve()
            } 
            else{
                combs.shift()
                if(combs.length === 0){
                    console.log('result found')
                    results.push(snapshot.docs.map((d) => d.data()))
                    console.log('result pushed')
                    resolve()
                }
                console.log(combs +' ||' + combs.length )
                await getResults(combs,query)
                resolve()
            }
        })
    }

    
    console.log('exequting queries')
    target_combinations.map(async (arr) => {
        promises.push(getResults(arr, index))
    })

    await Promise.all(promises)
    res.status(200).send([...new Set(results)])
})

