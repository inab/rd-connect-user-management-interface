var React = require('react');
var Bootstrap = require('react-bootstrap');

var OrganizationalUnit = require('./OrganizationalUnit.jsx');

const OrganizationalUnitList = ({data}) => {
  return (
    <div>
      <h3> List of Organizational Units </h3>
      <ul className="userList">
        {data.map((organizationalUnit,index) => {
          return (
            <li className="list-group-item" key={ OrganizationalUnit.organizationalUnit}>
              <OrganizationalUnit organizationalUnit={organizationalUnit}></OrganizationalUnit>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

module.exports = OrganizationalUnitList;