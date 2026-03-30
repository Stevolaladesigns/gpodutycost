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

async function checkAllAdmins() {
    try {
        const snapshot = await admin.firestore().collection('users').get();
        console.log(`Checking ${snapshot.size} users:`);
        snapshot.forEach(doc => {
            const data = doc.data();
            const email = data.email || 'N/A';
            const role = data.role;
            const roleWithSpace = data['role '];
            if (role === 'ADMIN' || roleWithSpace === 'ADMIN') {
                console.log(`User: ${email}`);
                console.log(`  role: ${role}`);
                console.log(`  role (with space): ${roleWithSpace}`);
            }
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkAllAdmins();
