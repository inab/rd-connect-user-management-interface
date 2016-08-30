var React = require('react');
import { Checkbox, Row, Col, Panel, Table } from 'react-bootstrap';
var Underscore = require('underscore');
import { Link } from 'react-router';
//var User = require('./User.jsx');


const Users = ({data}) => {
  console.log("Data so far is: ", data);
  var groupedData = Underscore
    .chain(data)
    .groupBy('organizationalUnit')
    .toArray()
    .sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
    .value();

  return (
     <div>
      <h3> List of Users </h3>
      <Row className="show-grid">
        <Col xs={12} md={10} >
              {groupedData.map(function(ou,i){
                var organizationalUnit = ou[0].organizationalUnit;
                return (
                  <Panel collapsible defaultExpanded center header={organizationalUnit} key={i}>
                    <Table responsive className="table-list">
                      <thead>
                        <tr>
                          <th>User Name</th>
                          <th>Common Name</th>
                          <th>Email</th>
                          <th>Category</th>
                          <th>Enabled</th>
                          <th>Groups</th>
                          <th>View/Edit User</th>
                        </tr>
                      </thead>
                      <tbody>
                    {ou.map(function(user,j){
                      console.log(user);
                      var isChecked = user.enabled;
                      return (
                          <tr key={j}>
                            <td>{user.username}</td>
                            <td>{user.cn}</td>
                            <td>{user.email}</td>
                            <td>{user.userCategory}</td>
                            <td><Checkbox checked={isChecked} readOnly /></td>
                            <td>
                              <ul className="user-ul">
                              {
                                user.groups.map(function(groupName, k){
                                  return (
                                    <li key={k}>{groupName}</li>
                                  );
                                })
                              }
                              </ul>
                            </td>
                            <td>
                              <Link className="btn btn-info editViewButton" role="button" to={'/users/view/' + encodeURIComponent(`${user.username}`)}>
                                View
                              </Link>
                              <Link className="btn btn-info editViewButton" role="button" to={'/users/edit/' + encodeURIComponent(`${user.username}`)}>
                                Edit
                              </Link>
                            </td>
                          </tr>
                      );
                    })}
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

Users.propTypes = {
    data: React.PropTypes.array.isRequired
};
module.exports = Users;