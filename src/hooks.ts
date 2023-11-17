import type {
  CollectionReference,
  DocumentReference,
  Query,
} from "firebase/firestore";
import { doc } from "firebase/firestore";
import {
  useCollection as _useCollection,
  useCollectionOnce as _useCollectionOnce,
  useDocument as _useDocumentFak,
  useDocumentOnce as _useDocumentOnce,
} from "./forked-from-rfh/index.js";
import { makeFsDocument } from "./helpers/index.js";
import type { FsDocument } from "./types.js";
import { getErrorMessage } from "./utils/index.js";

export function useDocumentX<T>(
  documentRef?: DocumentReference
): [FsDocument<T> | undefined, boolean] {
  const [snapshot, isLoading, error] = _useDocumentFak(documentRef);

  if (error) {
    throw new Error(
      `Failed to use document from ${documentRef?.path}: ${getErrorMessage(
        error
      )}`
    );
  }

  return [
    snapshot?.exists() ? makeFsDocument<T>(snapshot) : undefined,
    isLoading,
  ];
}

export function useDocumentZ<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [FsDocument<T> | undefined, boolean] {
  const [snapshot, isLoading, error] = _useDocumentFak(
    documentId ? doc(collectionRef, documentId) : undefined
  );

  if (error) {
    throw new Error(
      `Failed to use document from ${
        collectionRef.path
      }/${documentId}: ${getErrorMessage(error)}`
    );
  }

  return [
    snapshot?.exists() ? makeFsDocument<T>(snapshot) : undefined,
    isLoading,
  ];
}

export function useDocumentOnce<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [FsDocument<T> | undefined, boolean] {
  const [snapshot, isLoading, error] = _useDocumentOnce(
    documentId ? doc(collectionRef, documentId) : undefined
  );

  if (error) {
    throw error;
  }

  return [
    snapshot?.exists() ? makeFsDocument<T>(snapshot) : undefined,
    isLoading,
  ];
}

export function useCollection<T>(
  query?: Query | CollectionReference
): [FsDocument<T>[], boolean] {
  const [snapshot, isLoading, error] = _useCollection(query);

  if (error) {
    throw error;
  }

  const docs = snapshot
    ? snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as T,
        ref: doc.ref,
      }))
    : [];

  return [docs, isLoading];
}

export function useCollectionOnce<T>(
  query?: Query | CollectionReference
): [FsDocument<T>[], boolean] {
  const [snapshot, isLoading, error] = _useCollectionOnce(query);

  if (error) {
    throw error;
  }

  const docs = snapshot
    ? snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as T,
        ref: doc.ref,
      }))
    : [];

  return [docs, isLoading];
}
