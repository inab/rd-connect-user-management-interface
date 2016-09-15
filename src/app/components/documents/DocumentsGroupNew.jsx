import React from 'react';
import { Modal, Collapse, ListGroup, ListGroupItem, Button } from 'react-bootstrap';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import jQuery from 'jquery';

const { Select, File, Textarea } = FRC;

import config from 'config.jsx';
import auth from 'components/auth.jsx';

function htmlspecialchars(str) {
  return str.replace('&', '&amp;').replace('"', '&quot;').replace("'", '&#039;').replace('<', '&lt;').replace('>', '&gt;');
}
function validateSubmission(that, model){
	alert('ValidateSubmission unfinished', model);
	//First we validate documentFile
	return true;
}


const MaxFileSizeInMB = 10;
const MaxFileSize = MaxFileSizeInMB * 1024 * 1024;

const DocumentsGroupNew = React.createClass({
  propTypes:{
		params: React.PropTypes.object
	},
	getInitialState() {
      return {
        canSubmit: false,
        groupName: this.props.params.groupName,
        error: null,
        showModal:false,
        in: false,
        documentFile: '',
        documentDescription: '',
        documentClass: '',
        validationErrors: {}
      };
    },
    componentWillMount: function() {
      this.setState({groupName: this.state.groupName});
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
    validateForm: function (values) {
      console.log('Values inside validateForm contains: ', values);
      var selectOptions = ['userAgreement', 'genericAgreement', 'otherAgreement','miscelaneous','mailTemplate','mailAttachment']; 
      //First we validate documentFile
      if (!values.documentFile){
        this.setState({
          validationErrors: {
            documentFile: 'Please select a document to upload'
          }
        });
      } else if (values.documentFile[0].size === 0){
        this.setState({
          validationErrors: {
            documentFile: 'Document to upload cannot be empty (0 bytes)'
          }
        });
      } else if (values.documentFile[0].size > MaxFileSize){
        this.setState({
          validationErrors: {
            documentFile: 'Document to upload cannot be bigger than '+MaxFileSizeInMB+'MB'
          }
        });
      } else {
        this.setState({
          validationErrors: {
          }
        });
      }
      //Then we validate documentDescription
      if (!values.documentDescription){
        this.setState({
          validationErrors: {
            documentDescription: 'Document Description has no value, please add it'
          }
        });
      } else if (values.documentDescription.length < 20){
        this.setState({
          validationErrors: {
            documentDescription: 'Document Description min length is 20 characters'
          }
        });
      } else if (values.documentDescription.length > 200){
        this.setState({
          validationErrors: {
            documentDescription: 'Document Description max length is 200 characters'
          }
        });
      } else {
        this.setState({
          validationErrors: {
          }
        });
      }
      //Then we validate documentClass
       if (!values.documentClass){
        this.setState({
          validationErrors: {
            documentClass: 'Document Class has no value, please select one'
          }
        });
      } else if (selectOptions.indexOf(values.documentClass) === -1){
        this.setState({
          validationErrors: {
            documentClass: 'Document Class has to be one of this options: User Agreement, Generic Agreement, Other Agreement, Miscelaneous, mailTemplate or mailAttachment'
          }
        });
      } else {
        this.setState({
          validationErrors: {
          }
        });
      }
    },
    resetForm: function () {
      this.refs.documentForm.reset();
    },
    handleSubmit(model) {
      //console.log('model contains', model);
      //console.log('documentDescription contains', model.documentDescription);
      //console.log('documentClass contains', model.documentClass);
      //var documentFile = jQuery('#formDocumentFile').get(0).files[0];
      var myBlob = jQuery('input[name=documentFile]').get(0).files[0];
      var description = htmlspecialchars(model.documentDescription);
      var documentClass = htmlspecialchars(model.documentClass);
      //var documentFile = model.documentFile[0];
      //console.log('documentFile contains: ', documentFile);
      var formData = new FormData();
        formData.append('file', myBlob);
        formData.append('description', description);
        formData.append('documentClass', documentClass);

      var documentGroupFormData = Object.assign({},formData);
      jQuery.ajax({
        type: 'POST',
        url: config.groupsBaseUri + '/' + encodeURIComponent(this.state.groupName) + '/documents',
        contentType: 'multipart/form-data',
        processData: false,
        headers: auth.getAuthHeaders(),
        data: documentGroupFormData
      })
      .done(function(data) {
        //self.clearForm();
        this.resetForm();
        this.setState({in: true});
        //this.setState({ in: !this.state.in });
      })
      .fail(function(jqXhr) {
        console.log('Failed to Create new groups\'s document',jqXhr);
        var responseText = '';
        if (jqXhr.status === 0) {
          responseText = 'Failed to Create new group\'s document. Not connect: Verify Network.';
        } else if (jqXhr.status === 404) {
          responseText = 'Failed to Create new group\'s document. Not found [404]';
        } else if (jqXhr.status === 500) {
          responseText = 'Failed to Create new group\'s document. Internal Server Error [500].';
        } else if (jqXhr.status === 'parsererror') {
          responseText = 'Failed to Create new group\'s document. Sent JSON parse failed.';
        } else if (jqXhr.status === 'timeout') {
          responseText = 'Failed to Create new group\'s document. Time out error.';
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
			{value: 'userAgreement', label: 'User Agreement', title: 'This is a title for userAgreement'},
			{value: 'genericAgreement', label: 'Generic Agreement', title: 'This is a title for genericAgreement'},
			{value: 'otherAgreement', label: 'Other Agreement', title: 'This is a title for other agreement documents'},
			{value: 'miscelaneous', label: 'Miscelaneous', title: 'This is a title for Miscelaneous'},
      {value: 'mailTemplate', label: 'Mail Template', title: 'This is a title for Mail Template'},
      {value: 'mailAttachmente', label: 'Mail Attachmemt', title: 'This is a title for Mail Attachment'}
			//optionY
		];
		var singleSelectOptions = selectOptions.slice(0);
		singleSelectOptions.unshift({value: '', label: 'Select…'});
      return (
        <div>
          <Modal show={this.state.showModal} onHide={this.close} error={this.state.error}>
            <Modal.Header>
              <Modal.Title>Error!</Modal.Title>
              </Modal.Header>
            <Modal.Body>
              <h4>{this.state.error}</h4>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>
          <h3> Create New Document for group {this.state.groupName} </h3>
          <Collapse in={this.state.in} onEntering={this.wait} bsStyle="success" ref="fade">
            <ListGroup>
              <ListGroupItem bsStyle="success">Document inserted successfully!!</ListGroupItem>
            </ListGroup>
          </Collapse>
          <Formsy.Form
            onChange={this.validateForm}
            validationErrors={this.state.validationErrors}
            onValidSubmit={this.handleSubmit}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            name="documentsGroupNewForm"
            className="documentsForm"
            ref="documentForm"
          >
            <fieldset>
            <legend>Document Picker</legend>
              <File
                layout="vertical"
                name="documentFile"
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
            <div className="button-submit">
              <Button type="submit" disabled={!this.state.canSubmit} bsStyle="primary" >Submit</Button>
            </div>
          </Formsy.Form>
        </div>
      );
    }
  });

module.exports = DocumentsGroupNew;
