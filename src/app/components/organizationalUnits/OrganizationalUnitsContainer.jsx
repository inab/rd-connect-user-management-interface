import React from 'react';
import jQuery from 'jquery';
import OrganizationalUnits from './OrganizationalUnits.jsx';
import Underscore from 'underscore';

import config from 'config.jsx';
function compare(a,b) {
  if (a.surname[0] < b.surname[0])
    return -1;
  if (a.surname[0] > b.surname[0])
    return 1;
  return 0;
}	
function sortObjOusWithUsers (objOusWithUsers){
	//console.log(ousWithUsers);
	for (var organizationalUnitName in objOusWithUsers){
		// skip loop if the property is from prototype
		if (!objOusWithUsers.hasOwnProperty(organizationalUnitName)){
			continue;
		}
		var arrayUsers = objOusWithUsers[organizationalUnitName];
		arrayUsers.sort(compare);
		objOusWithUsers[organizationalUnitName] = arrayUsers;
	}
	return objOusWithUsers;
}

var OrganizationalUnitsContainer = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentWillMount: function() {
		this.loadOrganizationalUnitsFromServer();
		//this.loadUsersInterval = setInterval(this.loadOrganizationalUnitsFromServer, 15000);
	},
	componentWillUnmount: function(){
		clearInterval(this.loadUsersInterval);
		this.serverRequest.abort();
	},
	loadOrganizationalUnitsFromServer: function() {
		this.serverRequest = jQuery.ajax({
			url: config.ouBaseUri,
			dataType: 'json',
			cache: false,
			success: function(organizationalUnits) {
				//console.log("success!");
				//we sort the array of objects based on the organizationalUnit name
				organizationalUnits.sort(function(a,b) {return (a.organizationalUnit > b.organizationalUnit) ? 1 : ((b.organizationalUnit > a.organizationalUnit) ? -1 : 0);} ); 
				this.setState({organizationalUnits: organizationalUnits});
				this.loadUsersFromServer();
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error("json/OrganizationalUnitalUnits.json", status, err);
				console.error(xhr.status);
				this.setState({error: xhr.status + ' (Retrieving Organizational Units)'});
			}.bind(this)
		});
	},
	mapToJson: function(map){
		return JSON.stringify([...map]);
	},
	jsonToMap: function(jsonStr){
		return new Map(JSON.parse(jsonStr));
	},
	loadUsersFromServer: function() {
		jQuery.ajax({
			url: config.usersBaseUri,
			dataType: 'json',
			cache: false,
			success: function(data) {
				console.log('success!');
				//console.log('organizationalUnits: ', this.state.organizationalUnits)
				//console.log('data contains the users: ', data);
				var objOusWithUsers = {};
				this.state.organizationalUnits.forEach(function(organizationalUnit) {
					var organizationalUnitName = organizationalUnit.organizationalUnit;
					//console.log('organizationalUnitName', organizationalUnitName);
					objOusWithUsers[organizationalUnitName] = [];
				}, this);
				//Once we have the array with the objects, we fill it with the users iterating over data variable which contains all the users
				//console.log('objOusWithUsers: ', objOusWithUsers);

				data.forEach(function(user) {
					var organizationalUnitName = user.organizationalUnit;
					//We have the user and its organizationalUnit. We can load the user in its place inside arrayOusWithUsers
					if (objOusWithUsers[organizationalUnitName] !== undefined){
						var tmpArrayUsers = objOusWithUsers[organizationalUnitName];
						tmpArrayUsers.push(user);
						objOusWithUsers[organizationalUnitName] = tmpArrayUsers;
					}
				}, this);
				var ousWithUsersSorted = sortObjOusWithUsers(objOusWithUsers);
				//var jsonStringOusWith = JSON.stringify([...ousWithUsersSorted]);
				//console.log('jsonStringOusWith: ', jsonStringOusWith);
				this.setState({data: ousWithUsersSorted});
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
		//console.log('OrganizationalUnits contain ', this.state.organizationalUnits );
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
