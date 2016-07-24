var React = require('react');

import { Row, Col, Panel, Table, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';
var Underscore = require('underscore');

const Groups = ({data}) => {
  //console.log("Data so far is: ", data);
  console.log('Data so far is: ', data);
  var sortedData = Underscore
    .chain(data)
    .sortBy(function(groupObjects){ return groupObjects.cn; })
    .value();
  console.log('sortedData so far is: ', sortedData);
  return (
    <div>
      <h3> List of Groups </h3>
      <Row className="show-grid">
        <Col xs={12} md={10} >
              {sortedData.map(function(group,i){
                var listOwners = group.owner.sort();
                var groupMembers = group.members.sort();
                //var listMembers=group.members.join(", ");
                return (
                  <Panel collapsible defaultExpanded center>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Group Name</th>
                          <th>Description</th>
                          <th>Owner</th>
                          <th>Members</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                    <tr key={i}>
                      <td><strong>{group.cn}</strong></td>
                      <td>{group.description}</td>
                      <td>
                        <ListGroup>
                        {listOwners.map(function(owner, j){
                            return (
                                <ListGroupItem><Link to={'/users/view/' + owner}>{owner}</Link></ListGroupItem>
                            );
                          })}
                        </ListGroup>
                      </td>
                      <td>
                        <ListGroup>
                        {groupMembers.map(function(member, j){
                            return (
                                <ListGroupItem><Link to={'/users/view/' + member}>{member}</Link></ListGroupItem>
                            );
                          })}
                        </ListGroup>
                      </td>
                      <td><Link to={'/groups/view/' + group.cn}>View</Link>/<Link to={'/groups/edit/' + group.cn}>Edit</Link></td>
                    </tr>
                    </tbody>
            </Table>
          </Panel>
                );
              })}
        </Col>
      </Row>
    </div>
  );
};

module.exports = Groups;
