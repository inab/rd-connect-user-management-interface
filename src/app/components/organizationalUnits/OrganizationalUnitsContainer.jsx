import React from 'react';
import jQuery from 'jquery';
import OrganizationalUnits from './OrganizationalUnits.jsx';
import Underscore from 'underscore';

import config from 'config.jsx';

var OrganizationalUnitsContainer = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentWillMount: function() {
		this.loadUsersFromServer();
		setInterval(this.loadOrganizationalUnitsFromServer, 15000);
	},
	loadOrganizationalUnitsFromServer: function() {
		jQuery.ajax({
			url: config.ouBaseUri,
			dataType: 'json',
			cache: false,
			success: function(organizationalUnits) {
				console.log("success!");
				//we sort the array of objects based on the organizationalUnit name
				organizationalUnits.sort(function(a,b) {return (a.organizationalUnit > b.organizationalUnit) ? 1 : ((b.organizationalUnit > a.organizationalUnit) ? -1 : 0);} ); 
				this.setState({organizationalUnits: organizationalUnits});
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error("json/OrganizationalUnitalUnits.json", status, err);
				console.error(xhr.status);
				this.setState({error: xhr.status + ' (Retrieving Organizational Units)'});
			}.bind(this)
		});
	},
	loadUsersFromServer: function() {
		jQuery.ajax({
			url: config.usersBaseUri,
			dataType: 'json',
			cache: false,
			success: function(data) {
				//console.log("success!");
				var ousWithUsers = Underscore
					.chain(data)
					.groupBy('organizationalUnit')
					.toArray()
					.sortBy(function(ouObjects){ return ouObjects[0].organizationalUnit; })
					.value();
				this.setState({data: ousWithUsers});
				this.loadOrganizationalUnitsFromServer();
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
		//console.log('Data contains so far: ', this.state.data);
		//console.log('OrganizationalUnitalUnits contain ', this.state.organizationalUnits );
		if (this.state.error) {
			return (
				<div>Error {this.state.error}</div>
			);
		}
		if ((this.state.data) && (this.state.organizationalUnits)) {
			return (
				<div>
					<OrganizationalUnits data={this.state.data} organizationalUnits={this.state.organizationalUnits} />
				</div>
			);
		}
		return <div>Loading...</div>;
	}
});

module.exports = OrganizationalUnitsContainer;
