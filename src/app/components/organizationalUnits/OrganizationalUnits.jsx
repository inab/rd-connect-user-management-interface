var React = require('react');

import {Panel, Table, Accordion, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router';
var imageNotFoundSrc = require('../users/defaultNoImageFound.js');

const OrganizationalUnits = ({data, organizationalUnits}) => {
    console.log('Users grouped by OU and sorted so far is: ', data);//Users grouped by OU and sorted
    console.log('organizationalUnits so far is: ', organizationalUnits);//Array of OU(objects)
    //var ouImage = this.props.data.picture;
		//if (typeof userImage === 'undefined'){
		//	userImage = imageNotFoundSrc.src;
		//}
    return (
      <div>
        <h3> List of Organizational Units </h3>
        <Accordion>
          {data.map(function(ou,i){
              console.log('ou contains', ou);
              var organizationalUnit = ou[0].organizationalUnit;
              var organizationalUnitObject = organizationalUnits[i];
              var ouImage = organizationalUnitObject.picture;
              console.log('organizationalUnit contains', organizationalUnit);
              console.log('organizationalUnitObject contains', organizationalUnitObject);
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
                        <td><img src={ouImage} width="100" alt="image_organizationalUnit" /></td>
                        <td>Links</td>
                        <td>
                          <Link className="btn btn-info editViewButton" role="button" to={'/organizationalUnits/edit/' + encodeURIComponent(`${organizationalUnitObject.organizationalUnit}`)}>
                            Edit
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
                        <th>Edit user's info</th>
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
                          <td>
                            <Link className="btn btn-info editViewButton" role="button" to={'/users/edit/' + encodeURIComponent(`${user.username}`)}>Edit</Link>
                          </td>
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

OrganizationalUnits.propTypes = {
    data: React.PropTypes.array.isRequired,
    organizationalUnits: React.PropTypes.array.isRequired
};
module.exports = OrganizationalUnits;
