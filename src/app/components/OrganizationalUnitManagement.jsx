import jQuery from 'jquery';
import config from 'config.jsx';
import auth from './auth.jsx';

class OrganizationalUnitManagement {
	constructor() {
	}
	
	createOrganizationalUnitPromise(organizationalUnitData) {
		//console.log('inside addMembersToGroup, members contains: ',formData.members);
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'PUT',
				url: config.ouBaseUri,
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				data: JSON.stringify(organizationalUnitData)
			})
			.done(resolve)
			.fail((jqXhr) => {
				//console.log('Failed to add members to Group ',jqXhr);
				let responseText = 'Failed to create organizational unit. ';
				switch(jqXhr.status) {
					case 0:
						responseText += 'Not connect: Verify Network.';
						break;
					case 404:
						responseText += 'Not found [404]';
						break;
					case 500:
						responseText += 'Internal Server Error [500].';
						break;
					case 'parsererror':
						responseText += 'Sent JSON parse failed.';
						break;
					case 'timeout':
						responseText += 'Time out error.';
						break;
					case 'abort':
						responseText += 'Ajax request aborted.';
						break;
					default:
						responseText += 'Uncaught Error: ' + jqXhr.responseText;
						break;
				}
				
				let trace = 'createOrganizationalUnit REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Sent',organizationalUnitData,'Returned: ',jqXhr.responseText);
				trace += '\n\nSent:\n' + JSON.stringify(organizationalUnitData) + '\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	modifyOrganizationalUnitPromise(ouName,ou) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeOrganizationalUnitURI(ouName),
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				data: JSON.stringify(ou)
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to modify organizational unit ' + ouName + '. ';
				switch(jqXhr.status) {
					case 0:
						responseText += 'Not connect: Verify Network.';
						break;
					case 404:
						responseText += 'Not found [404]';
						break;
					case 500:
						responseText += 'Internal Server Error [500].';
						break;
					case 'parsererror':
						responseText += 'Sent JSON parse failed.';
						break;
					case 'timeout':
						responseText += 'Time out error.';
						break;
					case 'abort':
						responseText = 'Ajax request aborted.';
						break;
					default:
						responseText = 'Uncaught Error: ' + jqXhr.responseText;
						break;
				}
				
				let trace = 'modifyOrganizationalUnit REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Sent',ou,'Returned: ',jqXhr.responseText);
				trace += '\n\nSent:\n' + JSON.stringify(ou) + '\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	renameOrganizationalUnitPromise(ouName,newOuName) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeOrganizationalUnitURI(ouName) + '/renamesTo/' + encodeURIComponent(newOuName),
				headers: auth.getAuthHeaders(),
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to rename organizational unit ' + ouName + ' to ' + newOuName + '. ';
				//console.log('Failed to change user password',jqXhr.responseText);
				switch(jqXhr.status) {
					case 0:
						responseText += 'Not connect: Verify Network.';
						break;
					case 401:
						responseText += 'You do not have enough privileges [401]';
						break;
					case 404:
						responseText += 'Not found [404]';
						break;
					case 500:
						responseText += 'Internal Server Error [500].';
						break;
					case 'parsererror':
						responseText += 'Sent JSON parse failed.';
						break;
					case 'timeout':
						responseText += 'Time out error.';
						break;
					case 'abort':
						responseText = 'Ajax request aborted.';
						break;
					default:
						responseText = 'Uncaught Error: ' + jqXhr.responseText;
						break;
				}
				
				let trace = 'renameOrganizationalUnit REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Returned: ',jqXhr.responseText);
				trace += '\n\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	mergeOrganizationalUnitPromise(ouName,existingOuName) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeOrganizationalUnitURI(ouName) + '/mergesTo/' + encodeURIComponent(existingOuName),
				headers: auth.getAuthHeaders(),
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to merge organizational ' + ouName + ' into ' + existingOuName + '. ';
				//console.log('Failed to change user password',jqXhr.responseText);
				switch(jqXhr.status) {
					case 0:
						responseText += 'Not connect: Verify Network.';
						break;
					case 401:
						responseText += 'You do not have enough privileges [401]';
						break;
					case 404:
						responseText += 'Not found [404]';
						break;
					case 500:
						responseText += 'Internal Server Error [500].';
						break;
					case 'parsererror':
						responseText += 'Sent JSON parse failed.';
						break;
					case 'timeout':
						responseText += 'Time out error.';
						break;
					case 'abort':
						responseText = 'Ajax request aborted.';
						break;
					default:
						responseText = 'Uncaught Error: ' + jqXhr.responseText;
						break;
				}
				
				let trace = 'mergeOrganizationalUnit REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Returned: ',jqXhr.responseText);
				trace += '\n\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
}

export default OrganizationalUnitManagement;
