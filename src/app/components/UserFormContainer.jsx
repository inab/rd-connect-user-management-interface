var React = require('react');
var jQuery = require('jquery');
var UserForm = require('./UserForm.jsx');

var UserFormContainer = React.createClass({
  	loadUserDataFromServer: function(){
		alert("Inside loadUserDataFromServer");
		jQuery.when(

			jQuery.get("json/userValidation.json", function(schema) {
				//alert("Getting userValidation");
				//console.log(schema);
			    //this.setState({schema: schema});
			}, "json"),

		  	jQuery.get("json/user-"+this.props.params.username+".json", function(data) {
				//alert("Getting userData");    
				//console.log(data);
			    //this.setState(Object.assign(this.state, {data:data})); 
			}, "json")

		).then(function(schema,data) {

		  	// All have been resolved (or rejected), do your thing
		  	//alert("Well done!");
		  	return(data,schema);

		});
	},
	componentWillMount: function() {
		alert("Inside componentWillMount");
	    
	},
	componentDidMount: function() {
		alert("Inside componentDidMount");
	    return (this.loadUserDataFromServer());
	    //setInterval(this.loadUserFromServer, 200000);
	},
  	render: function() {
  		console.log("Rendering Bitches!");
  		console.log(this.data);
    	return (
        	<UserForm   />
    	);
  	}
});

module.exports = UserFormContainer;
