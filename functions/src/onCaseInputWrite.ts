
// onCaseInputCreate creates a document inside 'input' collection when a user types into the input field on CASES page

import * as functions from "firebase-functions";
import OpenAI from 'openai';


const openAIKey = functions.config().openai.key;

const openai = new OpenAI({ apiKey: openAIKey})
export const onCaseInputWrite = functions.firestore
	.document("user/{userId}/case/{caseId}/input/{inputId}")
	.onWrite(async (change, context) => {
		
		const oldData = change.before.data()
		const newData = change.after.data()

		// Triggered on UI Input creation/updation in the text field
		const newInput = newData?.text;
		const oldInput = oldData?.text;

		// If new input is different that old input
		 if(newInput !== oldInput){
		 	console.log(`OLD: ${oldInput},  NEW: ${newInput}`)

		 	 try {
		 	 	// Open AI Call
				const completion = await openai.completions.create({
					model: "gpt-4",
		 			prompt: newInput,
		 			max_tokens: 500,
		 			temperature: 0.6
				})
		 	 
		
		 	 	if(!completion || !completion.choices){
		 	 		console.error("Failed to call OpenAI");
		 	 		throw new functions.https.HttpsError('internal', 'Failed to call OpenAI API');
		 	 	}
				// Add firestore storage logic
		 	 	console.log(completion?.choices[0]?.text) 
		 	 } catch (err){
		 	 	console.error(err) // Replace with user friendly error message
		 	 }
		 }

})
