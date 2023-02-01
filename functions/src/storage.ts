import { db } from "./index";
import { storage} from 'firebase-admin';
import { writeFileSync } from "fs";


export function StorageWriteList(list: string){

    const documentReference = db.collection('list').doc(list).collection('item');

    documentReference.get().then((doc) => {
        const documentData = doc.docs.map((d) => d.data());

        // Convert the document data to a JSON string
        const jsonString = JSON.stringify(documentData);

        // Write the JSON string to a file
        writeFileSync('/tmp/document.json', jsonString);

        // Upload the file to Firebase Cloud Storage
        try{
            // Get bucket
            var bucket = storage().bucket();
            console.log('bucket created')
        }catch(err){
            console.log('bucket creation eror:  '+ err)
            return
        }

        try{
            // Create a file
            var file = bucket.file('/tmp/document.json');
            console.log('file created')
        }catch(err){
            console.log('file creation eror:  '+ err)
            return
        }
        
        file.createWriteStream({
        metadata: {
            contentType: 'application/json',
        },
        }).end(jsonString);
    }).catch((error) => {
        console.error('Error getting document:', error);
        return;
    });
    console.log('file created')
    return
}