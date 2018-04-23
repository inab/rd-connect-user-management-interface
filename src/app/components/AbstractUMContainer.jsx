import React from 'react';
import config from 'config.jsx';
import cache from './cache.jsx';
import jQuery from 'jquery';
import auth from 'components/auth.jsx';

// The schemas are not going to change, so cache them harder
const DEFAULT_SCHEMA_CACHE_TTL = 60 * 60 * 1000;

class AbstractFetchedDataContainer extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.requests = [];
		this.onChange = this.onChange.bind(this);
	}

	componentWillMount() {
		this.setState({
			schemas: {},
			users: [],
			organizationalUnits: [],
			groups: [],
			selectableUsers: [],
			selectableOUs: [],
			selectableGroups: [],
		});
	}
	
	componentWillUnmount() {
		this.abortPendingRequests();
	}
	
	onChange(e) {
		this.setState(e);
	}
	
	abortPendingRequests() {
		this.requests.forEach(request => {
			if(request) {
				request.abort();
			}
		});
	}
	
	registerRequest(request) {
		this.requests.push(request);
	}
	
	loadUsersSchema(cb,ecb = undefined) {
		// https://stackoverflow.com/questions/34956479/how-do-i-setstate-for-nested-array
		let request;
		request = cache.getData(config.usersBaseUri + '?schema','users JSON schema',(usersSchema) => {
			this.onChange((prevState) => {
				return {
					schemas: {
						...prevState.schemas,
						users: usersSchema
					}
				};
			});
			if(cb) {
				cb(usersSchema);
			}
		},(errMsg) => {
			console.error('Unable to load users schema');
			if(ecb) {
				ecb(errMsg);
			}
		},false,false,DEFAULT_SCHEMA_CACHE_TTL);
		this.registerRequest(request);
	}
	
	loadUsers(cb,ecb = undefined) {
		let request;
		request = cache.getData(config.usersBaseUri,'users',(users) => {
			this.onChange({users: users});
			if(cb) {
				cb(users);
			}
		},(errMsg) => {
			console.error('Unable to load users');
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadUser(username,cb,ecb = undefined) {
		let request;
		request = cache.getData(config.usersBaseUri + '/' + encodeURIComponent(username),'user ' + username,(user) => {
			if(cb) {
				cb(user);
			}
		},(errMsg) => {
			console.error('Unable to load user ' + username);
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadOrganizationalUnitsSchema(cb,ecb = undefined) {
		// https://stackoverflow.com/questions/34956479/how-do-i-setstate-for-nested-array
		let request;
		request = cache.getData(config.ouBaseUri + '?schema','organizational units schema',(ouSchema) => {
			this.onChange((prevState) => {
				return {
					schemas: {
						...prevState.schemas,
						organizationalUnits: ouSchema
					}
				};
			});
			if(cb) {
				cb(ouSchema);
			}
		},(errMsg) => {
			console.error('Unable to load organizations schema');
			if(ecb) {
				ecb(errMsg);
			}
		},false,false,DEFAULT_SCHEMA_CACHE_TTL);
		this.registerRequest(request);
	}
	
	loadOrganizationalUnits(cb,ecb = undefined) {
		let request;
		request = cache.getData(config.ouBaseUri,'organizational units',(organizationalUnits) => {
			this.onChange({organizationalUnits: organizationalUnits});
			if(cb) {
				cb(organizationalUnits);
			}
		},(errMsg) => {
			console.error('Unable to load organizations');
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadOrganizationalUnit(ou,cb,ecb = undefined) {
		let request;
		request = cache.getData(config.ouBaseUri + '/' + encodeURIComponent(ou),'organizational unit ' + ou,(organizationalUnit) => {
			if(cb) {
				cb(organizationalUnit);
			}
		},(errMsg) => {
			console.error('Unable to load organization ' + ou);
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadGroupsSchema(cb,ecb = undefined) {
		// https://stackoverflow.com/questions/34956479/how-do-i-setstate-for-nested-array
		let request;
		request = cache.getData(config.groupsBaseUri + '?schema','groups schema',(groupsSchema) => {
			this.onChange((prevState) => {
				return {
					schemas: {
						...prevState.schemas,
						groups: groupsSchema
					}
				};
			});
			if(cb) {
				cb(groupsSchema);
			}
		},(errMsg) => {
			console.error('Unable to load groups schema');
			if(ecb) {
				ecb(errMsg);
			}
		},false,false,DEFAULT_SCHEMA_CACHE_TTL);
		this.registerRequest(request);
	}
	
	loadGroups(cb,ecb = undefined) {
		let request;
		request = cache.getData(config.groupsBaseUri,'groups',(groups) => {
			this.onChange({groups: groups});
			if(cb) {
				cb(groups);
			}
		},(errMsg) => {
			console.error('Unable to load groups');
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadGroup(groupname,cb,ecb = undefined) {
		let request;
		request = cache.getData(config.groupsBaseUri + '/' + groupname,'group ' + groupname,(group) => {
			if(cb) {
				cb(group);
			}
		},(errMsg) => {
			console.error('Unable to load group ' + groupname);
			if(ecb) {
				ecb(errMsg);
			}
		});
		this.registerRequest(request);
	}
	
	loadSelectableUsers(cb = undefined,ecb = undefined) {
		this.loadUsers((users) => {
			let selectableUsers = users.map((user) => {
				return {
					label: user.cn + ' (' + user.organizationalUnit + ')',
					value: user.username
				};
			});
			this.onChange({ selectableUsers: selectableUsers });
			
			if(cb) {
				cb(selectableUsers);
			}
		},ecb);
	}
	
	loadSelectableOrganizationalUnits(cb = undefined,ecb = undefined) {
		this.loadOrganizationalUnits((organizationalUnits) => {
			let selectableOUs = organizationalUnits.map((ou) => {
				return {
					label: ou.description + ' (' + ou.organizationalUnit + ')',
					value: ou.organizationalUnit
				};
			});
			this.onChange({ selectableOUs: selectableOUs });
			
			if(cb) {
				cb(selectableOUs);
			}
		},ecb);
	}
	
	loadSelectableGroups(cb = undefined,ecb = undefined) {
		this.loadGroups((groups) => {
			let selectableGroups = groups.map((group) => {
				return {
					label: group.description + ' (' + group.cn + ')',
					value: group.cn
				};
			});
			this.onChange({ selectableGroups: selectableGroups });
			
			if(cb) {
				cb(selectableGroups);
			}
		},ecb);
	}
	
	listDocuments(docsBaseURI,label,cb,ecb = undefined) {
		let request;
		request = cache.getData(docsBaseURI + '/documents','docs-' + label,(listDocuments) => {
			if(cb) {
				cb(listDocuments);
			}
		},(errMsg) => {
			console.error('Unable to load document list from ' + docsBaseURI);
			if(ecb) {
				ecb(errMsg);
			}
		},true);
		this.registerRequest(request);
	}
	
	getDocument(docsBaseURI,documentName,label,cb,ecb = undefined) {
		let request;
		request = cache.getRawData(docsBaseURI + '/documents/' + documentName,'doc-' + label + '-' + documentName,(document) => {
			if(cb) {
				cb(document);
			}
		},(errMsg) => {
			console.error('Unable to get document ' + documentName + ' from ' + docsBaseURI);
			if(ecb) {
				ecb(errMsg);
			}
		},true);
		this.registerRequest(request);
	}
	
	overwriteDocument(docsBaseURI,documentName,content,mime,label,cb,ecb = undefined) {
		let fullLabel = 'doc-' + label + '-' + documentName;
		let query = {
			url: docsBaseURI + '/documents/' + documentName,
			type: 'PUT',
			cache: false,
			contentType: mime,
			data: content,
			dataType: 'text',
			headers: auth.getAuthHeaders()
		};
		
		let request = jQuery.ajax(query)
		.done((data) => {
			if(cb) {
				cb(data);
			}
		})
		.fail((jqXhr, textStatus, errorThrown) => {
			//console.log('Failed to retrieve user Information',jqXhr);
			let responseText = 'Failed to put ' + fullLabel + ' Information. ';
			switch(jqXhr.status) {
				case 0:
					responseText += 'Not connect: Verify Network.';
					break;
				case 404:
					responseText += 'Requested User not found [404]';
					break;
				case 500:
					responseText += 'Internal Server Error [500].';
					break;
				case 'parsererror':
					responseText += 'Requested JSON parse failed.';
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
			console.error(responseText);
			if(ecb) {
				ecb({label: label, error: responseText, status: jqXhr.status});
			}
		});
		
		this.registerRequest(request);
	}
	
	listTemplateDocuments(cb,ecb) {
			this.listDocuments(config.mailingBaseUri + '/newUser','newUserTemplates',cb,ecb);
	}
	
	getTemplateMail(cb,ecb) {
		this.listTemplateDocuments((files) => {
			var noTemplate = true;
			files.forEach(file => {
				if(file.documentClass === 'mailTemplate') {
					noTemplate = false;
					
					this.getDocument(config.mailingBaseUri + '/newUser',file.cn,'newUserTemplates',cb,ecb);
				}
			});
			// Report no template was available
			if(noTemplate) {
				ecb({label:'noTemplate',error:'There was no template available',status:-1});
			}
		},ecb);
	}
	
	saveTemplateMail(mailTemplate,cb,ecb) {
		this.listTemplateDocuments((files) => {
			var noTemplate = true;
			files.forEach(file => {
				if(file.documentClass === 'mailTemplate') {
					noTemplate = false;
					
					this.overwriteDocument(config.mailingBaseUri + '/newUser',file.cn,mailTemplate,'text/html','newUserTemplates',cb,ecb);
				}
			});
			// Report no template was available
			if(noTemplate) {
				ecb({label:'noTemplate',error:'There was no template available',status:-1});
			}
		},ecb);
	}
}

export default AbstractFetchedDataContainer;
