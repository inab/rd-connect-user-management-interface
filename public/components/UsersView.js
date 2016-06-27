var UsersView = React.createClass({
  propTypes: {
    users: React.PropTypes.array.isRequired,
    newUserForm: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
  },

  render: function(){
    var userItemElements = this.props.users
      .map(function(user){ return React.createElement(UserItem, Object.assign(user, {id: user.key})); });
    
    return (
      React.createElement('div', {className: 'UsersView'},
        React.createElement('h1', {className: 'UsersView-title'}, "Users"),
        React.createElement('ul', {className: 'UsersView-list'}, userItemElements),
        React.createElement(UserForm,{
          value: this.props.newUserForm, 
          actions: this.props.actions
        })
      )
    );
  },
});