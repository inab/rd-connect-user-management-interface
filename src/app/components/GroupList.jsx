var React = require('react');
var Bootstrap = require('react-bootstrap');

var Group = require('./Group.jsx');

const GroupList = ({data}) => {
  return (
    <div>
      <h3> List of Groups </h3>
      <ul className="GroupList">
        {data.map((group,index) => {
          return (
            <li className="list-group-item" key={ group.cn}>
              <Group group={group}></Group>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

module.exports = GroupList;