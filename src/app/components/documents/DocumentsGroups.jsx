import React from 'react';
import { Row, Col, Panel, Table } from 'react-bootstrap';
import Underscore from 'underscore';
import { Link } from 'react-router';


const DocumentsGroups = ({data}) => {
  //console.log('Data so far is: ', data);
   var sortedData = Underscore
    .chain(data)
    .sortBy(function(groupObjects){ return groupObjects.cn; })
    .value();
  //console.log('sortedData so far is: ', sortedData);
  return (
      <div>
      <h3> Documents related to the Groups </h3>
      <Row className="show-grid">
        <Col xs={12} md={10} >
                  <Panel collapsible defaultExpanded center header="Documents">
                    <Table responsive className="table-list">
                      <thead>
                        <tr>
                          <th>Group Name</th>
                          <th>Description</th>
                          <th>Owners</th>
                          <th colSpan="2">Document Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                      {sortedData.map(function(group,i){
                        var listOwners = group.owner.sort();
                        //console.log('listOwners contains: ', listOwners);
                         return (
                           <tr key={i}>
                              <td><strong>{group.cn}</strong></td>
                              <td>{group.description}</td>
                              <td>
                                <ul className="user-ul">
                                {listOwners.map(function(owner, j){
                                    return (
                                        <li key={j}><Link to={'/users/view/' + owner}>{owner}</Link></li>
                                    );
                                  })}
                                </ul>
                              </td>
                               <td className="border4colspan">
                              
                                <Link className="btn btn-primary editViewButton" role="button" to={'/documents/groups/' + encodeURIComponent(`${group.cn}`)}>
                                  Manage
                                </Link>
                              </td>
                              <td className="border4colspan">
                                <Link className="btn btn-primary editViewButton" role="button" to={'/documents/groups/' + encodeURIComponent(`${group.cn}`) + '/new'}>
                                  New
                                </Link>
                              </td>
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

DocumentsGroups.propTypes = {
    data: React.PropTypes.array.isRequired
};
module.exports = DocumentsGroups;
