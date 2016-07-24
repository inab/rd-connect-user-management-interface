var React = require('react');
import { Row, Col, Panel, Table } from 'react-bootstrap';
var Underscore = require('underscore');
import { Link } from 'react-router';


const UsersGroups = ({data}) => {
    //console.log("Data so far is: ", data);
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
                            <th>User Name</th>
                            <th>Common Name</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                        {ou.map(function(user,j){
                          return (
                            <tr key={j}>
                              <td>{j}</td>
                              <td>{user.username}</td>
                              <td>{user.cn}</td>
                              <td><Link to={'/users/groups/view/' + user.username}>List Groups</Link>/<Link to={'/users/groups/edit/' + user.username}> Edit Groups</Link></td>
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
module.exports = UsersGroups;
