import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, 'firebase-service-account.json');

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'gpodutycost'
});

async function checkTransactionsDetails() {
    try {
        const txRef = admin.firestore().collection('transactions');
        const snapshot = await txRef.limit(5).get();
        console.log(`Checking 5 transactions:`);
        snapshot.forEach(doc => {
            console.log(`Doc ID: ${doc.id}`);
            console.log(JSON.stringify(doc.data(), null, 2));
            console.log('---');
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkTransactionsDetails();
