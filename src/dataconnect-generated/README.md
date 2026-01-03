# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListPublications*](#listpublications)
- [**Mutations**](#mutations)
  - [*CreateEvent*](#createevent)
  - [*UpdateStaffMemberBio*](#updatestaffmemberbio)
  - [*DeleteLegalResource*](#deletelegalresource)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListPublications
You can execute the `ListPublications` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listPublications(): QueryPromise<ListPublicationsData, undefined>;

interface ListPublicationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicationsData, undefined>;
}
export const listPublicationsRef: ListPublicationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublications(dc: DataConnect): QueryPromise<ListPublicationsData, undefined>;

interface ListPublicationsRef {
  ...
  (dc: DataConnect): QueryRef<ListPublicationsData, undefined>;
}
export const listPublicationsRef: ListPublicationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublicationsRef:
```typescript
const name = listPublicationsRef.operationName;
console.log(name);
```

### Variables
The `ListPublications` query has no variables.
### Return Type
Recall that executing the `ListPublications` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublicationsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublicationsData {
  publications: ({
    id: UUIDString;
    title: string;
    author: string;
    publicationDate: TimestampString;
    fileUrl: string;
  } & Publication_Key)[];
}
```
### Using `ListPublications`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublications } from '@dataconnect/generated';


// Call the `listPublications()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublications();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublications(dataConnect);

console.log(data.publications);

// Or, you can use the `Promise` API.
listPublications().then((response) => {
  const data = response.data;
  console.log(data.publications);
});
```

### Using `ListPublications`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublicationsRef } from '@dataconnect/generated';


// Call the `listPublicationsRef()` function to get a reference to the query.
const ref = listPublicationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublicationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.publications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.publications);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateEvent
You can execute the `CreateEvent` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createEvent(vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;

interface CreateEventRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
}
export const createEventRef: CreateEventRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createEvent(dc: DataConnect, vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;

interface CreateEventRef {
  ...
  (dc: DataConnect, vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
}
export const createEventRef: CreateEventRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createEventRef:
```typescript
const name = createEventRef.operationName;
console.log(name);
```

### Variables
The `CreateEvent` mutation requires an argument of type `CreateEventVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateEventVariables {
  description: string;
  eventDate: TimestampString;
  location: string;
  title: string;
}
```
### Return Type
Recall that executing the `CreateEvent` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateEventData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateEventData {
  event_insert: Event_Key;
}
```
### Using `CreateEvent`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createEvent, CreateEventVariables } from '@dataconnect/generated';

// The `CreateEvent` mutation requires an argument of type `CreateEventVariables`:
const createEventVars: CreateEventVariables = {
  description: ..., 
  eventDate: ..., 
  location: ..., 
  title: ..., 
};

// Call the `createEvent()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createEvent(createEventVars);
// Variables can be defined inline as well.
const { data } = await createEvent({ description: ..., eventDate: ..., location: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createEvent(dataConnect, createEventVars);

console.log(data.event_insert);

// Or, you can use the `Promise` API.
createEvent(createEventVars).then((response) => {
  const data = response.data;
  console.log(data.event_insert);
});
```

### Using `CreateEvent`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createEventRef, CreateEventVariables } from '@dataconnect/generated';

// The `CreateEvent` mutation requires an argument of type `CreateEventVariables`:
const createEventVars: CreateEventVariables = {
  description: ..., 
  eventDate: ..., 
  location: ..., 
  title: ..., 
};

// Call the `createEventRef()` function to get a reference to the mutation.
const ref = createEventRef(createEventVars);
// Variables can be defined inline as well.
const ref = createEventRef({ description: ..., eventDate: ..., location: ..., title: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createEventRef(dataConnect, createEventVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.event_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.event_insert);
});
```

## UpdateStaffMemberBio
You can execute the `UpdateStaffMemberBio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateStaffMemberBio(vars: UpdateStaffMemberBioVariables): MutationPromise<UpdateStaffMemberBioData, UpdateStaffMemberBioVariables>;

interface UpdateStaffMemberBioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffMemberBioVariables): MutationRef<UpdateStaffMemberBioData, UpdateStaffMemberBioVariables>;
}
export const updateStaffMemberBioRef: UpdateStaffMemberBioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateStaffMemberBio(dc: DataConnect, vars: UpdateStaffMemberBioVariables): MutationPromise<UpdateStaffMemberBioData, UpdateStaffMemberBioVariables>;

interface UpdateStaffMemberBioRef {
  ...
  (dc: DataConnect, vars: UpdateStaffMemberBioVariables): MutationRef<UpdateStaffMemberBioData, UpdateStaffMemberBioVariables>;
}
export const updateStaffMemberBioRef: UpdateStaffMemberBioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateStaffMemberBioRef:
```typescript
const name = updateStaffMemberBioRef.operationName;
console.log(name);
```

### Variables
The `UpdateStaffMemberBio` mutation requires an argument of type `UpdateStaffMemberBioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateStaffMemberBioVariables {
  id: UUIDString;
  bio?: string | null;
}
```
### Return Type
Recall that executing the `UpdateStaffMemberBio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateStaffMemberBioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateStaffMemberBioData {
  staffMember_update?: StaffMember_Key | null;
}
```
### Using `UpdateStaffMemberBio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateStaffMemberBio, UpdateStaffMemberBioVariables } from '@dataconnect/generated';

// The `UpdateStaffMemberBio` mutation requires an argument of type `UpdateStaffMemberBioVariables`:
const updateStaffMemberBioVars: UpdateStaffMemberBioVariables = {
  id: ..., 
  bio: ..., // optional
};

// Call the `updateStaffMemberBio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateStaffMemberBio(updateStaffMemberBioVars);
// Variables can be defined inline as well.
const { data } = await updateStaffMemberBio({ id: ..., bio: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateStaffMemberBio(dataConnect, updateStaffMemberBioVars);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
updateStaffMemberBio(updateStaffMemberBioVars).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

### Using `UpdateStaffMemberBio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateStaffMemberBioRef, UpdateStaffMemberBioVariables } from '@dataconnect/generated';

// The `UpdateStaffMemberBio` mutation requires an argument of type `UpdateStaffMemberBioVariables`:
const updateStaffMemberBioVars: UpdateStaffMemberBioVariables = {
  id: ..., 
  bio: ..., // optional
};

// Call the `updateStaffMemberBioRef()` function to get a reference to the mutation.
const ref = updateStaffMemberBioRef(updateStaffMemberBioVars);
// Variables can be defined inline as well.
const ref = updateStaffMemberBioRef({ id: ..., bio: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateStaffMemberBioRef(dataConnect, updateStaffMemberBioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.staffMember_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.staffMember_update);
});
```

## DeleteLegalResource
You can execute the `DeleteLegalResource` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteLegalResource(vars: DeleteLegalResourceVariables): MutationPromise<DeleteLegalResourceData, DeleteLegalResourceVariables>;

interface DeleteLegalResourceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLegalResourceVariables): MutationRef<DeleteLegalResourceData, DeleteLegalResourceVariables>;
}
export const deleteLegalResourceRef: DeleteLegalResourceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteLegalResource(dc: DataConnect, vars: DeleteLegalResourceVariables): MutationPromise<DeleteLegalResourceData, DeleteLegalResourceVariables>;

interface DeleteLegalResourceRef {
  ...
  (dc: DataConnect, vars: DeleteLegalResourceVariables): MutationRef<DeleteLegalResourceData, DeleteLegalResourceVariables>;
}
export const deleteLegalResourceRef: DeleteLegalResourceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteLegalResourceRef:
```typescript
const name = deleteLegalResourceRef.operationName;
console.log(name);
```

### Variables
The `DeleteLegalResource` mutation requires an argument of type `DeleteLegalResourceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteLegalResourceVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteLegalResource` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteLegalResourceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteLegalResourceData {
  legalResource_delete?: LegalResource_Key | null;
}
```
### Using `DeleteLegalResource`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteLegalResource, DeleteLegalResourceVariables } from '@dataconnect/generated';

// The `DeleteLegalResource` mutation requires an argument of type `DeleteLegalResourceVariables`:
const deleteLegalResourceVars: DeleteLegalResourceVariables = {
  id: ..., 
};

// Call the `deleteLegalResource()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteLegalResource(deleteLegalResourceVars);
// Variables can be defined inline as well.
const { data } = await deleteLegalResource({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteLegalResource(dataConnect, deleteLegalResourceVars);

console.log(data.legalResource_delete);

// Or, you can use the `Promise` API.
deleteLegalResource(deleteLegalResourceVars).then((response) => {
  const data = response.data;
  console.log(data.legalResource_delete);
});
```

### Using `DeleteLegalResource`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteLegalResourceRef, DeleteLegalResourceVariables } from '@dataconnect/generated';

// The `DeleteLegalResource` mutation requires an argument of type `DeleteLegalResourceVariables`:
const deleteLegalResourceVars: DeleteLegalResourceVariables = {
  id: ..., 
};

// Call the `deleteLegalResourceRef()` function to get a reference to the mutation.
const ref = deleteLegalResourceRef(deleteLegalResourceVars);
// Variables can be defined inline as well.
const ref = deleteLegalResourceRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteLegalResourceRef(dataConnect, deleteLegalResourceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.legalResource_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.legalResource_delete);
});
```

