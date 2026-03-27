import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, 'firebase-service-account.json');
console.log('[Firebase Admin Test] Checking service account path:', serviceAccountPath);

if (!fs.existsSync(serviceAccountPath)) {
    console.error('[Firebase Admin Test] File NOT found.');
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'gpodutycost'
});

async function runTest() {
    try {
        console.log('[Firebase Admin Test] Fetching from Firestore...');
        const snapshot = await admin.firestore().collection('users').limit(1).get();
        console.log('[Firebase Admin Test] Success! Fetched ' + snapshot.docs.length + ' documents.');
        process.exit(0);
    } catch (error) {
        console.error('[Firebase Admin Test] Error fetching Firestore:', error.message);
        process.exit(1);
    }
}

runTest();
