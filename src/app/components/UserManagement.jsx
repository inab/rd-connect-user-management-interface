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
				
				let trace = 'createUser REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Sent: ',user,'Returned: ',jqXhr.responseText);
				trace += '\n\nSent:\n' + JSON.stringify(user) + '\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
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
				
				let trace = 'modifyUser REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Sent: ',user,'Returned: ',jqXhr.responseText);
				trace += '\n\nSent:\n' + JSON.stringify(user) + '\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	changeUserPasswordPromise(username,newPassword = undefined) {
		return new Promise((resolve,reject) => {
			let payload = ( newPassword !== undefined && newPassword.length > 0) ? {userPassword: newPassword} : {};
			jQuery.ajax({
				type: 'POST',
				url: config.composeUserURI(username) + '/resetPassword',
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				dataType: 'json',
				data: JSON.stringify(payload)
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to change password for user ' + username + '. ';
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
				
				let trace = 'changeUserPassword REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Returned: ',jqXhr.responseText);
				trace += '\n\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	removeUserPromise(username) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'DELETE',
				url: config.composeUserURI(username),
				headers: auth.getAuthHeaders(),
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to remove user ' + username + '. ';
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
				
				let trace = 'removeUser REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Returned: ',jqXhr.responseText);
				trace += '\n\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	renameUserPromise(username,newUsername) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeUserURI(username) + '/renamesTo/' + encodeURIComponent(newUsername),
				headers: auth.getAuthHeaders(),
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to rename user ' + username + ' to ' + newUsername + '. ';
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
				
				let trace = 'renameUser REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Returned: ',jqXhr.responseText);
				trace += '\n\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	migrateUserPromise(username,existingOrganizationalUnit) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeUserURI(username) + '/migratesTo/' + encodeURIComponent(existingOrganizationalUnit),
				headers: auth.getAuthHeaders(),
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to migrate user ' + username + ' to organizational unit ' + existingOrganizationalUnit + '. ';
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
				
				let trace = 'migrateUser REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Returned: ',jqXhr.responseText);
				trace += '\n\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
}

export default UserManagement;
