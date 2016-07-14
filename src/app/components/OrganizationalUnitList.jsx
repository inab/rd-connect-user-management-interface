var React = require('react');
var Bootstrap = require('react-bootstrap');

var OrganizationalUnit = require('./OrganizationalUnit.jsx');
import { Panel, Table, ListGroup, ListGroupItem, Button, Checkbox } from 'react-bootstrap';
import { Link } from 'react-router';


const OrganizationalUnitList = ({data}) => {
    console.log("Data so far is: ", data);

    return (
    <div>
      <h3> List of Organizational Units </h3>
          {data.map(function(ou,i){
              var organizationalUnit=ou.organizationalUnit;
              var headerText=organizationalUnit;
              return(
                <Panel collapsible defaultExpanded center header={headerText} key={i}>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Picture</th>
                        <th>Description</th>
                        <th>Links</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                        <tr key={i}>
                          <td><img src={"data:image/jpeg;base64,"+ou.picture} alt="image Organizational Unit" /></td>
                          <td>{ou.description}</td>
                          <td>Links</td>
                          <td><Link to={"/organizationEdit/"+ou.organizationalUnit}>Edit</Link></td>
                        </tr>
                    </tbody>
                  </Table>
                </Panel>
              );
          })}
    </div>
    );
}

module.exports = OrganizationalUnitList;