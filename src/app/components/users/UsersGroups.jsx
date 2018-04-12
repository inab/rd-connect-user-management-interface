import React from 'react';
import { Row, Col, Checkbox, Panel, Table } from 'react-bootstrap';
import Underscore from 'underscore';
import { Link } from 'react-router';
import UserTable from './UserTable.jsx';

const UsersGroups = ({data}) => {
    //console.log("Data so far is: ", data);
    var groupData = Underscore
      .chain(data)
      .groupBy('organizationalUnit')
      .toArray()
      .sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
      .value();
    //console.log('groupData so far is: ', groupData);
    return (
    <div>
      <h3> Lists of groups that a user is member of </h3>
          {groupData.map(function(ou,i){
              let organizationalUnit = ou[0].organizationalUnit;
              let headerText = ou[0].organizationalUnit;
              //console.log('ou contains: ', ou);
              return (
                    <Panel collapsible defaultExpanded header={headerText} key={i}>
						<UserTable users={ou}/>
                    </Panel>
              );
          })}
    </div>
    );
};
UsersGroups.propTypes = {
    data: React.PropTypes.array.isRequired
};

module.exports = UsersGroups;
