import React from 'react';
import { withRouter } from 'react-router';
import { Modal, Button, Col } from 'react-bootstrap';
import Formsy from 'formsy-react';
import { Form, Input } from 'formsy-react-components';

import auth from 'components/auth.jsx';

class Login extends React.Component {
    constructor(props,context) {
		super(props.context);
    }
    
    componentWillMount() {
		this.setState({
			error: false,
			canSubmit: false,
			showModal:true,
			validationErrors: {}
		});
	}
	
    enableButton() {
        this.setState({
            canSubmit: true
        });
    }
	
    disableButton() {
        this.setState({
            canSubmit: false
        });
    }
    
    close(){
		this.setState({showModal: false});
    }
    
    validateForm(values) {
      //First we validate username
      if(!values.username){
        this.setState({
          validationErrors: {
            username: 'Please type your username'
          }
        });
      } else if(values.username.length < 4){
        this.setState({
          validationErrors: {
            username: 'Username min length is 4 characters'
          }
        });
      } else if(!values.password){ //Then we validate password
        this.setState({
          validationErrors: {
            password: 'Please type your password'
          }
        });
      } else if(values.password.length < 7){
        this.setState({
          validationErrors: {
            password: 'Password min length is 7 characters'
          }
        });
      } else {
        this.setState({
          validationErrors: {
          }
        });
      }
    }
    
    handleSubmit(model) {
      //event.preventDefault();
      //const email = this.refs.email.value;
      const username = model.username;
      //const pass = this.refs.pass.value;
      const password = model.password;
      auth.login(username, password, (loggedIn,status,errorMsg) => {
        if(!loggedIn){
          return this.setState({ error: true, errorMsg: errorMsg, status: status });
        }
        const location = this.props.location;
        if(location.state && location.state.nextPathname) {
          this.props.router.replace(location.state.nextPathname);
        } else {
          this.props.router.replace('/users/view/' + encodeURIComponent(username));
        }
      });
    }
	
    render() {
      return (
        <div>
          <Modal show={this.state.showModal} error={this.state.error} className="login">
            <Modal.Header className="login">
              <Modal.Title>RD-Connect UMI Login</Modal.Title>
            </Modal.Header>
            <Modal.Body className="login">
              <Formsy.Form
                onValidSubmit={(model) => this.handleSubmit(model)}
                onChange={(values) => this.validateForm(values)}
                validationErrors={this.state.validationErrors}
                onValid={() => this.enableButton()}
                onInvalid={() => this.disableButton()}
                name="loginForm"
                className="documentsForm login"
              >
              <fieldset>
                <legend>Username</legend>
                <Input
                    id="username"
                    name="username"
                    value=""
                    label=""
                    type="text"
                    placeholder="Type your username (For example: a.canada)."
                    help=""
                    layout="horizontal"
					  style={{width:"95%"}}
                    required
                />
              </fieldset>
              <fieldset>
                  <legend>Password</legend>
                  <Input
                      id="password"
                      name="password"
                      value=""
                      label=""
                      type="password"
                      placeholder="Type your password"
                      layout="horizontal"
					  autoComplete="off"
					  style={{width:"95%"}}
                      required
                  />
                </fieldset>
                      <Button type="submit" bsStyle="primary" className="right" disabled={!this.state.canSubmit} >Login</Button>
              </Formsy.Form>
            </Modal.Body>
            <Modal.Footer className="login">
                      {this.state.error && (
                        <p className="badLoginInformation" >{(function(state) {
							let message;
							switch(state.status) {
								case 404:
									message="CAS server is unreachable";
									break;
								case 401:
									message="Error while authenticating (bad login information?)";
									break;
								case 404:
									message="CAS UMI or server are unreachable";
									break;
								default:
									if(state.status>=500) {
										message="CAS UserManagement internal error ("+state.status+")";
									} else {
										message="CAS UserManagement error ("+state.status+")";
									}
									break;
							}
							return message;
						})(this.state)}</p>
                      )}
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
}


export default withRouter(Login);
