var React = require('react');

import { Panel, Table, Checkbox } from 'react-bootstrap';
var Underscore = require('underscore');



const OrganizationalUnitsUsers = ({data}) => {
    //console.log("Data so far is: ", data);
    var groupData = Underscore
      .chain(data)
      .groupBy('organizationalUnit')
      .toArray()
      .sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
      .value();

    return (
    <div>
      <h3> Users in Organizational Units </h3>
        {groupData.map(function(ou,i){
        var organizationalUnit = ou[0].organizationalUnit;
        var headerText = organizationalUnit;
        return (
          <Panel header={headerText} key={i} eventKey={i}>
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
              <tr>
                {/*<td colSpan="6">
                   <Link className="btn btn-primary" role="button" to={route} params={{organizationalUnit: "cnio"}}>
                    Manage {organizationalUnit}'s users
                   </Link>
                </td>*/}
              </tr>
              </tbody>
            </Table>
          </Panel>
        );
        })}
    </div>
  );
};
OrganizationalUnitsUsers.propTypes = {
    data: React.PropTypes.array.isRequired
};
module.exports = OrganizationalUnitsUsers;
