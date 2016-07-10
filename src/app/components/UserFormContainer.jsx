var React = require('react');
var jQuery = require('jquery');
var UserForm = require('./UserForm.jsx');

var UserFormContainer = React.createClass({
  getInitialState: function() {
    return { schema: null, data: null };
  },
  
  loadUserSchema: function() {
	  jQuery.get('json/userValidation.json').done(function(schema) {
      this.setState({schema: schema});
    }.bind(this));
  },
  loadUserData: function() {
	  jQuery.get('json/user-a.canada.json').done(function(data) {
      this.setState({data: data});
      this.loadUserSchema();
    }.bind(this));
  },
  componentDidMount: function() {
    	this.loadUserData();
  },

  render: function() {
    if (this.state.schema && this.state.data) {
      return (
      	<div>
	    	<UserForm   schema={this.state.schema}  data={this.state.data}  />
	    </div>
      )
    }

    return <div>Loading...</div>;
  }
});
/*
var UserFormContainer = React.createClass({
	getInitialState: function() {
    	return {
      		schema: {},
      		data: {}
    	};
  	},
  	componentDidMount: function() {
    	this.serverRequest = jQuery.get("json/userValidation.json", function (schema) {
      		this.setState({
        		schema: schema
      		});
    	}.bind(this));
  	},
  	componentWillUnmount: function() {
	    this.serverRequest.abort();
	},
	render: function() {
		//console.log(this.state.schema);
	    return (
	      <div>
	        	<UserForm   schema={this.state.schema}  />
	      </div>
	    );
  	}
});
*/

module.exports = UserFormContainer;
