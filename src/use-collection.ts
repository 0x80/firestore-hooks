import {
  type CollectionReference,
  type QueryConstraint,
  limit,
  query,
} from "firebase/firestore";
import { useMemo } from "react";
import { useCollection } from "./forked-from-rfh/useCollection.js";
import type { FsDocument } from "./types.js";
import { isDefined } from "./utils/is-present.js";

export function useTypedCollection<T>(
  collectionRef: CollectionReference,
  ...queryConstraints: (QueryConstraint | undefined)[]
): [FsDocument<T>[] | undefined, boolean] {
  const hasNoConstraints = queryConstraints.length === 0;

  const _query = hasNoConstraints
    ? query(collectionRef, limit(500))
    : query(collectionRef, ...queryConstraints.filter(isDefined));

  const [snapshot, isLoading, error] = useCollection(_query);

  if (error) {
    throw new Error(
      `Failed to execute query on ${collectionRef.path}. Error code: ${error.code}`
    );
  }

  const docs = useMemo(() => {
    if (!snapshot) {
      return undefined;
    }
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data() as T,
      ref: doc.ref,
    }));
  }, [snapshot]);

  return [docs, isLoading];
}
