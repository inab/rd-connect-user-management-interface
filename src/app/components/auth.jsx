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
		let setInit = () => {
			this.initialized = true;
		};
		this.getLoginDataP()
		.then(setInit,setInit);
	}
	
	getAuthHeaders() {
		return {
			'X-RDConnect-UserManagement-Session': this.token
		};
	}
	
	onChangeListener(cb) {
		this.onChange = cb;
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
	getLoginDataP() {
		return new Promise((resolve,reject) => {
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
						resolve(this.userProps);
					})
					.fail((xhr, status, err) => {
						// As we cannot fetch the user information, remove
						// all the session traces
						this.invalidateSession();
						reject({xhr: xhr, status: status, err: err});
					});
				} else {
					reject({xhr: {},status: 401,err: 'Unauthorized'});
				}
			} else {
				resolve(this.userProps);
			}
		});
	}
	
	getLoginTokenP() {
		// We validate the session here
		return new Promise((resolve,reject) => {
			this.getLoginDataP()
			.then(() => {
				resolve(this.token);
			}, (err) => {
				reject(err);
			});
		});
	}
	
	login(username, password) {
		//cb = arguments[arguments.length - 1];
		return new Promise((resolve,reject) => {
			if(localStorage.token) {
				resolve(this.userProps);
			}
			pretendRequest(username, password)
			.then((res) => {
				this.setLoginData(res.userProps);
				this.onChange(res.userProps);
				resolve(res.userProps);
			},(res) => {
				this.onChange(false);
				reject({status: res.status,errorMsg: res.errorMsg});
			});
		});
	}
	
	logout() {
		return new Promise((resolve,reject) => {
			if(this.loggedIn()) {
				let doInvalidateDone = () => {
					this.invalidateSession();
					this.onChange(false);
					resolve();
				};
				
				let doInvalidateFail = () => {
					this.invalidateSession();
					this.onChange(false);
					reject();
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
				.done(doInvalidateDone)
				.fail(doInvalidateFail);
			} else {
				this.onChange(false);
				resolve();
			}
		});
	}
	
	loggedIn() {
		return !!this.token;
	}

	onChange() {}
}

function pretendRequest(username, password) {
	return new Promise((resolve,reject) => {
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
			resolve({
				authenticated: true,
				userProps: newUserProps
			});
		})
		.fail((xhr, status, err) => {
			reject({ authenticated: false, status: xhr.status, errorMsg: err });
		});
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
