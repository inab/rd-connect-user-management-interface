var UserItem = React.createClass({
  propTypes:{
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    firstName: React.PropTypes.string.isRequired,
    lastName: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    position: React.PropTypes.string.isRequired,
    institutionName: React.PropTypes.string.isRequired,
    institutionWebsite: React.PropTypes.string.isRequired,
    institutionNature: React.PropTypes.string.isRequired,
    nameOfDepartment: React.PropTypes.string,
  },
  render: function(){
    return (
      React.createElement('div', {className:'UserItem'},
        //React.createElement('h2', {className:'UserItem-firstName'}, this.props.firstName+" "+this.props.lastName),
        React.createElement(Link, {
          className: 'UserItem-firstName',
          location: {name: 'editUser', options: {id: this.props.id}},
        }, this.props.firstName + " " + this.props.lastName),

        React.createElement('div', { className:'UserItem-email'}, " (" + this.props.email +")"),
        React.createElement('div', { className:'UserItem-institutionName'}, this.props.position+" at "+this.props.institutionName)
      )
    );
  },
});