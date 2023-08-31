import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from "openai";

const openAIKey = functions.config().openai.key;
const openai = new OpenAI({
  apiKey: openAIKey,
});

// const prepareOpenAIHeaders = async () =>{
//     return{
//         'Authorization': `Bearer ${openAIKey}`,
//         'Content-Type': 'application/json',
//     };
// };

export const onMessageCreate = functions.firestore
  .document(
    "user/{userId}/case/{caseId}/search/{searchId}/res/{resId}/message/{messageId}"
  )
  .onCreate(async (snapshot, context) => {
    const { userId, caseId, searchId, resId } = context.params;
    const messagesRef = admin
      .firestore()
      .collection(
        `user/${userId}/case/${caseId}/search/${searchId}/res/${resId}/message`
      );
    // const messagesSnap = await messagesRef.orderBy("timeCreated").get();
    // const messages = messagesSnap.docs.map(doc =>{
    //     const data = doc.data();
    //     delete data.timeCompleted;
    //     return data;
    // });
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "assistant", content: "messages" }],
        max_tokens: 500,
        temperature: 0.6,
      });

      const message = completion.choices[0]?.message;
      if (!message) {
        console.error("No answer from assistant");
        throw new functions.https.HttpsError(
          "not-found",
          "No answer from assistant"
        );
      }

      await messagesRef.add({
        role: "assistant",
        timeCreated: admin.firestore.FieldValue.serverTimestamp(),
        content: message.content,
      });
    } catch (err) {
      // Save the error to the document
      await messagesRef.add({
        role: "assistant",
        timeCreated: admin.firestore.FieldValue.serverTimestamp(),
        error: (err as Error).message || "Failed to process message", // Save the error message
      });
    }
  });
