import type { CollectionReference } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { useMemo } from "react";
import {
  useDocument as useDocument_orig,
  useDocumentOnce as useDocumentOnce_orig,
} from "./forked-from-rfh/useDocument.js";
import type { FsDocument } from "./types.js";

export function useDocument<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [FsDocument<T> | undefined, boolean] {
  const ref = documentId ? doc(collectionRef, documentId) : undefined;
  const [snapshot, isLoading, error] = useDocument_orig(ref);

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

/** A version of useDocument that doesn't throw when the document doesn't exist. */
export function useDocumentMaybe<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [FsDocument<T> | undefined, boolean] {
  const ref = documentId ? doc(collectionRef, documentId) : undefined;
  const [snapshot, isLoading] = useDocument_orig(ref);

  const document = useMemo(
    () =>
      snapshot?.exists()
        ? { id: snapshot.id, data: snapshot.data() as T, ref: snapshot.ref }
        : undefined,
    [snapshot]
  );

  return [document, isLoading];
}

export function useDocumentData<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [T | undefined, boolean] {
  const [document, isLoading] = useDocument<T>(collectionRef, documentId);

  return [document?.data, isLoading];
}

export function useDocumentOnce<T>(
  collectionRef: CollectionReference,
  documentId?: string
): [FsDocument<T> | undefined, boolean] {
  const ref = documentId ? doc(collectionRef, documentId) : undefined;
  const [snapshot, isLoading, error] = useDocumentOnce_orig(ref);

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
