// The configuration block

var service = location.protocol + '//' + location.host + location.pathname;

function getService() {
	return service;
}

const apiBaseUri = '/RDConnect-UserManagement-API';

export default {
	apiBaseUri: apiBaseUri,
	usersBaseUri: apiBaseUri + '/users',
	groupsBaseUri: apiBaseUri + '/groups',
	ouBaseUri: apiBaseUri + '/organizationalUnits',
	getService: getService,
};
