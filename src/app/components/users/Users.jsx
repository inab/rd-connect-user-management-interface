var React = require('react');
var Bootstrap = require('react-bootstrap');
import { Row, Col, Code, Panel, Table, ListGroup, ListGroupItem, Button, Checkbox } from 'react-bootstrap';
var Underscore = require('underscore');
import { Link } from 'react-router';
var User = require('./User.jsx');


const Users = ({data}) => {
    //console.log("Data so far is: ", data);
    var groupData=Underscore
      .chain(data)
      .groupBy('organizationalUnit')
      .toArray()
      .sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
      .value()

      
    return (
    <div>
      <h3> List of Users </h3>
          {groupData.map(function(ou,i){
              var organizationalUnit=ou[0].organizationalUnit;
              var headerText=organizationalUnit;
              return(
                <Row className="show-grid">
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
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                        {ou.map(function(user,j){
                          var isChecked=user.enabled;
                          return (
                            <tr key={j}>
                              <td>{j}</td>
                              <td>{user.username}</td>
                              <td>{user.cn}</td>
                              <td>{user.userCategory}</td>
                              <td><Checkbox checked={isChecked} readOnly /></td>
                              <td><Link to={"/userView/"+user.username}>View </Link>/<Link to={"/userEdit/"+user.username}> Edit</Link></td>
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
}
module.exports = Users;