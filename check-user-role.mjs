import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, 'firebase-service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('Service account file NOT found.');
    process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'gpodutycost'
});

async function checkUser() {
    const email = 'ITsupport@ghanapost.com.gh';
    try {
        const snapshot = await admin.firestore().collection('users').where('email', '==', email).get();
        if (snapshot.empty) {
            console.log(`User with email ${email} not found in Firestore.`);
        } else {
            snapshot.forEach(doc => {
                console.log('User data:', doc.id, JSON.stringify(doc.data(), null, 2));
            });
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkUser();
