var React = require('react');
import { Checkbox, Row, Col, Panel, Table } from 'react-bootstrap';
var Underscore = require('underscore');
import { Link } from 'react-router';
//var User = require('./User.jsx');


const Users = ({data}) => {
  //console.log("Data so far is: ", data);
  var groupedData = Underscore
    .chain(data)
    .groupBy('organizationalUnit')
    .toArray()
    .sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
    .value();

  return (
     <div>
      <h3 style={{float:'left'}}> List of Users</h3>
      <div className="right">
        <Link className="btn btn-primary" role="button" to={'/users/new/'}>Add New User</Link>
      </div>
      <div className="clear-both" />
      <Row className="show-grid">
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
                          <th colSpan="2" >User Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                    {ou.map(function(user,j){
                      console.log(user);
                      var isChecked = user.enabled;
                      var userGroups = [];
                      if(user.groups !== undefined)  userGroups = user.groups;
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
								userGroups.map(function(groupName, k){
									return (
										<li key={k}>{groupName}</li>
									);
								})
                              }
                              </ul>
                            </td>
                            <td className="border4colspan">
                              <Link className="btn btn-primary editViewButton" role="button" to={'/users/view/' + encodeURIComponent(`${user.username}`)}>
                                View
                              </Link>
                            </td>
                            <td className="border4colspan">
                              <Link className="btn btn-primary editViewButton" role="button" to={'/users/edit/' + encodeURIComponent(`${user.username}`)}>
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
      </Row>
    </div>
  );
};

Users.propTypes = {
    data: React.PropTypes.array.isRequired
};
module.exports = Users;
