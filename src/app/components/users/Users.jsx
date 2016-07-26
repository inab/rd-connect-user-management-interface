var React = require('react');

import { Row, Col, Panel, Table, Checkbox } from 'react-bootstrap';
var Underscore = require('underscore');
import { Link } from 'react-router';


const Users = ({data}) => {
    //console.log("Data so far is: ", data);
    var groupData = Underscore
      .chain(data)
      .groupBy('organizationalUnit')
      .toArray()
      .sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
      .value();

    return (
    <div>
      <h3> List of Users </h3>
          {groupData.map(function(ou,i){
              var organizationalUnit = ou[0].organizationalUnit;
              var headerText = organizationalUnit;
              return (
                <Row className="show-grid" key={i}>
                  <Col xs={12} md={10} >
                    <Panel collapsible defaultExpanded header={headerText} key={i}>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Common Name</th>
                            <th>User Category</th>
                            <th>Enabled</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                        {ou.map(function(user,j){
                          var isChecked = user.enabled;
                          return (
                            <tr key={j}>
                              <td>{j}</td>
                              <td>{user.username}</td>
                              <td>{user.cn}</td>
                              <td>{user.userCategory}</td>
                              <td><Checkbox checked={isChecked} readOnly /></td>
                              <td><Link to={'/users/view/' + user.username}>View </Link>/<Link to={'/users/edit/' + user.username}> Edit</Link>/<Link to={'/users/enable-disable/' + user.username}> Enable/Disable</Link></td>
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
Users.propTypes = {
    data: React.PropTypes.array.isRequired,
    task: React.PropTypes.string.isRequired
};
module.exports = Users;
