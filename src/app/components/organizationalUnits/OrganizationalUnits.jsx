import React from 'react';

import { Glyphicon, Panel, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import UserTable from '../users/UserTable.jsx';

const OrganizationalUnits = ({data, organizationalUnits}) => {
    var dataUsers = Object.assign({},data);
    //console.log('dataUsers ', dataUsers);
    //console.log('organizationalUnits contains: ', organizationalUnits);//Array of OU(objects)
    //We create an structure to search for organizationalUnit info doing something like lookup[organizationalUnitName]
    var lookup = {};
    for(let i = 0, len = organizationalUnits.length; i < len; i++) {
		lookup[organizationalUnits[i].organizationalUnit] = organizationalUnits[i];
    }
    //console.log('lookup object: ', lookup);
    return (
      <div>
        <h3 style={{float:'left'}}> List of Organizational Units</h3>
        <div className="right"><Link className="btn btn-primary" role="button" to={'/organizationalUnits/new/'}>Add New Organization&nbsp;<Glyphicon glyph="plus" /></Link></div>
        <div className="clear-both" />
        {Object.keys(organizationalUnits).map(function(key, i) {
            var objOrganizationalUnit = organizationalUnits[key];
            var organizationalUnitName = objOrganizationalUnit.organizationalUnit;
            var listOfUsers = Object.assign( [], dataUsers[organizationalUnitName]);
            //console.log('listOfUsers: ', listOfUsers);
            var picture = objOrganizationalUnit.picture;

			var links = (objOrganizationalUnit.links !== undefined) ? objOrganizationalUnit.links : [];
             return (
              <Panel defaultExpanded collapsible header={objOrganizationalUnit.description} key={i} eventKey={i}>
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
                            Edit&nbsp;<Glyphicon glyph="edit" />
                          </Link>
                      </td>
                      </tr>
                    </tbody>
                  </Table>
                  <h4>Users inside {objOrganizationalUnit.organizationalUnit} OU:</h4>
                  <UserTable users={listOfUsers} />
                </Panel>
             );})
             }
      </div>
    );
  };

OrganizationalUnits.propTypes = {
    data: React.PropTypes.objectOf(React.PropTypes.array),
    organizationalUnits: React.PropTypes.array.isRequired
};
module.exports = OrganizationalUnits;
