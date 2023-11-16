import type { DocumentReference } from "firebase/firestore";

/**
 * A simple serialize-able document type. All utility methods return an
 * FsDocument, but sometimes you might want to construct a document from an API
 * payload, or be able to serialize it. For those cases the PlainDocument type
 * can be useful as a subset of FsDocument.
 */
export type PlainDocument<T> = {
  id: string;
  data: T;
};

export type FsDocument<T> = {
  ref: DocumentReference;
} & PlainDocument<T>;
