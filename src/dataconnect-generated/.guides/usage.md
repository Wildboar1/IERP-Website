# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createEvent, listPublications, updateStaffMemberBio, deleteLegalResource } from '@dataconnect/generated';


// Operation CreateEvent:  For variables, look at type CreateEventVars in ../index.d.ts
const { data } = await CreateEvent(dataConnect, createEventVars);

// Operation ListPublications: 
const { data } = await ListPublications(dataConnect);

// Operation UpdateStaffMemberBio:  For variables, look at type UpdateStaffMemberBioVars in ../index.d.ts
const { data } = await UpdateStaffMemberBio(dataConnect, updateStaffMemberBioVars);

// Operation DeleteLegalResource:  For variables, look at type DeleteLegalResourceVars in ../index.d.ts
const { data } = await DeleteLegalResource(dataConnect, deleteLegalResourceVars);


```