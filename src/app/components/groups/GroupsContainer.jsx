import React from 'react';
import jQuery from 'jquery';
import Groups from './Groups.jsx';

import config from 'config.jsx';

var GroupsContainer = React.createClass({
	getInitialState: function() {
		return {data: []};
	},
	componentWillMount: function() {
		this.loadGroupsFromServer();
		this.loadGroupsInterval = setInterval(this.loadGroupsFromServer, 15000);
	},
	componentWillUnmount: function(){
		clearInterval(this.loadGroupsInterval);
		this.serverRequest.abort();
	},
	loadGroupsFromServer: function() {
		this.serverRequest = jQuery.ajax({
			url: config.groupsBaseUri,
			dataType: 'json',
			cache: false,
			success: function(data) {
				//console.log("success!");
				this.setState({data: data});
				//console.log(this.state.data);
			}.bind(this),
			error: function(xhr, status, err) {
				//console.error("json/groups.json", status, err);
				console.error(xhr.status);
				this.setState({error: xhr.status + ' (Retrieving groups)'});
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
					<Groups data={this.state.data} />
				</div>
			);
		}
	}
});

module.exports = GroupsContainer;
