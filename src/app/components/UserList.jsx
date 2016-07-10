var React = require('react');
var Bootstrap = require('react-bootstrap');

var User = require('./User.jsx');

const UserList = ({data}) => {
  return (
    <div>
      <h3> List of Users </h3>
      <ul className="userList">
        {data.map((user,index) => {
          return (
            <li className="list-group-item" key={ user.username}>
              <User user={user}></User>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

module.exports = UserList;