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
    const requestUserDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    const userData = requestUserDoc.data();
    
    // Allow only explicit ADMINs.
    if (!requestUserDoc.exists || userData?.role !== 'ADMIN' || userData?.is_active === 0) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const body = await request.json();
    // Accept both `targetUid` (user management) and `userId` (self-profile edit)
    const { action, data } = body;
    const targetUid = body.targetUid || body.userId;

    if (action === 'LIST_USERS') {
      const snapshot = await admin.firestore().collection('users').get();
      const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ success: true, users });
    }

    if (!targetUid) {
      return NextResponse.json({ error: "Missing target user ID" }, { status: 400 });
    }

    if (action === 'TOGGLE_STATUS') {
      const targetDoc = await admin.firestore().collection('users').doc(targetUid).get();
      if (!targetDoc.exists) throw new Error("User not found");
      const currentStatus = targetDoc.data()?.is_active;
      const newStatus = currentStatus === 1 ? 0 : 1;
      
      // Update Auth
      await admin.auth().updateUser(targetUid, { disabled: newStatus === 0 });
      // Update Firestore
      await admin.firestore().collection('users').doc(targetUid).update({ is_active: newStatus });
      
      return NextResponse.json({ success: true, newStatus });
    } 
    else if (action === 'EDIT_USER') {
      const { full_name, post_office } = data;
      // Update Auth (Name)
      await admin.auth().updateUser(targetUid, { displayName: full_name });
      // Build Firestore update — only include role if explicitly provided
      const firestoreUpdate: any = { full_name, post_office };
      if (data.role !== undefined) {
        firestoreUpdate.role = data.role;
      }
      await admin.firestore().collection('users').doc(targetUid).set(firestoreUpdate, { merge: true });
      return NextResponse.json({ success: true });
    }
    else if (action === 'DELETE_USER') {
      try {
        // Delete from Auth
        await admin.auth().deleteUser(targetUid);
      } catch (authErr: any) {
        // If user not found in Auth, we still want to delete from Firestore
        console.warn(`User ${targetUid} not found in Auth during deletion.`, authErr);
      }
      // Delete from Firestore
      await admin.firestore().collection('users').doc(targetUid).delete();
      return NextResponse.json({ success: true });
    }
    else if (action === 'CLEANUP_GHOSTS') {
      // List all users from Auth (upto 1000 for simple cleanup)
      const authUsersResult = await admin.auth().listUsers(1000);
      const authUids = new Set(authUsersResult.users.map(u => u.uid));
      
      const firestoreUsers = await admin.firestore().collection('users').get();
      let deletedCount = 0;
      
      const batch = admin.firestore().batch();
      firestoreUsers.docs.forEach(doc => {
        if (!authUids.has(doc.id)) {
          batch.delete(doc.ref);
          deletedCount++;
        }
      });
      
      if (deletedCount > 0) await batch.commit();
      return NextResponse.json({ success: true, deletedCount });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (e: any) {
    console.error("User Management Error:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}
