var React = require('react');

import { Row, Col, Panel, Table } from 'react-bootstrap';
import { Link } from 'react-router';
var Underscore = require('underscore');


const OrganizationalUnits = ({data}) => {
    console.log('Data so far is: ', data);
    var sortedData = Underscore
      .chain(data)
      .sortBy(function(ouObjects){ return ouObjects.organizationalUnit; })
      .value();
    console.log('sortedData so far is: ', sortedData);
    return (
    <div>
        <Row className="show-grid">
          <Col xs={12} md={10} >
            <Panel collapsible defaultExpanded center header="List of Organizational Units">
              <Table responsive>
                <thead>
                  <tr>
                    <th>Organization Name</th>
                    <th>Picture</th>
                    <th>Description</th>
                    <th>Links</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                {sortedData.map(function(ou,i){
                  var organizationalUnit = ou.organizationalUnit;
                  return (
                    <tr key={i}>
                      <td><strong>{organizationalUnit}</strong></td>
                      <td><img src={'data:image/jpeg;base64,' + ou.picture} alt="image Organizational Unit" /></td>
                      <td>{ou.description}</td>
                      <td>links</td>
                      <td><Link to={'/organizationalUnits/view/' + ou.organizationalUnit}>View </Link>/<Link to={'/organizationalUnits/edit/' + ou.organizationalUnit}> Edit</Link></td>
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

module.exports = OrganizationalUnits;
