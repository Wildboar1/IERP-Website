const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'ierplawwebsite',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEvent', inputVars);
}
createEventRef.operationName = 'CreateEvent';
exports.createEventRef = createEventRef;

exports.createEvent = function createEvent(dcOrVars, vars) {
  return executeMutation(createEventRef(dcOrVars, vars));
};

const listPublicationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublications');
}
listPublicationsRef.operationName = 'ListPublications';
exports.listPublicationsRef = listPublicationsRef;

exports.listPublications = function listPublications(dc) {
  return executeQuery(listPublicationsRef(dc));
};

const updateStaffMemberBioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStaffMemberBio', inputVars);
}
updateStaffMemberBioRef.operationName = 'UpdateStaffMemberBio';
exports.updateStaffMemberBioRef = updateStaffMemberBioRef;

exports.updateStaffMemberBio = function updateStaffMemberBio(dcOrVars, vars) {
  return executeMutation(updateStaffMemberBioRef(dcOrVars, vars));
};

const deleteLegalResourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteLegalResource', inputVars);
}
deleteLegalResourceRef.operationName = 'DeleteLegalResource';
exports.deleteLegalResourceRef = deleteLegalResourceRef;

exports.deleteLegalResource = function deleteLegalResource(dcOrVars, vars) {
  return executeMutation(deleteLegalResourceRef(dcOrVars, vars));
};
