import React from 'react';

import { Glyphicon, Row, Panel, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import Underscore from 'underscore';

const Groups = ({groups}) => {
  //console.log("Data so far is: ", data);
  var sortedData = Underscore
    .chain(groups)
    .sortBy(function(groupObjects){ return groupObjects.cn; })
    .value();
  //console.log('sortedData so far is: ', sortedData);
  return (
    <div>
      <h3 style={{float:'left'}}> List of Groups </h3>
      <div className="right">
        <Link className="btn btn-primary" role="button" to={'/groups/new/'}>Add New Group&nbsp;<Glyphicon glyph="plus" /></Link>
      </div>
      <div className="clear-both" />
      <Row className="show-grid">
              {sortedData.map(function(group,i){
                var listOwners = group.owner.sort();
                var groupMembers = group.members.sort();
                //var listMembers=group.members.join(", ");
                return (
                  <Panel collapsible defaultExpanded center header={group.description} key={i}>
                    <Table responsive className="table-list">
                      <thead>
                        <tr>
                          <th>Short name</th>
                          <th>Purpose</th>
                          <th>Owner</th>
                          <th>Members</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                    <tr key={i}>
                      <td>{group.cn}</td>
                      <td>{group.groupPurpose}</td>
                      <td>
                        {listOwners.map(function(owner, j){
							let retval = [];
							if(j > 0) {
								retval.push(', ');
							}
							retval.push(<Link to={'/users/view/' + owner}>{owner}</Link>);
							return retval;
                          })}
                      </td>
                      <td>
                        {groupMembers.map(function(member, k){
							let retval = [];
							
							if(k < 3) {
								if(k > 0) {
									retval.push(', ');
								}
								retval.push(<Link to={'/users/view/' + member}>{member}</Link>);
							} else if(k === 3) {
								retval.push(' and ' + (groupMembers.length - k) + ' more');
							}
							return retval;
                          })}
                      </td>
                      <td>
                        <Link className="btn btn-primary editViewButton" role="button" to={'/groups/edit/' + encodeURIComponent(`${group.cn}`)}>
                          Edit&nbsp;
							<Glyphicon glyph="edit" />
                        </Link>
                      </td>
                    </tr>
                    </tbody>
            </Table>
          </Panel>
                );
              })}
      </Row>
    </div>
  );
};

Groups.propTypes = {
    groups: React.PropTypes.array.isRequired
};

export default Groups;
