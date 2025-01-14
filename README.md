# Firestore Hooks

Simple and typed React hooks for handling Firestore documents. Currently it is a
more focussed and opinionated abstraction on top of [react-firebase-hooks]().

Eventually, we will likely extract or reimplement the essential parts of that
library, to make this dependency free.

## Installation

`npm add firestore-hooks`

## Features

- Convenient use of Typescript generics
- Uses the same [FsDocument](#fsdocument) abstraction as used in
  [firestore-server-utils](), to unify server and client code.
- Throw errors instead of returning them. See [errors](#errors).

## Usage

### Hooks

| Hook               | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `useDocument`      | Use a document and subscribe to changes                       |
| `useDocumentData`  | Use only the data part of a document and subscribe to changes |
| `useDocumentMaybe` | Use a document that might not exist                           |
| `useDocumentOnce`  | Use a document once and do not subscribe for changes          |
| `useCollection`    | Query a collection and subscribe for changes                  |

### Regular Functions

These might be useful for when you use something like ReactQuery and you want to
fetch a document outside of a component/hook.

| Function                          | Description                                                    |
| --------------------------------- | -------------------------------------------------------------- |
| `getDocument`                     | Fetch a document                                               |
| `getDocumentData`                 | Fetch only the data part of a document                         |
| `getDocumentMaybe`                | Fetch a document that might not exist                          |
| `getDocumentFromTransaction`      | Fetch a document as part of a transaction                      |
| `getDocumentFromTransactionMaybe` | Fetch a document that might not exist as part of a transaction |

### Example

The API is optimized for globally configured collection refs. I think it is good
practice to reuse these refs when referring to collections, because it reduces
boilerplate and prevents typos.

For example, create a global file like `db-refs.ts`, and store the refs by
collection name. For subcollections I like to use a function that returns the
ref based on the document id.

```ts
import { collection, getFirestore } from "firebase/firestore";

const db = getFirestore();

export const refs = {
  users: collection(db, "users"),
  userEvents: (userId: string) => collection(db, `users/${userId}/events`),
};
```

Then in a component you would do something like this:

```ts
import { useDocument } from "firestore-hooks";
import { UpdateData } from "firebase/firestore";
//...

const [user, isLoading] = useDocument<User>(refs.users, userId);

if (isLoading) {
  return <LoadingIndicator/>;
}

// The data field will be typed to User here
console.log(`User ${user.id} has display name: ${user.data.displayName}`);

// Use the ref handle to mutate the document
user.ref.update({ displayName: "new name" } satisfies UpdateData<User>);
```

Here we use `satisfies` to ensure that the update data is compatible with the
document data type. The `UpdateData` type you can import from the
`firebase/firestore` package and it is similar to `Partial` but also understands
dot-notation for updating nested fields.

Personally, I prefer to do all document mutations server-side via an API
endpoint. You might want to consider that, especially if you have complete
control over the development of client apps or older versions could be around
for a while like with react-native. It can also save you from having to write
complex database rules for your Firestore documents.

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

Exceptions for Firestore documents and collection queries are rare in production
and therefore it was chosen for this library to not to handle them in every
calling context.

The most common errors are "an index is required for this query" and attempting
to fetch a document that doesn't exist. Both of which are typically caught in
development and testing and should not occur in production code.

In some cases you actually know upfront that the document might not exist, so
for those instances there are the `*Maybe` variants like `useDocumentMaybe()`.
These functions do not throw but simply return undefined if the document does
not exist. In this case it is not considered an error.
