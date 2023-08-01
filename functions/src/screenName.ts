import { DocumentData, FieldPath } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { db } from "./index";

//Minimal lenght of string provided
const MIN_LENGHT = 7;

//Reusable function for fetching screening results
export async function getScreenResults(name:string, precision: number) {
	//getting variables from request and checking them
	if(!name || name.length <MIN_LENGHT){
		throw new Error('Parameter "name" -min 7 characters');
	}
	if(!precision){
		throw new Error ('Parameter precision was not provided');
	}

	console.log(`preparing search for ${ name } with ${ precision } precision`);

	//Preparing data for search
	let target = "-" + name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") + "-";
	let chunks: string[] = [];
	for (let i = 0; i < target.length - 1; i++) {
		chunks.push(target[i] + target[i + 1]);
	}

	//target_points is points which determine how many chunks will be used for search according to string length and precision
	let target_points: number = Math.floor(chunks.length * precision);
	console.log(
		"data is ready for search, " +
		`string: ${target} ,elements: ${chunks} , ${chunks.length} chunks ,points: ${target_points}`
	);

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
	let target_combinations: string[][] = combinations(chunks, target_points);
	console.log("combinations created: " + target_combinations.length);

	//Path to index collection
	let index = db.collection("index");

	//Creating new object for search results to compare them by id and exclude duplicates
	interface Results {
		id: any;
		ref: FirebaseFirestore.DocumentReference;
	}
	let results: Results[] = [];

	function QueryPrep(
		combs:string[],
		ref: FirebaseFirestore.Query<DocumentData>
	): any {
		if(combs.length <1){
			return ref;
		}else{
			let query = ref.where(combs.shift() as unknown as FieldPath, "==", true);
			return QueryPrep(combs, query);
		}
	}

	//Creating array of promises for getResult function
	let promises: Promise<void>[] = [];
	//Function takes array of combinations and data and checks for similar words and pushes them into array
	async function getResults(
		combs: string[],
		ref: FirebaseFirestore.Query<DocumentData>
	) {
		return new Promise<void>(async (resolve) => {
			console.log(`searching ${combs}`);
			let snapshot: any = QueryPrep(combs, ref);
			snapshot = await snapshot.get();
			if (snapshot.empty) {
				console.log("empty");
				resolve();
			} else {
				if (snapshot.docs.length < 2) {
					results.push({
						id: snapshot.docs[0].id,
						ref: snapshot.docs[0].get("ref"),
					});
				} else {
					snapshot.docs.forEach(() => {
						results.push({
							id: snapshot.docs[0].id,
							ref: snapshot.docs[0].get("ref"),
						});
					});
				}
				console.log("result pushed");
				resolve();
			}
		});
	}

	console.log("executing queries");
	target_combinations.map(async (arr) => {
		promises.push(getResults(arr, index));
	});
	await Promise.all(promises);

	// Deleting duplicates from results
	results = results.filter(
		(value, index, self) => index === self.findIndex((t) => t.id === value.id)
	);

	// Gathering and sending data
	let responsePromises = results.map(async (obj) => await obj.ref.get());
	let docs = await Promise.all(responsePromises);

	return docs.map((d) => d.data());

}

export const ScreenName = functions.https.onRequest(async (req, res) => {
	let name: string;
	let precision: number;

	if (req.method == "GET") {
		name = req.query.name as string;
		precision = parseFloat(req.query.precision as string);

		try {
			const result = await getScreenResults(name, precision);
			res.status(200).send(result);
		} catch (err) {
			if (err instanceof Error) {
				res.status(400).send(err.message);
			} else {
				res.status(400).send("An error occurred");
			}
		}
	} else if (req.method == "POST") {
		name = req.body.name as string;
		precision = parseFloat(req.body.precision as string);

		try {
			const result = await getScreenResults(name, precision);
			res.status(200).send(result);
		} catch (err) {
			if (err instanceof Error) {
				res.status(400).send(err.message);
			} else {
				res.status(400).send("An error occurred");
			}
		}
	} else {
		res.status(405).send("Method not allowed");
	}
});
