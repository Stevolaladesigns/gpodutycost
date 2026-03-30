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

async function migrate() {
    try {
        console.log('--- Starting Migration ---');

        // 1. Normalize Transactions
        console.log('Migrating transactions...');
        const txSnapshot = await db.collection('transactions').get();
        let txCount = 0;
        const txBatch = db.batch();

        txSnapshot.forEach(doc => {
            const data = doc.data();
            let updated = false;
            const updateObj = {};

            if (typeof data.created_at === 'string') {
                updateObj.created_at = admin.firestore.Timestamp.fromDate(new Date(data.created_at));
                updated = true;
            }

            if (updated) {
                txBatch.update(doc.ref, updateObj);
                txCount++;
            }
        });

        if (txCount > 0) {
            await txBatch.commit();
            console.log(`Updated ${txCount} transactions.`);
        } else {
            console.log('No transactions needed updating.');
        }

        // 2. Standardize User Roles
        console.log('Migrating users...');
        const userSnapshot = await db.collection('users').get();
        let userCount = 0;
        const userBatch = db.batch();

        userSnapshot.forEach(doc => {
            const data = doc.data();
            let updated = false;
            
            // Check for 'role ' key with trailing space
            if (data['role '] !== undefined) {
                const roleValue = data['role '];
                // Ensure proper 'role' key exists
                const updateObj = {
                    role: data.role || roleValue,
                    'role ': admin.firestore.FieldValue.delete()
                };
                userBatch.update(doc.ref, updateObj);
                updated = true;
                userCount++;
            }
        });

        if (userCount > 0) {
            await userBatch.commit();
            console.log(`Updated ${userCount} users.`);
        } else {
            console.log('No users needed updating.');
        }

        console.log('--- Migration Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
