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
	
	getRawData(url,label,cb = undefined,ecb = undefined,isAuth = false,fresh = false,ttl = DEFAULT_TTL) {
		if(url in this.cache) {
			// Clean cache entries whenever it is needed
			let bestBefore = this.cache[url].bestBefore;
			if(!!fresh || bestBefore < Date.now()) {
				this.invalidateData(url);
			}
		}
		
		if(url in this.cache) {
			if(cb) {
				// As it is raw data, no clues about cloning it
				let data = this.cache[url].value;
				cb(data);
			}
			return null;
		} else {
			return this.loadData(url,'text',isAuth,label,ttl,cb,ecb);
		}
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
		.done((data) => {
			// Saving in the cache
			if(ttl && ttl > 0) {
				let bestBefore = Date.now() + ttl;
				let cachedElem = {
					bestBefore: bestBefore, 
					value: data
				};
				this.cache[url] = cachedElem;
			}
			if(cb) {
				let retData;
				if(dataType === 'text') {
					// Do not know how to properly clone it
					retData = data;
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
					responseText += 'Uncaught Error: ' + jqXhr.responseText;
					break;
			}
			console.error(responseText);
			if(ecb) {
				ecb({label: label, error: responseText, status: jqXhr.status});
			}
		});
		return request;
	}
}

const UMCacheSingleton = new UMCache();

export default UMCacheSingleton;
