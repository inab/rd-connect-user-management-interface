import jQuery from 'jquery';
import config from 'config.jsx';
import auth from './auth.jsx';

class GroupManagement {
	constructor() {
	}
	
	createGroupPromise(group) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'PUT',
				url: config.groupsBaseUri,
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				data: JSON.stringify(group)
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to create group. ';
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
				
				let trace = 'createGroup REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Sent: ',group,'Returned: ',jqXhr.responseText);
				trace += '\n\nSent:\n' + JSON.stringify(group) + '\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	modifyGroupPromise(groupname,group) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeGroupURI(groupname),
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				data: JSON.stringify(group)
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to modify group ' + groupname + '. ';
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
				
				let trace = 'modifyGroup REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Sent: ',group,'Returned: ',jqXhr.responseText);
				trace += '\n\nSent:\n' + JSON.stringify(group) + '\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	removeUsersFromGroupPromise(groupname, usersToRemove, endpoint) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'DELETE',
				url: config.composeGroupEndpointURI(groupname,endpoint),
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				data: JSON.stringify(usersToRemove)
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to remove ' + endpoint + ' from group ' + groupname + '. ';
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
				
				let trace = 'removeUsersFromGroup REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Sent: ',usersToRemove,'Returned: ',jqXhr.responseText);
				trace += '\n\nSent:\n' + JSON.stringify(usersToRemove) + '\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	removeMembersFromGroupPromise(groupname, membersToRemove) {
		return this.removeUsersFromGroupPromise(groupname,membersToRemove,'members');
	}
	
	removeOwnersFromGroupPromise(groupname, ownersToRemove) {
		return this.removeUsersFromGroupPromise(groupname,ownersToRemove,'owners');
	}
	
	addUsersToGroupPromise(groupname, usersToAdd, endpoint) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeGroupEndpointURI(groupname,endpoint),
				headers: auth.getAuthHeaders(),
				contentType: 'application/json',
				data: JSON.stringify(usersToAdd)
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to add ' + endpoint + ' to group ' + groupname + '. ';
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
				
				let trace = 'addUsersToGroup REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Sent: ',usersToAdd,'Returned: ',jqXhr.responseText);
				trace += '\n\nSent:\n' + JSON.stringify(usersToAdd) + '\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	addMembersToGroupPromise(groupname, membersToAdd) {
		return this.addUsersToGroupPromise(groupname,membersToAdd,'members');
	}
	
	addOwnersToGroupPromise(groupname, ownersToAdd) {
		return this.addUsersToGroupPromise(groupname,ownersToAdd,'owners');
	}
	
	removeGroupPromise(groupname) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'DELETE',
				url: config.composeGroupURI(groupname),
				headers: auth.getAuthHeaders(),
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to remove group ' + groupname + '. ';
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
				
				let trace = 'removeGroup REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Returned: ',jqXhr.responseText);
				trace += '\n\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	renameGroupPromise(groupname,newGroupname) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeGroupURI(groupname) + '/renamesTo/' + encodeURIComponent(newGroupname),
				headers: auth.getAuthHeaders(),
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to rename group ' + groupname + ' to ' + newGroupname + '. ';
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
				
				let trace = 'renameGroup REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Returned: ',jqXhr.responseText);
				trace += '\n\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
	
	mergeGroupPromise(groupname,existingGroupname) {
		return new Promise((resolve,reject) => {
			jQuery.ajax({
				type: 'POST',
				url: config.composeGroupURI(groupname) + '/mergesTo/' + encodeURIComponent(existingGroupname),
				headers: auth.getAuthHeaders(),
			})
			.done(resolve)
			.fail((jqXhr) => {
				let responseText = 'Failed to merge group ' + groupname + ' into ' + existingGroupname + '. ';
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
				
				let trace = 'mergeGroup REST Error (status ' + jqXhr.status + '): ' + responseText;
				console.log(trace);
				console.log('Returned: ',jqXhr.responseText);
				trace += '\n\nReturned:\n' + jqXhr.responseText;
				reject({ modalTitle: 'Error', error: responseText, trace: trace});
			});
		});
	}
}

export default GroupManagement;
