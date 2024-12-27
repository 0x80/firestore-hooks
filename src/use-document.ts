import type { CollectionReference } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { useMemo } from "react";
import {
  useDocument as useDocument_fork,
  useDocumentOnce as useDocumentOnce_fork,
} from "./forked-from-rfh/useDocument.js";
import type { FsDocument } from "./types.js";

export function useTypedDocument<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [FsDocument<T> | undefined, boolean] {
  const ref = documentId ? doc(collectionRef, documentId) : undefined;
  const [snapshot, isLoading, error] = useDocument_fork(ref);

  if (error) {
    throw error;
  }

  const document = useMemo(
    () =>
      snapshot?.exists()
        ? { id: snapshot.id, data: snapshot.data() as T, ref: snapshot.ref }
        : undefined,
    [snapshot]
  );

  return [document, isLoading];
}

export const useDocument = useTypedDocument;

/**
 * A version of useTypedDocument that doesn't throw when the document doesn't
 * exist.
 */
export function useTypedDocumentMaybe<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [FsDocument<T> | undefined, boolean] {
  const ref = documentId ? doc(collectionRef, documentId) : undefined;
  const [snapshot, isLoading] = useDocument_fork(ref);

  const document = useMemo(
    () =>
      snapshot?.exists()
        ? { id: snapshot.id, data: snapshot.data() as T, ref: snapshot.ref }
        : undefined,
    [snapshot]
  );

  return [document, isLoading];
}

export const useDocumentMaybe = useTypedDocumentMaybe;

export function useTypedDocumentData<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [T | undefined, boolean] {
  const [document, isLoading] = useTypedDocument<T>(collectionRef, documentId);

  return [document?.data, isLoading];
}

export const useDocumentData = useTypedDocumentData;

export function useTypedDocumentOnce<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [FsDocument<T> | undefined, boolean] {
  const ref = documentId ? doc(collectionRef, documentId) : undefined;
  const [snapshot, isLoading, error] = useDocumentOnce_fork(ref);

  if (error) {
    throw error;
  }

  const document = useMemo(
    () =>
      snapshot?.exists()
        ? { id: snapshot.id, data: snapshot.data() as T, ref: snapshot.ref }
        : undefined,
    [snapshot]
  );

  return [document, isLoading];
}

export const useDocumentOnce = useTypedDocumentOnce;
