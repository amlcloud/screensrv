import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const openAIKey = functions.config().openai.key;
admin.initializeApp();

const db = admin.firestore();

const prepareOpenAIHeaders = async () =>{
    return {
        'Authorization': `Bearer ${openAIKey} `,
        'Content-Type': 'application/json',
    };
};

export const callOpenAI = functions.https.onCall(async (data, context) =>{
    const {messagesText, promptPrefix} = data;

    if (!messagesText || !promptPrefix){
        throw new functions.https.HttpsError('invalid-argument', 'Both messageText and PromptPrefix are required');
    }
    const docRef = db.collection('search').doc('name');

    await docRef.set({'error': admin.firestore.FieldValue.delete()}, {merge:true});
    const body = {
        "model": 'text-davinci-003',
        "prompt": promptPrefix + messagesText,
        "max_tokens": 200,
        "temperature": 0.6
    };

    const headers = await prepareOpenAIHeaders();

    try {
        const res = await axios.post('https://api.openai.com/v1/completions', body, { headers: headers });

        if (res.status !== 200) {
            await docRef.update({ 'error': res.data });
            return;
        }
        let text = res.data['choices'][0]['text'];
        const jsonStartIndex = text.indexOf('{');
        const jsonEndIndex = text.lastIndexOf('}');
        text = text.substring(jsonStartIndex, jsonEndIndex + 1);

        try{
            const jsonContent = JSON.parse(text);
            await docRef.update({
                'content': jsonContent,
            });

            if (jsonContent['name'] != null){
                const searchDoc = await db.collection('search').doc(jsonContent['name']).get();
                if(!searchDoc.exists){
                    await db.collection('search').doc(jsonContent['name']).set({
                        'target': jsonContent['name'],
                        'timeCreated': admin.firestore.FieldValue.serverTimestamp(),
                        'author': 'your-user-id',
                    });
                    await docRef.update({'target': jsonContent['name']});
                }
            }
        } catch(e: any){
            await docRef.update({ 'error': e.toString() + '\n' + text });
        }
    }catch(err){
        console.error(err);
    }
});