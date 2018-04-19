import jQuery from 'jquery';
import config from 'config.jsx';
//import auth from './auth.jsx';

// Default TTL in milliseconds
const DEFAULT_TTL = 60*1000;

class UMCache {
	constructor() {
		this.cache = {};
	}
	
	getData(url,cb = undefined,ecb = undefined,fresh = false,ttl = DEFAULT_TTL) {
		if(url in this.cache) {
			// Clean cache entries whenever it is needed
			let bestBefore = this.cache[url].bestBefore;
			if(!!fresh || bestBefore<Date.now()) {
				delete this.cache[url];
			}
		}
		
		if(url in this.cache) {
			if(cb) {
				cb(this.cache[url].value);
			}
		} else {
			this.loadData(url,ttl,cb,ecb);
		}
	}
	
	loadData(url,ttl,cb,ecb) {
		let usersRequest = jQuery.ajax({
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
				cb(data);
			}
		})
		.fail((jqXhr, textStatus, errorThrown) => {
			//console.log('Failed to retrieve user Information',jqXhr);
			var responseText = '';
			if (jqXhr.status === 0) {
				responseText = 'Failed to retrieve user Information. Not connect: Verify Network.';
			} else if (jqXhr.status === 404) {
				responseText = 'Failed to retrieve user Information. Requested User not found [404]';
			} else if (jqXhr.status === 500) {
				responseText = 'Failed to retrieve user Information. Internal Server Error [500].';
			} else if (jqXhr.status === 'parsererror') {
				responseText = 'Failed to retrieve user Information. Requested JSON parse failed.';
			} else if (jqXhr.status === 'timeout') {
				responseText = 'Failed to retrieve user Information. Time out error.';
			} else if (jqXhr.status === 'abort') {
				responseText = 'Failed to retrieve user Information. Ajax request aborted.';
			} else {
				responseText = 'Failed to retrieve user Information. Uncaught Error: ' + jqXhr.responseText;
			}
			if(ecb) {
				ecb({error: responseText, showModal: true});
			}
		});
	}
}

const UMCacheSingleton = new UMCache();

export default UMCacheSingleton;
