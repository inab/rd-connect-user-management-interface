var React = require('react');

import {Link, Panel, Table, Accordion, Checkbox } from 'react-bootstrap';


const OrganizationalUnits = ({data, organizationalUnits}) => {
    console.log('Data so far is: ', data);
    console.log('organizationalUnits so far is: ', organizationalUnits);
    /*<td><img src={'data:image/jpeg;base64,' + ou.picture} alt="image Organizational Unit" /></td>*/
    return (
      <div>
        <h3> List of Organizational Units </h3>
        <Accordion>
          {data.map(function(ou,i){
            var organizationalUnit = ou[0].organizationalUnit;

            var organizationalUnitObject = organizationalUnits[i];
            console.log(organizationalUnitObject);
            //var route = '/organizationalUnits/edit/';
          return (
            <Panel header={organizationalUnit} key={i} eventKey={i}>
              <Table responsive striped bordered condensed hover className="table-list">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Picture</th>
                    <th>Links</th>
                    <th>Edit OU Info</th>
                  </tr>
                </thead>
                <tbody>
                    <tr>
                      <td>{organizationalUnitObject.organizationalUnit}</td>
                      <td>{organizationalUnitObject.description}</td>
                      <td>Picture</td>
                      <td>Links</td>
                      <td>
                        <Link className="btn btn-info" role="button" to={'/organizationalUnits/edit/' + encodeURIComponent(`${organizationalUnit}`)}>
                          Manage {organizationalUnit} OU
                        </Link>
                      </td>
                    </tr>
                </tbody>
              </Table>
              <h4>Users inside {organizationalUnit} OU:</h4>
              <Table responsive striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Common Name</th>
                    <th>User Category</th>
                    <th>Enabled</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                {ou.map(function(user,j){
                  var isChecked = user.enabled;
                  return (
                    <tr key={j}>
                      <td>{j + 1}</td>
                      <td>{user.username}</td>
                      <td>{user.cn}</td>
                      <td>{user.userCategory}</td>
                      <td><Checkbox checked={isChecked} readOnly /></td>
                      <td>{user.email}</td>
                    </tr>
                  );
                })}
                </tbody>
              </Table>
            </Panel>
          );
          })}
        </Accordion>
      </div>
    );
  };
  /*    <div>
          <Row className="show-grid">
            <Col xs={12} md={10} >
              <Panel collapsible defaultExpanded header="List of Organizational Units">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Organization Name</th>
                      <th>Description</th>
                      <th>Users</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {data.map(function(ou,i){
                    var organizationalUnit = ou[0].organizationalUnit;
                    var organizationalUnitInfo = organizationalUnits[i];
                    return (
                      <tr key={i}>
                        <td><strong>{organizationalUnit}</strong></td>
                        <td>{organizationalUnitInfo.description}</td>
                        <td>
                          <ul className="user-ul">
                          {
                            ou.map(function(user, j){
                              return (
                                <li><Link to={'/users/view/' + encodeURIComponent(`${user.username}`)}>{user.cn}</Link></li>
                              );
                            })
                          }
                          </ul>
                        </td>
                        <td><Link to={'/organizationalUnits/view/' + organizationalUnit}>View </Link>/<Link to={'/organizationalUnits/edit/' + organizationalUnit}> Edit</Link></td>
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
};
*/
OrganizationalUnits.propTypes = {
    data: React.PropTypes.array.isRequired,
    organizationalUnits: React.PropTypes.array.isRequired
};
module.exports = OrganizationalUnits;
