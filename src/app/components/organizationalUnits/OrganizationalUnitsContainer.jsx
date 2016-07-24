var React = require('react');
var jQuery = require('jquery');
var OrganizationalUnits = require('./OrganizationalUnits.jsx');

var OrganizationalUnitsContainer = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount: function() {
		this.loadOrganizationalUnitsFromServer();
		//setInterval(this.loadOrganizationalUnitsFromServer, 20000);
	},
	loadOrganizationalUnitsFromServer: function() {
		jQuery.ajax({
			url: 'json/organizationalUnits.json',
			headers: {
				'X-CAS-Referer': window.location.href
			},
			dataType: 'json',
			cache: false,
			success: function(data) {
				//console.log("success!");
				this.setState({data: data});
				//console.log(this.state.data);
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error("json/OrganizationalUnitalUnits.json", status, err);
				console.error(xhr.status);
				this.setState({error: xhr.status + ' (Retrieving Organizational Units)'});
			}.bind(this)
		});
	},
	render: function() {
		if (this.state.error) {
			return (
				<div>Error {this.state.error}</div>
			);
		}
		if (this.state.data) {
			return (
				<div>
					<OrganizationalUnits data={this.state.data} />
				</div>
			);
		}
	}
});

module.exports = OrganizationalUnitsContainer;
