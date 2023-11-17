# Firestore Hooks

Simple and typed React hooks for handling Firestore documents. Currently it is a
stripped down and more opinionated abstraction on [react-firebase-hooks]().
Eventually I would like to extract the essential parts of it, to cut any
overhead and make this dependency free.

In my personal experience using Firestore over the last 7 years or so, I have
not needed most the API surface. If you deem something essential let me know and
I will consider adding support for it.

## Installation

`npm add firestore-hooks`

## Main Motivation

- Convenient use of Typescript generics
- Use the same [FsDocument](#fsdocument) abstraction as used in
  [firestore-server-utils](), to unify server and client code.
- Throw errors instead of returning them. See [errors](#errors).

## Usage

The API is optimized for globally configured collection refs. I think it is good
practice to reuse these refs when referring to collections, because it prevents
repetition and typos.

For example, create a global file like `refs.ts`:

```ts
import { collection, getFirestore } from "firebase/firestore";

const db = getFirestore();

export const refs = {
  users: collection(db, "users"),
};
```

Then in a React component you can do things like:

```ts
import { useDocument } from "firestore-hooks";

//...

const [user, isLoading] = useDocument<User>(refs.users, userId);

if (isLoading) {
  return <LoadingIndicator/>;
}

// The data field is typed to User here
console.log(`User ${user.id} has display name: ${user.data.displayName}`);

// Use the ref handle to mutate the document
user.ref.update({ displayName: "new name" } satisfies Partial<User>);
```

## FsDocument

The original Firestore API, while quite convenient, seems more verbose than
needed for the vast majority of use-cases. Data is retrieved from the snapshot
with a `data()` but it accepts optional parameters that you will likely never
use. Also, Typescript generics are not available and the [withConverter API](),
that could be used to type your data, is overkill if you are not interested in
converting your data.

A lot of libraries that make abstractions for Firestore (e.g.
[react-firebase-hooks]()) merge the id and data into a single object. I think
this is not very elegant, because in Firestore the document id is clearly
separated from the data. Bringing the two together not only makes it harder to
type your data, but also potentially creates a naming collision, because a
document is allowed to have an `id` field as part of its data, separate from the
actual document id.

The most convenient document abstraction I can come up with is:

```ts
export type FsDocument<T> = {
  id: string;
  data: T;
  ref: DocumentReference;
};
```

The ref is included, because sometimes after working with the data, you then
want to mutate the same document with `set` or `update`.

It is not called `Document`, because in web environments that is already the
global HTML document type, and so IDEs tend to pick the wrong type when
automatically generating imports for you.

## Errors

Firestore document and collection query errors are extremely rare in production
and therefor I prefer not to handle them in every calling context. The most
common errors are "an index is required for this query" and attempting to fetch
a document that doesn't exist. Both of which should be caught in development and
testing and typically do not occur in production code.
