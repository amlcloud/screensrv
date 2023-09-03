
// onCaseInputCreate creates a document inside 'input' collection when a user types into the input field on CASES page
import axios from "axios";
import * as functions from "firebase-functions";

const openAIKey = functions.config().openai.key;

const prepareOpenAIHeaders = async () =>{
     return{
         'Authorization': `Bearer ${openAIKey}`,
         'Content-Type': 'application/json',
     };
 };
export const onCaseInputWrite = functions.firestore
	.document("user/{userId}/case/{caseId}/input/{inputId}")
	.onWrite(async (change, context) => {
		
		console.log(functions.config())
		
		const oldData = change.before.data()
		const newData = change.after.data()

		// Triggered on UI Input creation/updation in the text field
		const newInput = newData?.text;
		const oldInput = oldData?.text;

		// If new input is different that old input
		 if(newInput !== oldInput){
		 	console.log(`OLD: ${oldInput},  NEW: ${newInput}`)
			
		 	// Headers for Axios request
		 	const headers = await prepareOpenAIHeaders();

			// Request Body for Axios request
		 	const body = {
		 		"model": "gpt-3.5-turbo",
		 		"messages": [{"role": "user", "content": newInput}],
		 		"max_tokens": 500,
		 		"temperature": 0.6
		 	};
		 	console.log(body)
		 	 try {
		 	 	// Axios Post request
		 	 	const res = await axios.post('https://api.openai.com/v1/chat/completions', body, {headers: headers})
		 	 	if(res.status !== 200){
		 	 		console.error(res.data);
		 	 		throw new functions.https.HttpsError('internal', 'Failed to call OpenAI API');
		 	 	}
				
		 	 	console.log(res.data) // Replace with firestore storage
		 	 } catch (err){
		 	 	console.log("ERROR") // Replace with user friendly error message
		 	 }
		 }

})
