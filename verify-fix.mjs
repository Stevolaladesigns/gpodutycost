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

const db = admin.firestore();

async function verify() {
    try {
        console.log('--- Verification Started ---');

        // 1. Verify Transactions
        const txSnapshot = await db.collection('transactions').get();
        let stringDates = 0;
        let timestamps = 0;
        txSnapshot.forEach(doc => {
            const data = doc.data();
            if (typeof data.created_at === 'string') stringDates++;
            else if (data.created_at instanceof admin.firestore.Timestamp) timestamps++;
        });
        console.log(`Transactions: ${timestamps} Timestamps, ${stringDates} Strings.`);

        // 2. Verify User Roles
        const userSnapshot = await db.collection('users').get();
        let badRoleKeys = 0;
        userSnapshot.forEach(doc => {
            const data = doc.data();
            if (data['role '] !== undefined) badRoleKeys++;
        });
        console.log(`Users with 'role ' key: ${badRoleKeys}`);

        if (stringDates === 0 && badRoleKeys === 0) {
            console.log('--- Verification Success! ---');
        } else {
            console.log('--- Verification Failed! ---');
        }
        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verify();
