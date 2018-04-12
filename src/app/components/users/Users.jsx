import React from 'react';
import { Glyphicon, Checkbox, Row, Col, Panel, Table } from 'react-bootstrap';
import Underscore from 'underscore';
import { Link } from 'react-router';
//import User from './User.jsx';
import UserTable from './UserTable.jsx';


const Users = ({data}) => {
  //console.log("Data so far is: ", data);
  var groupedData = Underscore
    .chain(data)
    .groupBy('organizationalUnit')
    .toArray()
    .sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
    .value();

  return (
     <div>
      <h3 style={{float:'left'}}> List of Users</h3>
      <div className="right">
        <Link className="btn btn-primary" role="button" to={'/users/new/'}>Add New User&nbsp;<Glyphicon glyph="plus" /></Link>
      </div>
      <div className="clear-both" />
      <Row className="show-grid">
              {groupedData.map(function(ou,i){
                var organizationalUnit = ou[0].organizationalUnit;
                return (
                  <Panel collapsible defaultExpanded center header={organizationalUnit} key={i}>
					<UserTable users={ou} />
					</Panel>
				);
          })}
      </Row>
    </div>
  );
};

Users.propTypes = {
    data: React.PropTypes.array.isRequired
};
module.exports = Users;
