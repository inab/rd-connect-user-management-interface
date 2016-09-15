import React from 'react';
import jQuery from 'jquery';
import { Modal, Button, Row, Col, Panel, Table, ListGroup, ListGroupItem, Collapse } from 'react-bootstrap';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
import confirm from 'react-confirm2';

import config from 'config.jsx';
import auth from 'components/auth.jsx';

const DocumentsUser = React.createClass({
  propTypes:{
      data: React.PropTypes.array.isRequired,
      params: React.PropTypes.object
  },
  getInitialState: function() {
		return {
			error: null,
			showModal: false,
			data: null,
			users: null,
      fileToDelete: '',
      username: '',
      in: false
		};
	},
  componentWillMount: function() {
		this.setState({data: this.props.data, username: this.props.data[0].owner});
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
  confirmDelete(file) {
    console.log('data inside confirmDelete contains: ',this.state.data);
    console.log('File inside confirmDelete contains: ',file);
    this.setState({fileToDelete: file});
    confirm('Are you sure?', {
      done: () => {
        console.log('ok, lets delete it');//DELETE /users/:user_id/documents/:document_name:
        jQuery.ajax({
          type: 'DELETE',
          url: config.usersBaseUri + '/' + encodeURIComponent(file.owner) + '/documents/'+ encodeURIComponent(file.cn),
          headers: auth.getAuthHeaders()
        })
        .done(function() {
          this.setState({in: true});
          //Test deleting file from state to see rewriting of components
          //We update this.state.data so page is reload with the new data (without deleted file)
          this.state.data = this.state.data.filter(function(el) {
            return (el.cn !== file.cn && el.owner === file.owner);
          });
        })
        .fail(function(jqXhr) {
          console.log('Failed to Delete User File',jqXhr);
          console.log('Change state',this.state);
          var responseText = '';
          if (jqXhr.status === 0) {
            responseText = 'Failed to Delete User File. Not connect: Verify Network.';
          } else if (jqXhr.status === 404) {
            responseText = 'Failed to Delete User File. Not found [404]';
          } else if (jqXhr.status === 500) {
            responseText = 'Failed to Delete User File. Internal Server Error [500].';
          } else if (jqXhr.status === 'parsererror') {
            responseText = 'Failed to Delete User File. Sent JSON parse failed.';
          } else if (jqXhr.status === 'timeout') {
            responseText = 'Failed to Delete User File. Time out error.';
          } else if (jqXhr.status === 'abort') {
            responseText = 'Ajax request aborted.';
          } else {
            responseText = 'Uncaught Error: ' + jqXhr.responseText;
          }
          this.setState({error: responseText, showModal: true});
        }.bind(this));
      },
    });
  },
  render() {
    //console.log('Data so far is: ', this.state.data);
    var username = this.state.username;
    //We receive an array of objects. Each element of the array contains one document, from which we get the metadata and show them
    
    var mythis = this;
    function contextConfirmDelete(file) {
        return function() {
            mythis.confirmDelete(file);
        };
    }

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
        <h3> List of documents related to user {username}:  </h3>
        <Collapse in={this.state.in} onEntering={this.wait} bsStyle="success" ref="fade">
          <ListGroup>
            <ListGroupItem bsStyle="success">Document inserted successfully!!</ListGroupItem>
          </ListGroup>
        </Collapse>
        <Row className="show-grid">
          <Col xs={12} md={10} >
            {
              this.state.data.map(function(file,index){
              var header = 'File: ' + file.cn + ' (' + file.description + ')';
              return (
                <Panel collapsible defaultExpanded center header={header} key={index}>
                  <Table responsive className="table-list">
                    <thead>
                      <tr>
                        <th>Document Class</th>
                        <th>Created</th>
                        <th>Modified</th>
                        <th colSpan="2">Document Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr key={index}>
                        <td>{file.documentClass}</td>
                        <td>{file.creationTimestamp}</td>
                        <td>{file.modificationTimestamp}</td>
                        <td className="border4colspan">
                         <Button bsStyle="danger" onClick={contextConfirmDelete(file)}>Delete</Button>
                        </td>
                        <td className="border4colspan" >
                          <Link className="btn btn-primary editViewButton" role="button" to={'/documents/users/' + encodeURIComponent(`${username}`)}>
                            Edit
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                </Table>
              </Panel>
              );
            },this)}
            <div className="button-submit">
              <Button bsStyle="primary" onClick={()=>hashHistory.goBack()} className="submitCancelButtons">Cancel</Button>
            </div>

          </Col>
        </Row>
      </div>
    );
  }
});
module.exports = DocumentsUser;
