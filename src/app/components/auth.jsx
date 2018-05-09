import jQuery from 'jquery';
import config from 'config.jsx';
import cookie from 'react-cookie';

const COOKIE_NAME = 'rdUserMgmtToken';

class Auth {
	constructor() {
		// Get the token from the cookie (if exists)
		this.token = cookie.load(COOKIE_NAME);
		if(this.token === undefined) {
			this.token = null;
		}
		this.userProps = null;
		
		// Forcing to get the login information
		this.getLoginData(() => {
			this.initialized = true;
		});
	}
	
	getAuthHeaders() {
		return {
			'X-RDConnect-UserManagement-Session': this.token
		};
	}
	
	invalidateSession() {
		cookie.remove(COOKIE_NAME);
		this.token = null;
		this.userProps = null;
	}
	
	renewSessionCookie() {
		var expireDate = new Date();
		// One hour expiration
		expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000));
		cookie.save(COOKIE_NAME,this.token,{ path: location.pathname , expires: expireDate });
		return this.token;
	}
	
	setLoginData(newUserProps) {
		this.userProps = newUserProps;
		if(!(newUserProps.email instanceof Array)) {
			newUserProps.email = [ newUserProps.email ];
		}
		// Populating token (and preserving it)
		if(newUserProps.session_id !== undefined) {
			this.token = newUserProps.session_id;
			this.renewSessionCookie();
		}
	}
	
	// This is an informational method
	getLoginData(cb,ecb) {
		if(this.userProps === null) {
			if(this.token !== null) {
				// Let's validate the session status, in a synchronous way
				jQuery.ajax({
					type: 'GET',
					url: config.apiBaseUri + '/login',
					dataType: 'json',
					//processData: false,
					contentType: 'application/json',
					headers: this.getAuthHeaders()
				})
				.done((newUserProps) => {
					// Setting new data
					this.setLoginData(newUserProps);
					if(cb !== undefined) {
						cb(this.userProps);
					}
				})
				.fail((xhr, status, err) => {
					// As we cannot fetch the user information, remove
					// all the session traces
					this.invalidateSession();
					if(ecb !== undefined) {
						ecb(xhr, status, err);
					}
				});
			} else if(ecb !== undefined) {
				ecb({},401,'Unauthorized');
			}
		} else if(cb !== undefined) {
			cb(this.userProps);
		}
		
		// Let's return whatever we have
		return this.userProps;
	}
	
	getLoginToken(cb) {
		// We validate the session here
		this.getLoginData(() => {
				if(cb !== undefined) {
					cb(this.token);
				}
			}, () => {
				if(cb !== undefined) {
					cb(null);
				}
			}
		);
	}
	
	login(username, password, cb) {
		//cb = arguments[arguments.length - 1];
		if(localStorage.token) {
			if(cb) {
				cb(true);
			}
			this.onChange(true);
			return;
		}
		pretendRequest(username, password, (res) => {
			if(res.authenticated) {
				this.setLoginData(res.userProps);
				if(cb) {
					cb(res.userProps,null,null);
				}
				this.onChange(res.userProps);
			} else {
				if(cb) {
					cb(false,res.status,res.errorMsg);
				}
				this.onChange(false);
			}
		});
	}
	
	logout(cb) {
		if(this.loggedIn()) {
			let doInvalidate = () => {
				this.invalidateSession();
				if(cb) {
					cb();
				}
				this.onChange(false);
			};
			
			// Let's invalidate the session status
			jQuery.ajax({
				type: 'GET',
				url: config.apiBaseUri + '/logout',
				dataType: 'json',
				//processData: false,
				contentType: 'application/json',
				headers: this.getAuthHeaders()
			})
			.done(doInvalidate)
			.fail(doInvalidate);
		} else {
			if(cb) {
				cb();
			}
			this.onChange(false);
		}
	}
	
	loggedIn() {
		return !!this.token;
	}

	onChange() {}
}

function pretendRequest(username, password, cb) {
	jQuery.ajax({
		type: 'POST',
		url: config.apiBaseUri + '/login',
		dataType: 'json',
		//processData: false,
		contentType: 'application/json',
		data: JSON.stringify({
			username: username,
			password: password,
			service: config.getService()
		})
	})
	.done((newUserProps) => {
		cb({
			authenticated: true,
			userProps: newUserProps
		});
	})
	.fail((xhr, status, err) => {
		cb({ authenticated: false, status: xhr.status, errorMsg: err });
	});
	
	/*
  setTimeout(() => {
    //Ajax call to API REST login
    if(username === 'acanada' && password === '123.qwe') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      });
    } else {
      cb({ authenticated: false });
    }
  }, 0);
	*/
}

// We are returning here a singleton
export default new Auth();
