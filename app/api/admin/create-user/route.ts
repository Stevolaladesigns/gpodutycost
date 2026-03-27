import { NextResponse } from 'next/server';
import { admin } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid/expired token" }, { status: 401 });
  }

  try {
    // Only verify admin status via firestore read if needed.
    // Let's get the user doc to ensure they are an ADMIN
    const requestUserDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    const isLegacyAdmin = decodedToken.email?.toLowerCase() === 'itsupport@ghanapost.com.gh';
    
    console.log("Create user request from UID:", decodedToken.uid);
    console.log("User doc exists?", requestUserDoc.exists);
    console.log("User doc data:", requestUserDoc.data());

    // NOTE: For the very first Admin account, their document might not exist yet in Firestore.
    // If the doc exists but role is NOT Admin (and not legacy admin), block. 
    if (!isLegacyAdmin && requestUserDoc.exists && requestUserDoc.data()?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { full_name, email, password, role, post_office } = await request.json();

    // 1. Create the user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: full_name,
    });

    // 2. Create the user document in Firestore (admin SDK bypasses security rules)
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      full_name,
      email,
      role,
      post_office,
      is_active: 1,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true, uid: userRecord.uid });
  } catch (e: any) {
    console.error("User Creation Error:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}
