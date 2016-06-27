var UserView= React.createClass({
  propTypes:{
    users: React.PropTypes.array.isRequired,
    userForms: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired,
    params:React.PropTypes.object.isRequired,

  },
  render: function(){
    var key = this.props.params.id;
    var userForm = this.props.userForms[key] ||
      this.props.users.filter(function(user){ return user.key == key})[0];
    return (
      !userForm
        ?React.createElement(NotFoundView)
        :React.createElement('div',{className:'UserView'},
          React.createElement('h1',{className:'UserView-title'}, "Edit User"),
          React.createElement(UserForm,{
            value: userForm,
            actions: this.props.actions
          })
        )
    );
  },
});