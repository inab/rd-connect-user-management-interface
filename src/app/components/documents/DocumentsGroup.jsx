var React = require('react');
import { Button, Row, Col, Panel, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';


const DocumentsUser = ({data, groupName}) => {
  console.log('Data so far is: ', data);
  console.log('GroupName so far is: ', groupName);
  var groupName = groupName;
  //We receive an array of objects. Each element of the array contains one document, from which we get the metadata and show them
  return (
     <div>
      <h3> List of documents related to group {groupName}:  </h3>
      <Row className="show-grid">
        <Col xs={12} md={10} >
          {data.map(function(file,index){
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
                        <Link className="btn btn-danger editViewButton" to={'/documents/groups/' + encodeURIComponent(`${groupName}`) + '/delete'}>
                          Delete
                        </Link>
                      </td>
                      <td className="border4colspan" >
                        <Link className="btn btn-primary editViewButton" role="button" to={'/documents/groups/' + encodeURIComponent(`${groupName}`) + '/edit'}>
                          Edit
                        </Link>
                      </td>
                    </tr>
                  </tbody>
              </Table>
            </Panel>
            );
          })}
            <div className="button-submit">
              <Button bsStyle="primary" onClick={()=>hashHistory.goBack()} className="submitCancelButtons">Cancel</Button>
            </div>
        </Col>
      </Row>
    </div>
  );
};

DocumentsUser.propTypes = {
    data: React.PropTypes.array.isRequired,
    groupName: React.PropTypes.string.isRequired
};
module.exports = DocumentsUser;
