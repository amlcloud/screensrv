
// onCaseInputCreate creates a document inside 'input' collection when a user types into the input field on CASES page
import * as functions from "firebase-functions";

export const onCaseInputWrite = functions.firestore
	.document("user/{userId}/case/{caseId}/input/{inputId}")
	.onWrite(async (change, context) => {
	//let userId = document.ref.path.split("/")[1]
		const oldData = change.before.data()
		const newData = change.after.data()

		// Triggered on UI Input creation/updation in the text field
		const newInput = newData?.text;
		const oldInput = oldData?.text;

		if(newInput !== oldInput){
			console.log(`OLD: ${oldInput},  NEW: ${newInput}`)
		}

})
