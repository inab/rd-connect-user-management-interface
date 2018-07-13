import jQuery from 'jquery';
import config from 'config.jsx';
import auth from './auth.jsx';

class UserManagement {
	constructor() {
	}
	
	createUserPromise(user) {
		//console.log('inside addMembersToGroup, members contains: ',formData.members);
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'PUT',
				url: config.usersBaseUri,
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				data: JSON.stringify(user)
			})
			.done(resolve)
			.fail((jqXhr) => {
				//console.log('Failed to add members to Group ',jqXhr);
				let responseText = 'Failed to create user. ';
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
	
	modifyUserPromise(username,user) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeUserURI(username),
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				data: JSON.stringify(user)
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to modify user ' + username + '. ';
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

export default UserManagement;
