import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

try {
  if (!admin.apps.length) {
    let serviceAccount: any = null;

    // 1. Try raw JSON string from env
    if (process.env.FIREBASE_SERVICE_ACCOUNT_CONTENT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_CONTENT);
    } 
    // 2. Try JSON file path from env
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH) {
      const p = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH);
      if (fs.existsSync(p)) {
        serviceAccount = JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    }
    // 3. Fallback: Check default local paths
    else {
      const localPaths = [
        path.resolve(process.cwd(), 'firebase-service-account.json'),
        'd:/STEVE BACKUP/ghanapost duty cost/firebase-service-account.json'
      ];
      for (const p of localPaths) {
        if (fs.existsSync(p)) {
          serviceAccount = JSON.parse(fs.readFileSync(p, 'utf8'));
          break;
        }
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gpodutycost"
      });
    } else {
      // Final fallback: use default credentials (e.g. for GCP environments)
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gpodutycost"
      });
      console.warn('[Firebase Admin] Service account not found. Using default credentials.');
    }
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
}

export { admin };
