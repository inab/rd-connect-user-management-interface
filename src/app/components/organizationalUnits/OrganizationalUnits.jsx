var React = require('react');

import {Panel, Table, Accordion, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router';
var imageNotFoundSrc = require('../users/defaultNoImageFound.js');

const OrganizationalUnits = ({data, organizationalUnits}) => {
    var dataUsers= Object.assign({},data);
    //console.log('dataUsers ', dataUsers);
    //console.log('organizationalUnits contains: ', organizationalUnits);//Array of OU(objects)
    //We create an structure to search for organizationalUnit info doing something like lookup[organizationalUnitName]
    var lookup = {};
    for (var i = 0, len = organizationalUnits.length; i < len; i++) {
        lookup[organizationalUnits[i].organizationalUnit] = organizationalUnits[i];
    }
    //console.log('lookup object: ', lookup);
    return (
      <div>
        <h3> List of Organizational Units</h3>
        <Accordion>
        {Object.keys(organizationalUnits).map(function(key, i) {
            var objOrganizationalUnit = organizationalUnits[key];
            var organizationalUnitName = objOrganizationalUnit.organizationalUnit;
            var listOfUsers = Object.assign( [], dataUsers[organizationalUnitName]);
            //console.log('listOfUsers: ', listOfUsers);
            var picture = objOrganizationalUnit.picture;

             if(objOrganizationalUnit.links !== undefined) var links = objOrganizationalUnit.links;
             else links = [];
             return (
              <Panel header={objOrganizationalUnit.organizationalUnit} key={i} eventKey={i}>
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
                        <td>{objOrganizationalUnit.organizationalUnit}</td>
                        <td>{objOrganizationalUnit.description}</td>
                        <td><img src={picture} width="100" alt="image_organizationalUnit" /></td>
                        <td>
                          <ul className="user-ul">
                              {
                                links.map(function(objLink, k){
                                  return (
                                    <li key={k}><a href={objLink.uri} target="_blank">{objLink.uri}</a></li>
                                  );
                                })
                              }
                            </ul>
                        </td>
                        <td style={{textAlign:'center'}}>
                          <Link className="btn btn-primary editViewButton" role="button" to={'/organizationalUnits/edit/' + encodeURIComponent(`${objOrganizationalUnit.organizationalUnit}`)}>
                            Edit
                          </Link>
                      </td>
                      </tr>
                    </tbody>
                  </Table>
                  <h4>Users inside {objOrganizationalUnit.organizationalUnit} OU:</h4>
                  <Table responsive striped bordered condensed hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>User Name</th>
                        <th>Common Name</th>
                        <th>User Category</th>
                        <th>Enabled</th>
                        <th>Email</th>
                        <th>Edit user's info</th>
                        </tr>
                    </thead>
                    <tbody>
                      {listOfUsers.map(function(user,j){
                        var isChecked = user.enabled;
                        return (
                          <tr key={j}>
                              <td>{j + 1}</td>
                              <td>{user.username}</td>
                              <td>{user.cn}</td>
                              <td>{user.userCategory}</td>
                              <td><Checkbox checked={isChecked} readOnly /></td>
                              <td>{user.email}</td>
                              <td style={{textAlign:'center'}}>
                              <Link className="btn btn-primary editViewButton" role="button" to={'/users/edit/' + encodeURIComponent(`${user.username}`)}>Edit</Link>
                              </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    </Table>
                </Panel>
             )})}
        </Accordion>
      </div>
    );
  };

OrganizationalUnits.propTypes = {
    data: React.PropTypes.array.isRequired,
    organizationalUnits: React.PropTypes.array.isRequired
};
module.exports = OrganizationalUnits;
