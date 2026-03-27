import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

try {
  if (!admin.apps.length) {
    let serviceAccount: any = null;
    console.log('[Firebase Admin] Initializing...');

    // 1. Try raw JSON string from env
    if (process.env.FIREBASE_SERVICE_ACCOUNT_CONTENT) {
      console.log('[Firebase Admin] Found FIREBASE_SERVICE_ACCOUNT_CONTENT env var. Length:', process.env.FIREBASE_SERVICE_ACCOUNT_CONTENT.length);
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_CONTENT);
        console.log('[Firebase Admin] Successfully parsed JSON content. Project ID:', serviceAccount.project_id);
      } catch (parseError: any) {
        console.error('[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_CONTENT:', parseError.message);
      }
    } 
    
    // 2. Try JSON file path from env
    if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH) {
      console.log('[Firebase Admin] Checking FIREBASE_SERVICE_ACCOUNT_JSON_PATH:', process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH);
      const p = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH);
      if (fs.existsSync(p)) {
        console.log('[Firebase Admin] File found at path. Reading...');
        serviceAccount = JSON.parse(fs.readFileSync(p, 'utf8'));
      } else {
        console.warn('[Firebase Admin] File NOT found at path:', p);
      }
    }

    // 3. Fallback: Check default local paths
    if (!serviceAccount) {
      const localPaths = [
        path.resolve(process.cwd(), 'firebase-service-account.json'),
        'd:/STEVE BACKUP/ghanapost duty cost/firebase-service-account.json'
      ];
      console.log('[Firebase Admin] No env credentials found, checking local paths:', localPaths);
      for (const p of localPaths) {
        if (fs.existsSync(p)) {
          console.log('[Firebase Admin] Found local service account at:', p);
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
      console.log('[Firebase Admin] Initialized with Service Account.');
    } else {
      // Final fallback: use default credentials
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gpodutycost"
      });
      console.warn('[Firebase Admin] No service account found. Using default credentials (may fail outside GCP).');
    }
  }
} catch (error) {
  console.error('[Firebase Admin] Initialization critical error:', error);
}

export { admin };
