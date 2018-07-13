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
				
				reject({ modalTitle: 'Error', error: responseText});
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
				
				reject({ modalTitle: 'Error', error: responseText});
			});
		});
	}
}

export default OrganizationalUnitManagement;
