import jQuery from 'jquery';
//import config from 'config.jsx';
import auth from './auth.jsx';

// Default TTL in milliseconds
const DEFAULT_TTL = 60 * 1000;

class UMCache {
	constructor() {
		this.cache = {};
	}
	
	invalidateData(url) {
		delete this.cache[url];
	}
	
	getDataPromise(url,label,registerRequest = undefined,isAuth = false,fresh = false,ttl = DEFAULT_TTL) {
		return new Promise((resolve,reject) => {
			if(url in this.cache) {
				// Clean cache entries whenever it is needed
				let bestBefore = this.cache[url].bestBefore;
				if(!!fresh || bestBefore < Date.now()) {
					this.invalidateData(url);
				}
			}
			
			if(url in this.cache) {
				let data = this.cache[url].value;
				// Do now allow changes on the cached data
				resolve(JSON.parse(JSON.stringify(data)));
			} else {
				resolve(this.loadDataPromise(url,'json',registerRequest,isAuth,label,ttl));
			}
		});
	}
	
	getData(url,label,cb = undefined,ecb = undefined,isAuth = false,fresh = false,ttl = DEFAULT_TTL) {
		if(url in this.cache) {
			// Clean cache entries whenever it is needed
			let bestBefore = this.cache[url].bestBefore;
			if(!!fresh || bestBefore < Date.now()) {
				this.invalidateData(url);
			}
		}
		
		if(url in this.cache) {
			if(cb) {
				// Do now allow changes on the cached data
				let data = this.cache[url].value;
				cb(JSON.parse(JSON.stringify(data)));
			}
			return null;
		} else {
			return this.loadData(url,'json',isAuth,label,ttl,cb,ecb);
		}
	}
	
	getRawDataPromise(url,label,registerRequest = undefined,isAuth = false,fresh = false,ttl = DEFAULT_TTL) {
		return new Promise((resolve,reject) => {
			if(url in this.cache) {
				// Clean cache entries whenever it is needed
				let bestBefore = this.cache[url].bestBefore;
				if(!!fresh || bestBefore < Date.now()) {
					this.invalidateData(url);
				}
			}
			
			if(url in this.cache) {
				// As it is raw data, no clues about cloning it
				let data = this.cache[url].value;
				resolve({
					content: data,
					mime: this.cache[url].mime
				});
			} else {
				resolve(this.loadDataPromise(url,'text',registerRequest,isAuth,label,ttl));
			}
		});
	}
	
	loadDataPromise(url,dataType,registerRequest,isAuth,label,ttl) {
		return new Promise((resolve,reject) => {
			let request = this.loadData(url,dataType,isAuth,label,ttl,resolve,reject);
			
			// Registering the request, if it is needed
			if(registerRequest) {
				registerRequest(request);
			}
		});
	}
	
	loadData(url,dataType,isAuth,label,ttl,cb,ecb) {
		let query = {
			url: url,
			type: 'GET',
			cache: false,
			dataType: dataType,
		};
		if(isAuth) {
			query.headers = auth.getAuthHeaders();
		}
		
		let request = jQuery.ajax(query)
		.done((data, textStatus, jqXHR) => {
			// Saving in the cache
			let mime = jqXHR.getResponseHeader('Content-Type');
			let semiPos = mime.indexOf(';');
			if(semiPos >= 0) {
				mime = mime.substr(0,semiPos);
			}
			if(ttl && ttl > 0) {
				let bestBefore = Date.now() + ttl;
				let cachedElem = {
					bestBefore: bestBefore,
					mime: mime,
					value: data
				};
				this.cache[url] = cachedElem;
			}
			if(cb) {
				let retData;
				if(dataType === 'text') {
					// Do not know how to properly clone it
					retData = {
						content: data,
						mime: mime
					};
				} else {
					// Do now allow changes on the clonable cached data
					retData = JSON.parse(JSON.stringify(data));
				}
				cb(retData);
			}
		})
		.fail((jqXhr, textStatus, errorThrown) => {
			//console.log('Failed to retrieve user Information',jqXhr);
			let responseText = 'Failed to retrieve ' + label + ' Information. ';
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
					responseText += 'Uncaught Error (' + jqXhr.status + '): ' + jqXhr.responseText;
					break;
			}
			console.error('ERROR',errorThrown,responseText);
			if(ecb) {
				ecb({label: label, error: responseText, status: jqXhr.status});
			}
		});
		return request;
	}
}

const UMCacheSingleton = new UMCache();

export default UMCacheSingleton;
