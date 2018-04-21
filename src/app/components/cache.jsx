import jQuery from 'jquery';
//import config from 'config.jsx';
//import auth from './auth.jsx';

// Default TTL in milliseconds
const DEFAULT_TTL = 60 * 1000;

class UMCache {
	constructor() {
		this.cache = {};
	}
	
	getData(url,label,cb = undefined,ecb = undefined,fresh = false,ttl = DEFAULT_TTL) {
		if(url in this.cache) {
			// Clean cache entries whenever it is needed
			let bestBefore = this.cache[url].bestBefore;
			if(!!fresh || bestBefore < Date.now()) {
				delete this.cache[url];
			}
		}
		
		if(url in this.cache) {
			if(cb) {
				// Do now allow changes on the cached data
				let data = this.cache[url].value;
				cb((data instanceof Array) ? [...data] : {...data});
			}
			return null;
		} else {
			return this.loadData(url,label,ttl,cb,ecb);
		}
	}
	
	loadData(url,label,ttl,cb,ecb) {
		let request = jQuery.ajax({
			url: url,
			type: 'GET',
			cache: false,
			dataType: 'json',
		})
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
				// Do now allow changes on the cached data
				cb((data instanceof Array) ? [...data] : {...data});
			}
		})
		.fail((jqXhr, textStatus, errorThrown) => {
			//console.log('Failed to retrieve user Information',jqXhr);
			let responseText = '';
			switch(jqXhr.status) {
				case 0:
					responseText = 'Failed to retrieve ' + label + ' Information. Not connect: Verify Network.';
					break;
				case 404:
					responseText = 'Failed to retrieve ' + label + ' Information. Requested User not found [404]';
					break;
				case 500:
					responseText = 'Failed to retrieve ' + label + ' Information. Internal Server Error [500].';
					break;
				case 'parsererror':
					responseText = 'Failed to retrieve ' + label + ' Information. Requested JSON parse failed.';
					break;
				case 'timeout':
					responseText = 'Failed to retrieve ' + label + ' Information. Time out error.';
					break;
				case 'abort':
					responseText = 'Failed to retrieve ' + label + ' Information. Ajax request aborted.';
					break;
				default:
					responseText = 'Failed to retrieve ' + label + ' Information. Uncaught Error: ' + jqXhr.responseText;
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
