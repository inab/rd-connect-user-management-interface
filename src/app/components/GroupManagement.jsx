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
				
				reject({ modalTitle: 'Error', error: responseText});
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
				
				reject({ modalTitle: 'Error', error: responseText});
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
				
				reject({ modalTitle: 'Error', error: responseText});
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
				
				reject({ modalTitle: 'Error', error: responseText});
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
				
				reject({ modalTitle: 'Error', error: responseText});
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
				
				reject({ modalTitle: 'Error', error: responseText});
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
				let responseText = 'Failed to rename group ' + groupname + ' to ' + existingGroupname + '. ';
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
				
				reject({ modalTitle: 'Error', error: responseText});
			});
		});
	}
}

export default GroupManagement;
