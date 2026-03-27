import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

try {
  if (!admin.apps.length) {
    const serviceAccountPath = path.resolve(process.cwd(), 'firebase-service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: "gpodutycost"
      });
    } else {
      // Fallback
      const altPath = path.resolve('d:/STEVE BACKUP/ghanapost duty cost/firebase-service-account.json');
      if (fs.existsSync(altPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(altPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: "gpodutycost"
        });
      } else {
        admin.initializeApp({ projectId: "gpodutycost" });
        console.warn('[Firebase Admin] Service account not found. Admin features might be unavailable.');
      }
    }
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
}

export { admin };
