import React from 'react';
var Bootstrap = require('react-bootstrap');
import ReactDOM from 'react-dom';
import { Fade, ListGroup, ListGroupItem } from 'react-bootstrap';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
var request = require('superagent');
var jQuery = require('jquery');

const { Select, File, Textarea } = FRC;


function htmlspecialchars(str) {
  return str.replace('&', '&amp;').replace('"', '&quot;').replace("'", '&#039;').replace('<', '&lt;').replace('>', '&gt;');
}
function validateSubmission(model){
  alert("Validating submission model: ", model);
}

const MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue(event) {
    this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
  },
  render() {
    const className = 'form-group' + (this.props.className || ' ') + (this.showRequired() ? 'required' : this.showError() ? 'error' : null);
    const errorMessage = this.getErrorMessage();
    return (
      <div className={className}>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <input
          type={this.props.type || 'text'}
          name={this.props.name}
          onChange={this.changeValue}
          value={this.getValue()}
          checked={this.props.type === 'checkbox' && this.getValue() ? 'checked' : null}
        />
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }
});


const DocumentsUserNew = React.createClass({
  propTypes:{
		params: React.PropTypes.object
	},
  mixins: [FRC.ParentContextMixin],
	getInitialState() {
      return {
        canSubmit: false,
        username: this.props.params.username,
        error: null,
        showModal:false,
        in: false,
        documentFile: '',
        documentDescription: '',
        documentClass: '',
      };
    },
    componentWillMount: function() {
      this.setState({username: this.state.username});
    },
    enableButton() {
      this.setState({
        canSubmit: true
      });
    },
    disableButton() {
      this.setState({
        canSubmit: false
      });
    },
    close(){
      this.setState({showModal: false});
    },
    open(){
      this.setState({showModal: true});
    },
    toggle(){
      this.setState({ in: !this.state.in });
    },
    wait(){
      var mythis = this;
      setTimeout(function(){
        mythis.toggle();
      }, 3000);
    },
    changeValue(event) {
      console.log("Handling change on document description");
      console.log(event);
      var test= jQuery(".documentDescription textarea");
      console.log(test);
    },
    handleChangeDocumentFile(e) {
      this.setState({ documentFile: e.target.value });
    },
    handleChangeDocumentDescription(e) {
      console.log("Handling change on document description");
      var test= jQuery(".documentDescription textarea");
      console.log(test);
      
      //this.setState({ documentDescription: e.target.value });
      //this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
    },
    handleSubmit(model) {
      //var valid = validateSubmission(this);
      console.log('model contains', model);
      console.log('documentDescription contains', model.documentDescription);
      console.log('documentClass contains', model.documentClass);
      //var documentFile = jQuery('#formDocumentFile').get(0).files[0];
      var myBlob = jQuery('input[name=fileDocument]').get(0).files[0];
      var description = htmlspecialchars(model.documentDescription);
      var documentClass = htmlspecialchars(model.documentClass);

      /*
      var documentFile = new File([myBlob], myBlob.name);
      console.log('documentFile contains', documentFile);
			var fd = new FormData();
			fd.append('file', documentFile);

      var req = request.post('/users/' + this.state.username + '/picture');
			req
				.set('Content-Type', false)
        .set('processData', false)
				.attach('content', fd)
				.field('description', description)
				.send('documentClass', documentClass)
				.end(function(err, res){
					if (!err && res){
						self.clearForm();
            this.setState({in: true});
            //this.setState({ in: !this.state.in });
					}
					else {
						alert('Si ha habido error en la inserción!!');
						var responseText = '';
						if (err && err.status === 404) {
							responseText = 'Failed to Update User\'s image. Not found [404]';
						}
						else if (err && err.status === 500) {
							responseText = 'Failed to Update User\'s image. Internal Server Error [500]';
						}
						else if (err && err.status === 'parsererror') {
							responseText = 'Failed to Update User\'s image. Sent JSON parse failed';
						}
						else if (err && err.status === 'timeout') {
							responseText = 'Failed to Update User\'s image. Time out error';
						}
						else if (err && err.status === 'abort') {
							responseText = ('Ajax request aborted');
						}
						else if (err) {
							responseText = 'Ajax generic error';
						}
						this.setState({error: responseText, showModal: true});
					}
				}.bind(this));
			setTimeout(() => {
				// Completed of async action, set loading state back
        this.setState({documentFile: '', documentDescription: '', documentClass: ''});
        this.setState({in: true});
			}, 2000);
      */
      var documentFile = model.fileDocument[0];
      console.log('documentFile contains: ', documentFile);
			var formData = new FormData();
        formData.append('file', myBlob);
        formData.append('description', this.state.description);
        formData.append('description', this.state.description);

      var documentUserFormData = Object.assign({},formData);
      jQuery.ajax({
        type: 'POST',
        url: '/users/' + this.state.username + '/picture',
        contentType: 'multipart/form-data',
        processData: false,
        data: documentUserFormData
      })
      .done(function(data) {
        self.clearForm();
        this.setState({in: true});
        //this.setState({ in: !this.state.in });
      })
      .fail(function(jqXhr) {
        console.log('Failed to Create new user\'s document',jqXhr);
        var responseText = '';
        if (jqXhr.status === 0) {
          responseText = 'Failed to Create new user\'s document. Not connect: Verify Network.';
        } else if (jqXhr.status === 404) {
          responseText = 'Failed to Create new user\'s document. Not found [404]';
        } else if (jqXhr.status === 500) {
          responseText = 'Failed to Create new user\'s document. Internal Server Error [500].';
        } else if (jqXhr.status === 'parsererror') {
          responseText = 'Failed to Create new user\'s document. Sent JSON parse failed.';
        } else if (jqXhr.status === 'timeout') {
          responseText = 'Failed to Create new user\'s document. Time out error.';
        } else if (jqXhr.status === 'abort') {
          responseText = 'Ajax request aborted.';
        } else {
          responseText = 'Uncaught Error: ' + jqXhr.responseText;
        }
        this.setState({error: responseText, showModal: true});
      }.bind(this));
    },
    render() {
		var selectOptions = [
			{value: 'userAgreement', label: 'User Agreement', title: 'This is a title for Miscelaneous'},
			{value: 'genericAgreement', label: 'Generic Agreement', title: 'This is a title for Miscelaneous'},
			{value: 'otherAgreement', label: 'Other Agreement', title: 'This is a title for Miscelaneous'},
			{value: 'miscelaneous', label: 'Miscelaneous', title: 'This is a title for Miscelaneous'}
			//optionY
		];
		var singleSelectOptions = selectOptions.slice(0);
		singleSelectOptions.unshift({value: '', label: 'Select…'});
      return (
        <div>
          <Bootstrap.Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
            <Bootstrap.Modal.Header>
              <Bootstrap.Modal.Title>Error!</Bootstrap.Modal.Title>
              </Bootstrap.Modal.Header>
            <Bootstrap.Modal.Body>
              <h4>{this.state.error}</h4>
            </Bootstrap.Modal.Body>
            <Bootstrap.Modal.Footer>
              <Bootstrap.Button onClick={this.close}>Close</Bootstrap.Button>
            </Bootstrap.Modal.Footer>
          </Bootstrap.Modal>
          <Fade in={this.state.in} onEntering={this.wait} onEntered={this.test} bsStyle="success" ref="fade">
							<ListGroup>
								<ListGroupItem bsStyle="success">Document inserted successfully!!</ListGroupItem>
							</ListGroup>
						</Fade>
          <Formsy.Form onValidSubmit={this.handleSubmit} onValid={this.enableButton} onInvalid={this.disableButton} name="documentsUserNewForm">
            <fieldset>
            <legend>Document Picker</legend>
              <File
                layout="vertical"
                name="fileDocument"
                help="Select the document to upload"
                required
              />
            </fieldset>
            <fieldset>
              <legend>Document Description</legend>
              <Textarea
                rows={3}
                cols={40}
                name="documentDescription"
                placeholder="This field requires at least 20 characters."
                help="Insert the description for the document"
                validations={{minLength:20, maxLength:200}}
                validationErrors={{
                  maxLength: 'Please provide 200 characters max.',
                  minLength: 'Please provide at least 20 characters.'
                }}
                required
                layout="vertical"
              />
            </fieldset>
            <fieldset>
              <legend>Document Type</legend>
                <Select
                  name="documentClass"
                  help="Select a Document Type."
                  options={singleSelectOptions}
                  layout="vertical"
                  required
                />
            </fieldset>
                  <button type="submit" disabled={!this.state.canSubmit} >Submit</button>
          </Formsy.Form>
        </div>
      );
    }
  });

module.exports = DocumentsUserNew;
