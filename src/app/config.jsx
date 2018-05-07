// The configuration block

const buildInfo = require('../buildinfo.json');

const service = location.protocol + '//' + location.host + location.pathname;

const apiBaseUri = '/RDConnect-UserManagement-API';

let config = {
	apiBaseUri: apiBaseUri,
	usersBaseUri: apiBaseUri + '/users',
	groupsBaseUri: apiBaseUri + '/groups',
	ouBaseUri: apiBaseUri + '/organizationalUnits',
	mailingBaseUri: apiBaseUri + '/mail',
	buildInfo: buildInfo,
};

config.getService = function() {
	return service;
};

config.composeUserURI = function(username) {
	return config.usersBaseUri + '/' + encodeURIComponent(username);
};

config.composeOrganizationalUnitURI = function(ou) {
	return config.ouBaseUri + '/' + encodeURIComponent(ou);
};

config.composeGroupURI = function(groupname) {
	return config.groupsBaseUri + '/' + encodeURIComponent(groupname);
};

config.composeGroupEndpointURI = function(groupname,endpoint) {
	return config.composeGroupURI(groupname) + '/' + encodeURIComponent(endpoint);
};


// Export a singleton
export default config;
