import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  DocumentData,
  QueryConstraint,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from './config';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  BILLS: 'bills',
} as const;

// Helper to get subcollection reference
export function getSubcollection(
  parentCollection: string,
  parentId: string,
  subcollection: string
) {
  return collection(db, parentCollection, parentId, subcollection);
}

// Generic CRUD operations
export async function createDocument<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  const collectionRef = collection(db, collectionName);
  const docRef = await addDoc(collectionRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function createDocumentWithId<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function getDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

export async function updateDocument<T extends Partial<DocumentData>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}

export async function queryDocuments<T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

// Subcollection helpers
export async function createSubDocument<T extends DocumentData>(
  parentCollection: string,
  parentId: string,
  subcollection: string,
  data: T
): Promise<string> {
  const subcollectionRef = getSubcollection(parentCollection, parentId, subcollection);
  const docRef = await addDoc(subcollectionRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getSubDocument<T>(
  parentCollection: string,
  parentId: string,
  subcollection: string,
  docId: string
): Promise<T | null> {
  const docRef = doc(db, parentCollection, parentId, subcollection, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

export async function updateSubDocument<T extends Partial<DocumentData>>(
  parentCollection: string,
  parentId: string,
  subcollection: string,
  docId: string,
  data: T
): Promise<void> {
  const docRef = doc(db, parentCollection, parentId, subcollection, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteSubDocument(
  parentCollection: string,
  parentId: string,
  subcollection: string,
  docId: string
): Promise<void> {
  const docRef = doc(db, parentCollection, parentId, subcollection, docId);
  await deleteDoc(docRef);
}

export async function querySubDocuments<T>(
  parentCollection: string,
  parentId: string,
  subcollection: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const subcollectionRef = getSubcollection(parentCollection, parentId, subcollection);
  const q = query(subcollectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

// Export Timestamp for use in components
export { Timestamp };

