import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'ierplawwebsite',
  location: 'us-east4'
};

export const createEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEvent', inputVars);
}
createEventRef.operationName = 'CreateEvent';

export function createEvent(dcOrVars, vars) {
  return executeMutation(createEventRef(dcOrVars, vars));
}

export const listPublicationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublications');
}
listPublicationsRef.operationName = 'ListPublications';

export function listPublications(dc) {
  return executeQuery(listPublicationsRef(dc));
}

export const updateStaffMemberBioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStaffMemberBio', inputVars);
}
updateStaffMemberBioRef.operationName = 'UpdateStaffMemberBio';

export function updateStaffMemberBio(dcOrVars, vars) {
  return executeMutation(updateStaffMemberBioRef(dcOrVars, vars));
}

export const deleteLegalResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteLegalResource', inputVars);
}
deleteLegalResourceRef.operationName = 'DeleteLegalResource';

export function deleteLegalResource(dcOrVars, vars) {
  return executeMutation(deleteLegalResourceRef(dcOrVars, vars));
}

