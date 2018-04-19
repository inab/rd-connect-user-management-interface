import React from 'react';

import { Panel } from 'react-bootstrap';
import Underscore from 'underscore';
import UserTable from '../users/UserTable.jsx';


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
            <UserTable users={ou} />
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
