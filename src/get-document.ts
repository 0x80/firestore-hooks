import {
  doc,
  getDoc,
  type CollectionReference,
  type Transaction,
} from "firebase/firestore";
import { makeFsDocument } from "./make-fs-document.js";
import { invariant } from "./utils/invariant.js";

export async function getDocument<T>(
  collectionRef: CollectionReference,
  documentId: string
) {
  const docSnap = await getDoc(doc(collectionRef, documentId));

  invariant(
    docSnap.exists(),
    `No document available at ${collectionRef.path}/${documentId}`
  );

  return makeFsDocument<T>(docSnap);
}

export async function getDocumentData<T>(
  collectionRef: CollectionReference,
  documentId: string
) {
  const docSnap = await getDoc(doc(collectionRef, documentId));

  invariant(
    docSnap.exists(),
    `No document available at ${collectionRef.path}/${documentId}`
  );

  return docSnap.data() as T;
}

export async function getDocumentMaybe<T>(
  collectionRef: CollectionReference,
  documentId: string
) {
  const docSnap = await getDoc(doc(collectionRef, documentId));

  if (!docSnap.exists()) return;

  return makeFsDocument<T>(docSnap);
}

export async function getDocumentDataMaybe<T>(
  collectionRef: CollectionReference,
  documentId: string
) {
  const docSnap = await getDoc(doc(collectionRef, documentId));

  if (!docSnap.exists()) return;

  return docSnap.data() as T;
}

export async function getDocumentFromTransaction<T>(
  transaction: Transaction,
  collectionRef: CollectionReference,
  documentId: string
) {
  const docSnap = await transaction.get(doc(collectionRef, documentId));

  invariant(
    docSnap.exists(),
    `No document available at ${collectionRef.path}/${documentId}`
  );

  return makeFsDocument<T>(docSnap);
}

export async function getDocumentFromTransactionMaybe<T>(
  transaction: Transaction,
  collectionRef: CollectionReference,
  documentId: string
) {
  const docSnap = await transaction.get(doc(collectionRef, documentId));

  if (!docSnap.exists()) {
    return;
  }

  return makeFsDocument<T>(docSnap);
}
