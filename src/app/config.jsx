// The configuration block

var service = location.protocol + '//' + location.host + location.pathname;

function getService() {
	return service;
}

export default {
	apiBaseUri: '/RDConnect-UserManagement-API',
	getService: getService,
};
