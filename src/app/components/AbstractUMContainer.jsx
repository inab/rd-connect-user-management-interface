import React from 'react';
import config from 'config.jsx';
import cache from './cache.jsx';
import jQuery from 'jquery';
import auth from 'components/auth.jsx';

// The schemas are not going to change, so cache them harder
const DEFAULT_SCHEMA_CACHE_TTL = 60 * 60 * 1000;
const DEFAULT_TEMPLATE_DOMAINS_CACHE_TTL = DEFAULT_SCHEMA_CACHE_TTL;

class AbstractFetchedDataContainer extends React.Component {
	constructor(props,context) {
		super(props,context);
		this.requests = [];
		this.onChange = this.onChange.bind(this);
		this.registerRequest = this.registerRequest.bind(this);
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
			request.abort();
		});
	}
	
	registerRequest(request) {
		if(request) {
			this.requests.push(request);
		}
	}
	
	usersSchemaPromise() {
		// https://stackoverflow.com/questions/34956479/how-do-i-setstate-for-nested-array
		
		return new Promise((resolve,reject) => {
			// It is not being returned through resolve or reject
			// because we want to call them after all the content
			cache.getDataPromise(
				config.usersBaseUri + '?schema',
				'users JSON schema',
				this.registerRequest,
				false,
				false,
				DEFAULT_SCHEMA_CACHE_TTL
			).then((usersSchema) => {
				this.onChange((prevState) => {
					return {
						schemas: {
							...prevState.schemas,
							users: usersSchema
						}
					};
				});
				
				resolve(usersSchema);
			},(errMsg) => {
				console.error('Unable to load users schema');
				
				reject(errMsg);
			});
		});
	}
	
	usersPromise() {
		return new Promise((resolve,reject) => {
			cache.getDataPromise(
				config.usersBaseUri,
				'users',
				this.registerRequest
			).then((users) => {
				resolve(users);
			},(errMsg) => {
				console.error('Unable to load users');
				
				reject(errMsg);
			});
		});
	}
	
	// The list of users is invalidated
	invalidateUsers() {
		cache.invalidateData(config.usersBaseUri);
	}
	
	userPromise(username) {
		return new Promise((resolve,reject) => {
			cache.getDataPromise(
				config.composeUserURI(username),
				'user ' + username,
				this.registerRequest
			).then((user) => {
				resolve(user);
			},(errMsg) => {
				console.error('Unable to load user ' + username);
				
				reject(errMsg);
			});
		});
	}
	
	// When a user is invalidated, the cache of all users should also be invalidated
	invalidateUser(username) {
		this.invalidateUsers();
		cache.invalidateData(config.composeUserURI(username));
	}
	
	organizationalUnitsSchemaPromise() {
		// https://stackoverflow.com/questions/34956479/how-do-i-setstate-for-nested-array
		
		return new Promise((resolve,reject) => {
			cache.getDataPromise(
				config.ouBaseUri + '?schema',
				'organizational units schema',
				this.registerRequest,
				false,
				false,
				DEFAULT_SCHEMA_CACHE_TTL
			).then((ouSchema) => {
				this.onChange((prevState) => {
					return {
						schemas: {
							...prevState.schemas,
							organizationalUnits: ouSchema
						}
					};
				});
				
				resolve(ouSchema);
			},(errMsg) => {
				console.error('Unable to load organizations schema');

				reject(errMsg);
			});
		});
	}
	
	organizationalUnitsPromise() {
		return new Promise((resolve,reject) => {
			cache.getDataPromise(
				config.ouBaseUri,
				'organizational units',
				this.registerRequest
			).then((organizationalUnits) => {
				this.onChange({organizationalUnits: organizationalUnits});
				
				resolve(organizationalUnits);
			},(errMsg) => {
				console.error('Unable to load organizations');
				
				reject(errMsg);
			});
		});
	}
	
	// The list of organizational units is invalidated
	invalidateOrganizationalUnits() {
		cache.invalidateData(config.ouBaseUri);
	}
	
	organizationalUnitPromise(ou) {
		return new Promise((resolve,reject) => {
			cache.getDataPromise(
				config.composeOrganizationalUnitURI(ou),
				'organizational unit ' + ou,
				this.registerRequest
			).then(resolve,(errMsg) => {
				console.error('Unable to load organization ' + ou);
				reject(errMsg);
			});
		});
	}
	
	// When an ou is invalidated, the cache of all ous should also be invalidated
	invalidateOrganizationalUnit(ou) {
		this.invalidateOrganizationalUnits();
		cache.invalidateData(config.composeOrganizationalUnitURI(ou));
	}
	
	groupsSchemaPromise() {
		// https://stackoverflow.com/questions/34956479/how-do-i-setstate-for-nested-array
		return new Promise((resolve,reject) => {
			cache.getDataPromise(
				config.groupsBaseUri + '?schema',
				'groups schema',
				this.registerRequest,
				false,
				false,
				DEFAULT_SCHEMA_CACHE_TTL
			).then((groupsSchema) => {
				this.onChange((prevState) => {
					return {
						schemas: {
							...prevState.schemas,
							groups: groupsSchema
						}
					};
				});
				
				resolve(groupsSchema);
			},(errMsg) => {
				console.error('Unable to load groups schema');
				reject(errMsg);
			});
		});
	}
	
	groupsPromise() {
		return new Promise((resolve,reject) => {
			cache.getDataPromise(
				config.groupsBaseUri,
				'groups',
				this.registerRequest
			).then((groups) => {
				this.onChange({groups: groups});
				
				resolve(groups);
			},(errMsg) => {
				console.error('Unable to load groups');
				
				reject(errMsg);
			});
		});
	}
	
	// The list of groups is invalidated
	invalidateGroups() {
		cache.invalidateData(config.groupsBaseUri);
	}
	
	groupPromise(groupname) {
		return new Promise((resolve,reject) => {
			cache.getDataPromise(
				config.composeGroupURI(groupname),
				'group ' + groupname,
				this.registerRequest
			).then((group) => {
				resolve(group);
			},(errMsg) => {
				console.error('Unable to load group ' + groupname);
				reject(errMsg);
			});
		});
	}
	
	// When a group is invalidated, the cache of all groups should also be invalidated
	invalidateGroup(groupname) {
		this.invalidateGroups();
		cache.invalidateData(config.composeGroupURI(groupname));
	}
	
	selectableUsersPromise() {
		return this.usersPromise()
			.then((users) => {
				let selectableUsers = users.map((user) => {
					return {
						label: user.cn + ' (' + user.organizationalUnit + ')',
						value: user.username
					};
				});
				this.onChange({ selectableUsers: selectableUsers });
				
				return selectableUsers;
			});
	}
	
	selectableOrganizationalUnitsPromise() {
		return this.organizationalUnitsPromise()
			.then((organizationalUnits) => {
				let selectableOUs = organizationalUnits.map((ou) => {
					return {
						label: ou.description + ' (' + ou.organizationalUnit + ')',
						value: ou.organizationalUnit
					};
				});
				this.onChange({ selectableOUs: selectableOUs });
				
				return selectableOUs;
			});
	}
	
	selectableGroupsPromise() {
		return this.groupsPromise()
			.then((groups) => {
				let selectableGroups = groups.map((group) => {
					return {
						label: group.description + ' (' + group.cn + ')',
						value: group.cn
					};
				});
				this.onChange({ selectableGroups: selectableGroups });
				
				return selectableGroups;
			});
	}
	
	listDocumentsPromise(docsBaseURI,label) {
		return new Promise((resolve,reject) => {
			cache.getDataPromise(
				docsBaseURI + '/documents',
				'docs-' + label,
				this.registerRequest,
				true
			).then(resolve,(errMsg) => {
				console.error('Unable to load document list from ' + docsBaseURI);
				
				reject(errMsg);
			});
		});
	}
	
	documentPromise(docsBaseURI,docDesc,label,asBlob = false) {
		return new Promise((resolve,reject) => {
			let documentName = typeof docDesc === 'string' ? docDesc : docDesc.cn;
			let documentURL = docsBaseURI + '/documents/' + documentName;
			
			let rawProm = cache.getRawDataPromise(
				documentURL,
				'doc-' + label + '-' + documentName,
				asBlob,
				this.registerRequest,
				true
			);
			
			let metaProm = typeof docDesc === 'string' ? cache.getDataPromise(
				documentURL + '/metadata',
				'doc-meta-' + label + '-' + documentName,
				this.registerRequest,
				true
			) : Promise.resolve(docDesc);
			
			Promise.all([rawProm,metaProm])
			.then((docMD) => {
				resolve({
					...docMD[1],
					...docMD[0]
				});
			},(errMsg) => {
				console.error('Unable to get document ' + documentName + ' from ' + docsBaseURI);
				
				reject(errMsg);
			});
		});
	}
	
	deleteDocumentPromise(docsBaseURI,docDesc,label) {
		return new Promise((resolve,reject) => {
			let documentName = typeof docDesc === 'string' ? docDesc : docDesc.cn;
			let fullLabel = 'doc-' + label + '-' + documentName;
			let query = {
				url: docsBaseURI + '/documents/' + documentName,
				type: 'DELETE',
				cache: false,
				processData: false,
				//dataType: 'text',
				headers: auth.getAuthHeaders()
			};
			
			// The cached document must be invalidated,
			// so it is got fresh on next try
			cache.invalidateData(query.url);
			
			let request = jQuery.ajax(query)
			.done((data) => {
				resolve(data);
			})
			.fail((jqXhr, textStatus, errorThrown) => {
				//console.log('Failed to retrieve user Information',jqXhr);
				let responseText = 'Failed to remove ' + fullLabel + ' Information. ';
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
				reject({label: label, error: responseText, status: jqXhr.status});
			});
			
			this.registerRequest(request);
		});
	}
	
	// This is one of the few methods which is not going to be translated to the promises system
	overwriteDocument(docsBaseURI,documentName,content,mime,label,cb,ecb = undefined) {
		let fullLabel = 'doc-' + label + '-' + documentName;
		let query = {
			url: docsBaseURI + '/documents/' + documentName,
			type: 'PUT',
			cache: false,
			contentType: mime,
			data: content,
			processData: false,
			//dataType: 'text',
			headers: auth.getAuthHeaders()
		};
		
		// The cached document must be invalidated,
		// so it is got fresh on next try
		cache.invalidateData(query.url);
		
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
	
	overwriteDocumentMetadata(docsBaseURI,documentName,docMeta,label,cb,ecb = undefined) {
		let fullLabel = 'doc-' + label + '-' + documentName;
		let query = {
			url: docsBaseURI + '/documents/' + documentName + '/metadata',
			type: 'POST',
			cache: false,
			contentType: 'application/json',
			data: JSON.stringify(docMeta),
			headers: auth.getAuthHeaders()
		};
		
		// The cached document must be invalidated,
		// so it is got fresh on next try
		cache.invalidateData(query.url);
		
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
	
	overwriteDocumentPromise(docsBaseURI,file,label) {
		/*
		return new Promise.all([
			new Promise((resolve,reject) => {
				this.overwriteDocument(docsBaseURI,file.cn,file.content,file.mime,label,resolve,reject);
			})
			,
			new Promise((resolve,reject) => {
				this.overwriteDocumentMetadata(docsBaseURI,file.cn,file.meta,label,resolve,reject);
			})
		]);
		*/
		return new Promise((resolve,reject) => {
			this.overwriteDocument(docsBaseURI,file.cn,file.content,file.mime,label,resolve,reject);
		});
	}
	
	templateDocumentsPromise(domainId) {
		return this.listDocumentsPromise(config.mailingBaseUri + '/' + encodeURIComponent(domainId),domainId + 'Templates');
	}
	
	templateDomainsPromise() {
		return new Promise((resolve,reject) => {
			// It is not being returned through resolve or reject
			// because we want to call them after all the content
			cache.getDataPromise(
				config.mailingBaseUri,
				'Mail template domains',
				this.registerRequest,
				false,
				false,
				DEFAULT_TEMPLATE_DOMAINS_CACHE_TTL
			).then(resolve,(errMsg) => {
				console.error('Unable to load mail template domains');
				
				reject(errMsg);
			});
		});
	}
	
	templateDomainPromise(apiKey) {
		return new Promise((resolve,reject) => {
			// It is not being returned through resolve or reject
			// because we want to call them after all the content
			cache.getDataPromise(
				config.mailingBaseUri + '/' + encodeURIComponent(apiKey),
				'Mail template domain ' + apiKey,
				this.registerRequest,
				false,
				false,
				DEFAULT_TEMPLATE_DOMAINS_CACHE_TTL
			).then(resolve,(errMsg) => {
				console.error('Unable to load mail template domain ' + apiKey);
				
				reject(errMsg);
			});
		});
	}
	
	templateMailPromise(domainId,files) {
		return new Promise((resolve,reject) => {
			let templatePromise;
			let promArray = [];
			
			let docPath = config.mailingBaseUri + '/' + encodeURIComponent(domainId);
			let docLabel = domainId + 'Templates';
			
			files.forEach(file => {
				if(file.documentClass === 'mailTemplate') {
					templatePromise = this.documentPromise(docPath,file,docLabel);
				} else {
					promArray.push(
						this.documentPromise(docPath,file,docLabel,true)
					);
				}
			});
			// Report no template was available
			if(templatePromise) {
				let wholeP = [ templatePromise ];
				if(promArray.length > 0) {
					wholeP.push(Promise.all(promArray));
				}
				resolve(Promise.all(wholeP));
			} else {
				reject({label:'noTemplate',error:'There was no template available in domain ' + domainId,status:-1});
			}
		});
	}

	deleteTemplateAttachmentsPromise(domainId,files) {
		let docPath = config.mailingBaseUri + '/' + encodeURIComponent(domainId);
		let docLabel = domainId + 'Templates';
		
		let promArray = files.map(file => {
			return this.deleteDocumentPromise(docPath,file,docLabel);
		});
		
		return Promise.all(promArray);
	}
	
	saveTemplateMailPromise(domainId,mailTemplateFile,mailTemplateAttachments) {
		return new Promise((resolve,reject) => {
			let files = [mailTemplateFile,...mailTemplateAttachments];
			let promArray = [];
			
			let docPath = config.mailingBaseUri + '/' + encodeURIComponent(domainId);
			let docLabel = domainId + 'Templates';
			
			files.forEach(file => {
				promArray.push(
					this.overwriteDocumentPromise(docPath,file,docLabel)
				);
			});
			// Report no template was available
			if(promArray.length > 0) {
				resolve(Promise.all(promArray));
			} else {
				reject({label:'noTemplate',error:'There was no template available in domain ' + domainId,status:-1});
			}
		});
	}
}

export default AbstractFetchedDataContainer;
