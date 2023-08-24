import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const onCaseSearchResCreate = functions.firestore
  .document("user/{userId}/case/{caseId}/search/{searchId}/res/{resId}")
  .onCreate(async (snapshot, context) => {
    try {
      const { userId, caseId } = context.params;
      const searchResDoc = snapshot;
      const messagesRef = searchResDoc.ref.collection("message");

      const messageSize = (await messagesRef.get()).size;

      if (messageSize === 0) {
        await messagesRef.add({
          role: "system",
          timeCreated: admin.firestore.FieldValue.serverTimestamp(),
          content:
            "You are a sanctions investigator. You need to compare the information about the customer with the information in the sanction document and decide whether the customer is the same person as the person in the sanction document.",
        });

        const sanctionDoc = await (
          searchResDoc.data()["ref"] as admin.firestore.DocumentReference
        ).get();
        const caseDoc = await admin
          .firestore()
          .doc(`user/${userId}/case/${caseId}`)
          .get();
        const prompt = `Here is my customer information: ${
          caseDoc.data()?.content
        }\n\nHere is the information in the sanction document: ${sanctionDoc.data()}`;

        await messagesRef.add({
          role: "user",
          timeCreated: admin.firestore.FieldValue.serverTimestamp(),
          content: prompt,
        });
      }
    } catch (error) {
      console.error("Error in onCaseSearchCreate:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to start case investigation"
      );
    }
  });
