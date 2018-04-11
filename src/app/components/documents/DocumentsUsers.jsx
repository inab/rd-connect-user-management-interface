var React = require('react');
import { Checkbox, Row, Col, Panel, Table } from 'react-bootstrap';
var Underscore = require('underscore');
import { Link } from 'react-router';


const DocumentsUsers = ({data}) => {
  //console.log('Data so far is: ', data);
  var groupedData = Underscore
    .chain(data)
    .groupBy('organizationalUnit')
    .toArray()
    .sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
    .value();

  return (
     <div>
      <h3> Documents related to Users </h3>
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
                          <th>Full Name</th>
                          <th>Email</th>
                          <th>Category</th>
                          <th>Enabled</th>
                          <th>Groups</th>
                          <th colSpan="2">Document Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                    {ou.map(function(user,j){
                      //console.log(user);
                      var isChecked = user.enabled;
                      var urlParams = { data: user };
                      var userGroups = user.groups !== undefined ? user.groups : [];
                      return (
                          <tr key={j}>
                            <td><Link to={'/users/view/' + encodeURIComponent(`${user.username}`)}>{user.username}</Link></td>
                            <td>{user.cn}</td>
                            <td><a href={"mailto:"+user.email} target="_blank">{user.email}</a></td>
                            <td>{user.userCategory}</td>
                            <td><Checkbox checked={isChecked} readOnly /></td>
                            <td>
							{
								userGroups.length > 0 ? userGroups.map((group,pos) => {
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
                              
                              <Link className="btn btn-primary editViewButton" role="button" to={'/documents/users/' + encodeURIComponent(`${user.username}`)}>
                                Manage
                              </Link>
                            </td>
                            <td className="border4colspan">
                              <Link className="btn btn-primary editViewButton" role="button" to={'/documents/users/' + encodeURIComponent(`${user.username}`) + '/new'}>
                                New
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

DocumentsUsers.propTypes = {
    data: React.PropTypes.array.isRequired
};
module.exports = DocumentsUsers;
