

// onCaseInputCreate creates a document inside 'input' collection when a user types into the input field on CASES page

import * as functions from "firebase-functions";
import OpenAI from 'openai';
import * as admin from 'firebase-admin';

const openAIKey = functions.config().openai.key;



const db = admin.firestore()
const openai = new OpenAI({ apiKey: openAIKey})
export const onCaseInputWrite = functions.firestore
	.document("user/{userId}/case/{caseId}/input/{inputId}")
	.onWrite(async (change, context) => {
		
		// Prompt for OpenAI Call
		 const promptPrefix = `Based on the text provided below, return JSON with the following fields:
		 {
		   "name": "The full name of the person",
		   "data_of_birth": "The date of birth of the person".,
		   "place_of_birth": "The place of birth of the person.",
		   "info": "Any additional information about the person."
		 }
  
		 Return JSON text only, no additional comments.
  
		 Text: `
		
		 // docRef -> user/USER_ID/search/NAME
		const docRef = db.collection('search').doc('name')
		const oldData = change.before.data()
		const newData = change.after.data()

		// Triggered on UI Input creation/updation in the text field
		const newInput = newData?.text;
		const oldInput = oldData?.text;

		// If new input is different that old input
		 if(newInput !== oldInput){

				 try {
				 	const completion = await openai.completions.create({
				 		model: 'text-davinci-003',
				 		prompt: promptPrefix + newInput,
				 		max_tokens: 200,
				 		temperature: 0.6
				 	});
			
				 	if (!completion || !completion.choices || completion.choices.length === 0) {
				 		await docRef.update({ 'error': 'No completion choices returned' });
				 		return;
				 	}
			
				 	let text = completion.choices[0].text;
				 	const jsonStartIndex = text.indexOf('{');
				 	const jsonEndIndex = text.lastIndexOf('}');
				 	text = text.substring(jsonStartIndex, jsonEndIndex + 1);
			
				 	try {
				 		const jsonContent = JSON.parse(text);
				 		await docRef.update({
				 			'content': jsonContent
				 		});
			
				 		if (jsonContent['name'] != null) {
				 			const searchDoc = await db.collection('search').doc(jsonContent['name']).get();
				 			if (!searchDoc.exists) {
				 				await db.collection('search').doc(jsonContent['name']).set({
				 					'target': jsonContent['name'],
				 					'timeCreated': admin.firestore.FieldValue.serverTimestamp(),
				 					'author': context.params.userId
				 				});
				 				await docRef.update({ 'target': jsonContent['name'] });
				 			}
				 		}
				 	} catch (e:any) {
				 		await docRef.update({ 'error': e.toString() + '\n' + text });
				 	}
				 } catch (err) {
				 	console.error(err);
				 }
		 	 
		 }

})
