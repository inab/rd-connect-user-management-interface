var React = require('react');
import { Button, Row, Col, Panel, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';


const DocumentsUser = ({data}) => {
  const history = createHistory();
  console.log('Data so far is: ', data);
  var username = data[0].owner;
  //We receive an array of objects. Each element of the array contains one document, from which we get the metadata and show them
  return (
     <div>
      <h3> List of documents related to user {username}:  </h3>
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
                      <th>Created by</th>
                      <th>Modified</th>
                      <th>Modified by</th>
                      <th colSpan="2">Document Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key={index}>
                      <td>{file.documentClass}</td>
                      <td>{file.creationTimestamp}</td>
                      <td>{file.creator}</td>
                      <td>{file.modificationTimestamp}</td>
                      <td>{file.modifier}</td>
                      <td className="border4colspan">
                        <Link className="btn btn-danger editViewButton" to={'/documents/users/' + encodeURIComponent(`${username}`)}>
                          Delete
                        </Link>
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
          })}
          <Button bsStyle="primary" onClick={history.goBack} >Cancel</Button>
        </Col>
      </Row>
    </div>
  );
};

DocumentsUser.propTypes = {
    data: React.PropTypes.array.isRequired
};
module.exports = DocumentsUser;
