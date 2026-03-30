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

async function checkTransactions() {
    try {
        const txRef = admin.firestore().collection('transactions');
        const allDocs = await txRef.get();
        console.log(`Total transactions: ${allDocs.size}`);
        
        let withoutCreatedAt = 0;
        allDocs.forEach(doc => {
            if (!doc.data().created_at) {
                withoutCreatedAt++;
            }
        });
        console.log(`Transactions without created_at: ${withoutCreatedAt}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkTransactions();
