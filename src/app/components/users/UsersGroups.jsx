var React = require('react');
import { Row, Col, Checkbox, Panel, Table } from 'react-bootstrap';
var Underscore = require('underscore');
import { Link } from 'react-router';


const UsersGroups = ({data}) => {
    console.log("Data so far is: ", data);
    var groupData = Underscore
      .chain(data)
      .groupBy('organizationalUnit')
      .toArray()
      .sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
      .value();

    return (
    <div>
      <h3> Lists of groups that a user is member of </h3>
          {groupData.map(function(ou,i){
              var organizationalUnit = ou[0].organizationalUnit;
              var headerText = organizationalUnit;
              return (
                <Row className="show-grid">
                  <Col xs={12} md={10} >
                    <Panel collapsible defaultExpanded header={headerText} key={i}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Common Name</th>
                            <th>Email</th>
                            <th>Category</th>
                            <th>Enabled</th>
                            <th>Groups</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                        {ou.map(function(user,j){
                          var isChecked = user.enabled;
                          return (
                            <tr key={j}>
                              <td>{j}</td>
                              <td>{user.cn}</td>
                              <td>{user.email}</td>
                              <td>{user.userCategory}</td>
                              <td><Checkbox checked={isChecked} readOnly /></td>
                              <td>
                                <ul className="user-ul">
                                {user.groups.map(function(group, k){
                                  return (
                                    <li><strong>{group}</strong></li>
                                  );
                                })}
                                </ul>
                              </td>
                              <td>
                                <Link className="btn btn-info editViewButton" role="button" to={'/users/groups/edit/' + encodeURIComponent(`${user.username}`)}>
                                  Edit
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                        </tbody>
                      </Table>
                    </Panel>
                  </Col>
                </Row>
              );
          })}
    </div>
    );
};
UsersGroups.propTypes = {
    data: React.PropTypes.array.isRequired
};

module.exports = UsersGroups;