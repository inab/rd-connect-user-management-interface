var React = require('react');

import { Row, Col, Panel, Table } from 'react-bootstrap';
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
                  <Panel collapsible defaultExpanded center header={group.cn} key={i}>
                    <Table responsive className="table-list">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Purpose</th>
                          <th>Owner</th>
                          <th>Members</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                    <tr key={i}>
                      <td>{group.description}</td>
                      <td>{group.groupPurpose}</td>
                      <td>
                        <ul className="user-ul">
                        {listOwners.map(function(owner, j){
                            return (
                                <li key={j}><Link to={'/users/view/' + owner}>{owner}</Link></li>
                            );
                          })}
                        </ul>
                      </td>
                      <td>
                        <ul className="user-ul">
                        {groupMembers.map(function(member, k){
                            return (
                                <li key={k}><Link to={'/users/view/' + member}>{member}</Link></li>
                            );
                          })}
                        </ul>
                      </td>
                      <td>
                        <Link className="btn btn-primary editViewButton" role="button" to={'/groups/edit/' + encodeURIComponent(`${group.cn}`)}>
                          Edit
                        </Link>
                      </td>
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

Groups.propTypes = {
    data: React.PropTypes.array.isRequired
};

module.exports = Groups;
