var React = require('react');
var Bootstrap = require('react-bootstrap');

var Group = require('./Group.jsx');
import { Row, Col, Code, Panel, Table, ListGroup, ListGroupItem, Button, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router';
var Underscore = require('underscore');

const GroupList = ({data}) => {
  //console.log("Data so far is: ", data);
  console.log("Data so far is: ", data);
  var sortedData=Underscore
    .chain(data)
    .sortBy(function(groupObjects){ return groupObjects.cn; })
    .value()
  console.log("sortedData so far is: ", sortedData);
  return (
    <div>
      <h3> List of Groups </h3>
      <Row className="show-grid">
        <Col xs={12} md={10} >
          <Panel collapsible defaultExpanded center header="Whatever">
            <Table responsive>
              <thead>
                <tr>
                  <th>Group Name</th>
                  <th>Description</th>
                  <th>Owner</th>
                  <th>Members</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
              {sortedData.map(function(group,i){
                var listOwners=group.owner.join(", ");
                var listMembers=group.members.join(", ");
                return(
                    <tr key={i}>
                      <td><strong>{group.cn}</strong></td>
                      <td>{group.description}</td>
                      <td>{listOwners}</td>
                      <td>{listMembers}</td>
                      <td><Link to={"/groupEdit/"+group.cn}>Edit</Link></td>
                    </tr>
                );
              })}
              </tbody>
            </Table>
          </Panel>
        </Col>
      </Row>
    </div>
  );
}

module.exports = GroupList;