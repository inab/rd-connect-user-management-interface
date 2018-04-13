import React from 'react';
import { Glyphicon, Checkbox, Row, Col, Panel, Table } from 'react-bootstrap';
import Underscore from 'underscore';
import { Link } from 'react-router';
//import User from './User.jsx';


const UserTable = ({users}) => {
  //console.log("Data so far is: ", data);
  return (
                    <Table responsive className="table-list">
                      <thead>
                        <tr>
                          <th>User Name</th>
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Category</th>
                          <th>Enabled</th>
                          <th>Groups</th>
                          <th>User Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                    {users.map(function(user,j){
                      //console.log(user);
                      var userGroups = [];
                      if(user.groups !== undefined)  userGroups = user.groups;
                      return (
                          <tr key={j}>
                            <td>{user.username}</td>
								<td><Link to={'/users/view/' + encodeURIComponent(`${user.username}`)}>{user.cn}</Link></td>
								<td>{
									user.email instanceof Array ? user.email.map((email,i) => {
										return [ <a href={"mailto:"+email} target="_blank">{email}</a> , <br /> ];
									}) : <i>(none)</i>
								}</td>
                            <td>{user.userCategory}</td>
                            <td><Glyphicon glyph={user.enabled ? 'check':'unchecked'} /></td>
                            <td>
							{
								user.groups instanceof Array ? user.groups.map((group,pos) => {
									let retArray = [];
									if(pos>0) {
									  retArray.push(", ");
									}
									retArray.push(<Link to={'/groups/edit/' + encodeURIComponent(`${group}`)}>{group}</Link>);
									return retArray;
								}) : <i>(none)</i>
							}
                            </td>
                            <td className="border4colspan">
                              <Link className="btn btn-success btn-xs editViewButton" role="button" to={'/users/view/' + encodeURIComponent(`${user.username}`)}>
                                View&nbsp;
								<Glyphicon glyph="user" />
                              </Link>
                              <Link className="btn btn-primary btn-xs editViewButton" role="button" to={'/users/edit/' + encodeURIComponent(`${user.username}`)}>
                                Edit&nbsp;
								<Glyphicon glyph="edit" />
                              </Link>
                              <br/>
								<Link className="btn btn-danger btn-xs changePasswordButton" role="button" to={'/users/password/' + encodeURIComponent(`${user.username}`)}>
									Change Password&nbsp;
								<Glyphicon glyph="pencil" />
								</Link>
                            </td>
                          </tr>
                      );
                    })}
                      </tbody>
              </Table>
     );
};

UserTable.propTypes = {
    users: React.PropTypes.array.isRequired
};
module.exports = UserTable;
