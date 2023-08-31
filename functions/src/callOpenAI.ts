import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';

const openAIKey = functions.config().openai.key;
admin.initializeApp();

const db = admin.firestore();

const openai = new OpenAI({
    apiKey: openAIKey
});

export const callOpenAI = functions.https.onCall(async (data, context) =>{
    const {messagesText, promptPrefix} = data;

    if (!messagesText || !promptPrefix){
        throw new functions.https.HttpsError('invalid-argument', 'Both messageText and PromptPrefix are required');
    }
    const docRef = db.collection('search').doc('name');

    await docRef.set({'error': admin.firestore.FieldValue.delete()}, {merge:true});

    try {
        const completion = await openai.completions.create({
            model: 'text-davinci-003',
            prompt: promptPrefix + messagesText,
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
                        'author': 'your-user-id'
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
});