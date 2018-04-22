import jQuery from 'jquery';
import config from 'config.jsx';
import auth from './auth.jsx';

class GroupManagement {
	constructor() {
	}
	
	createGroup(group,cb,ecb) {
		//console.log('inside addMembersToGroup, members contains: ',formData.members);
		return jQuery.ajax({
			type: 'PUT',
			url: config.groupsBaseUri,
			headers: auth.getAuthHeaders(),
			contentType: 'application/json',
			data: JSON.stringify(group)
		})
		.done(cb)
		.fail((jqXhr) => {
			//console.log('Failed to add members to Group ',jqXhr);
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
			
			if(ecb) {
				ecb({ modalTitle: 'Error', error: responseText});
			}
		});
	}
	
	modifyGroup(groupname,group,cb,ecb) {
		//console.log('inside addMembersToGroup, members contains: ',formData.members);
		return jQuery.ajax({
			type: 'POST',
			url: config.groupsBaseUri + '/' + encodeURIComponent(groupname),
			headers: auth.getAuthHeaders(),
			contentType: 'application/json',
			data: JSON.stringify(group)
		})
		.done(cb)
		.fail((jqXhr) => {
			//console.log('Failed to add members to Group ',jqXhr);
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
			
			if(ecb) {
				ecb({ modalTitle: 'Error', error: responseText});
			}
		});
	}
	
	removeUsersFromGroup(groupname, usersToRemove, endpoint, cb,ecb) {
		//console.log('inside addMembersToGroup, members contains: ',formData.members);
		return jQuery.ajax({
			type: 'DELETE',
			url: config.groupsBaseUri + '/' + encodeURIComponent(groupname) + '/' + endpoint,
			headers: auth.getAuthHeaders(),
			contentType: 'application/json',
			data: JSON.stringify(usersToRemove)
		})
		.done(cb)
		.fail((jqXhr) => {
			//console.log('Failed to add members to Group ',jqXhr);
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
			
			if(ecb) {
				ecb({ modalTitle: 'Error', error: responseText});
			}
		});
	}
	
	removeMembersFromGroup(groupname, membersToRemove,cb,ecb) {
		return this.removeUsersFromGroup(groupname,membersToRemove,'members',cb,ecb);
	}
	
	removeOwnersFromGroup(groupname, ownersToRemove,cb,ecb) {
		return this.removeUsersFromGroup(groupname,ownersToRemove,'owners',cb,ecb);
	}
	
	addUsersToGroup(groupname, usersToAdd, endpoint, cb,ecb) {
		//console.log('inside addMembersToGroup, members contains: ',formData.members);
		return jQuery.ajax({
			type: 'POST',
			url: config.groupsBaseUri + '/' + encodeURIComponent(groupname) + '/' + endpoint,
			headers: auth.getAuthHeaders(),
			contentType: 'application/json',
			data: JSON.stringify(usersToAdd)
		})
		.done(cb)
		.fail((jqXhr) => {
			//console.log('Failed to add members to Group ',jqXhr);
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
			
			if(ecb) {
				ecb({ modalTitle: 'Error', error: responseText});
			}
		});
	}
	
	addMembersToGroup(groupname, membersToAdd,cb,ecb) {
		return this.addUsersToGroup(groupname,membersToAdd,'members',cb,ecb);
	}
	
	addOwnersToGroup(groupname, ownersToAdd,cb,ecb) {
		return this.addUsersToGroup(groupname,ownersToAdd,'owners',cb,ecb);
	}
}

export default GroupManagement;
