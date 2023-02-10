import { DocumentData, FieldPath } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { db } from "./index";

export const ScreenName = functions.https.onRequest(async (req, res) => {
	//getting variables from request and checking them
	if (req.method == "GET") {
		var name: any = req.query.name as string;
		var precision: any = req.query.precision;
	} else if (req.method == "POST") {
		var name: any = req.body.name as string;
		var precision = req.body.precision;
	}
	if (!name) {
		res.status(400).send('Parameter "name"  was not provided');
		return;
	} else if (!precision || precision < 0.9 || precision > 1) {
		res.status(400).send('Parameter 0.9 < "precison" < 1');
		return;
	}
	console.log(`preparing search for ${name} with ${precision} precision`);

	// Preparing data for search
	let target = "-" + name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") + "-";
	let chunks: string[] = [];
	for (let i = 0; i < target.length - 1; i++) {
		chunks.push(target[i] + target[i + 1]);
	}

	// target_points is points which determine how many chunks will be used for search according to string lenght and precision
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

	/*
	This function takes array with chunks and ref to collection, and returns querry of type:
		ref.where(chunk[0] == true).where(chunk[1] == true).etc
	 */
	function QueryPrep(
		combs: string[],
		ref: FirebaseFirestore.Query<DocumentData>
	): any {
		if (combs.length < 1) {
			return ref;
		} else {
			let query = ref.where(combs.shift() as unknown as FieldPath, "==", true);
			return QueryPrep(combs, query);
		}
	}

	//Creating array of promises for getresult function
	let promises: Promise<void>[] = [];
	//Function takes array of combinations and data and checks for simular words  and pushes them into array
	async function getResults(
		combs: string[],
		ref: FirebaseFirestore.Query<DocumentData>
	) {
		return new Promise<void>(async (resolve) => {
			console.log(`searching ${combs}`);
			let snapshot: any = QueryPrep(combs, ref);
			snapshot = await snapshot.get();
			if (snapshot.empty) {
				console.log(combs[0] + "empty(");
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

	console.log("exequting queries");
	target_combinations.map(async (arr) => {
		promises.push(getResults(arr, index));
	});
	await Promise.all(promises);

	// Deleting duplicates from results
	results = results.filter(
		(value, index, self) => index === self.findIndex((t) => t.id === value.id)
	);

	// Gathering and sending data
	let responcePromises = results.map(async (obj) => await obj.ref.get());
	let docs = await Promise.all(responcePromises);

	res.status(200).send(docs.map((d) => d.data()));
});
