import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import type { FsDocument } from "./types.js";

/**
 * A simple serialize-able document type. All utility methods return an
 * FsDocument, but sometimes you might want to construct a document from an API
 * payload, or be able to serialize it. For those cases the PlainDocument type
 * can be useful as a subset of FsDocument.
 */

export function makeFsDocument<T>(
  doc: DocumentSnapshot<DocumentData>
): FsDocument<T> {
  return {
    id: doc.id,
    data: doc.data() as T,
    ref: doc.ref,
  };
}
