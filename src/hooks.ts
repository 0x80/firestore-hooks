import type { CollectionReference, Query } from "firebase/firestore";
import { doc } from "firebase/firestore";
import {
  useCollection as _useCollection,
  useCollectionOnce as _useCollectionOnce,
  useDocument as _useDocument,
  useDocumentOnce as _useDocumentOnce,
} from "react-firebase-hooks/firestore";
import { makeFsDocument } from "./helpers";
import type { FsDocument } from "./types";
import { getErrorMessage } from "./utils";

export function useDocument<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [FsDocument<T> | undefined, boolean] {
  const [snapshot, isLoading, error] = _useDocument(
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
