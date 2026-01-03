import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateEventData {
  event_insert: Event_Key;
}

export interface CreateEventVariables {
  description: string;
  eventDate: TimestampString;
  location: string;
  title: string;
}

export interface DeleteLegalResourceData {
  legalResource_delete?: LegalResource_Key | null;
}

export interface DeleteLegalResourceVariables {
  id: UUIDString;
}

export interface Event_Key {
  id: UUIDString;
  __typename?: 'Event_Key';
}

export interface LegalResource_Key {
  id: UUIDString;
  __typename?: 'LegalResource_Key';
}

export interface ListPublicationsData {
  publications: ({
    id: UUIDString;
    title: string;
    author: string;
    publicationDate: TimestampString;
    fileUrl: string;
  } & Publication_Key)[];
}

export interface Page_Key {
  id: UUIDString;
  __typename?: 'Page_Key';
}

export interface Publication_Key {
  id: UUIDString;
  __typename?: 'Publication_Key';
}

export interface StaffMember_Key {
  id: UUIDString;
  __typename?: 'StaffMember_Key';
}

export interface UpdateStaffMemberBioData {
  staffMember_update?: StaffMember_Key | null;
}

export interface UpdateStaffMemberBioVariables {
  id: UUIDString;
  bio?: string | null;
}

interface CreateEventRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEventVariables): MutationRef<CreateEventData, CreateEventVariables>;
  operationName: string;
}
export const createEventRef: CreateEventRef;

export function createEvent(vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;
export function createEvent(dc: DataConnect, vars: CreateEventVariables): MutationPromise<CreateEventData, CreateEventVariables>;

interface ListPublicationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPublicationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPublicationsData, undefined>;
  operationName: string;
}
export const listPublicationsRef: ListPublicationsRef;

export function listPublications(): QueryPromise<ListPublicationsData, undefined>;
export function listPublications(dc: DataConnect): QueryPromise<ListPublicationsData, undefined>;

interface UpdateStaffMemberBioRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateStaffMemberBioVariables): MutationRef<UpdateStaffMemberBioData, UpdateStaffMemberBioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateStaffMemberBioVariables): MutationRef<UpdateStaffMemberBioData, UpdateStaffMemberBioVariables>;
  operationName: string;
}
export const updateStaffMemberBioRef: UpdateStaffMemberBioRef;

export function updateStaffMemberBio(vars: UpdateStaffMemberBioVariables): MutationPromise<UpdateStaffMemberBioData, UpdateStaffMemberBioVariables>;
export function updateStaffMemberBio(dc: DataConnect, vars: UpdateStaffMemberBioVariables): MutationPromise<UpdateStaffMemberBioData, UpdateStaffMemberBioVariables>;

interface DeleteLegalResourceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteLegalResourceVariables): MutationRef<DeleteLegalResourceData, DeleteLegalResourceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteLegalResourceVariables): MutationRef<DeleteLegalResourceData, DeleteLegalResourceVariables>;
  operationName: string;
}
export const deleteLegalResourceRef: DeleteLegalResourceRef;

export function deleteLegalResource(vars: DeleteLegalResourceVariables): MutationPromise<DeleteLegalResourceData, DeleteLegalResourceVariables>;
export function deleteLegalResource(dc: DataConnect, vars: DeleteLegalResourceVariables): MutationPromise<DeleteLegalResourceData, DeleteLegalResourceVariables>;

