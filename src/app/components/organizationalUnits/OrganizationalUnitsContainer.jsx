import React from 'react';
import OrganizationalUnits from './OrganizationalUnits.jsx';

import AbstractFetchedDataContainer from '../AbstractUMContainer.jsx';

function compare(a,b) {
	if(a.surname[0] < b.surname[0]) {
		return -1;
	}
	if(a.surname[0] > b.surname[0]) {
		return 1;
	}
	return 0;
}

function sortObjOusWithUsers(objOusWithUsers){
	//console.log(ousWithUsers);
	for(var organizationalUnitName in objOusWithUsers){
		// skip loop if the property is from prototype
		if(!objOusWithUsers.hasOwnProperty(organizationalUnitName)){
			continue;
		}
		var arrayUsers = objOusWithUsers[organizationalUnitName];
		arrayUsers.sort(compare);
		objOusWithUsers[organizationalUnitName] = arrayUsers;
	}
	return objOusWithUsers;
}

class OrganizationalUnitsContainer extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
		this.history = props.history;
	}
	
	componentWillMount() {
		super.componentWillMount();
		
		this.setState({
			organizationalUnits: null,
			data: null,
			task: this.props.route.task
		});
	}
	
	componentDidMount() {
		let errHandler = (err) => {
			this.onChange({
				...err,
				showModal: true
			});
		};
		
		this.organizationalUnitsPromise()
			.then((organizationalUnits) => {
				//console.log("success!");
				//we sort the array of objects based on the organizationalUnit name
				organizationalUnits.sort(function(a,b) {
					return (a.organizationalUnit > b.organizationalUnit) ? 1 : ((b.organizationalUnit > a.organizationalUnit) ? -1 : 0);}
				);
				this.onChange({organizationalUnits: organizationalUnits});
				
				return this.usersPromise();
			})
			.then((users) => {
				//this.setState({users: users});
				
				let objOusWithUsers = {};
				let organizationalUnits = this.state.organizationalUnits;
				organizationalUnits.forEach((organizationalUnit) => {
					let organizationalUnitName = organizationalUnit.organizationalUnit;
					//console.log('organizationalUnitName', organizationalUnitName);
					objOusWithUsers[organizationalUnitName] = [];
				});
				//Once we have the array with the objects, we fill it with the users iterating over data variable which contains all the users
				//console.log('objOusWithUsers: ', objOusWithUsers);

				users.forEach((user) => {
					let organizationalUnitName = user.organizationalUnit;
					//We have the user and its organizationalUnit. We can load the user in its place inside arrayOusWithUsers
					if(organizationalUnitName in objOusWithUsers){
						let tmpArrayUsers = objOusWithUsers[organizationalUnitName];
						tmpArrayUsers.push(user);
						objOusWithUsers[organizationalUnitName] = tmpArrayUsers;
					}
				});
				let ousWithUsersSorted = sortObjOusWithUsers(objOusWithUsers);
				//var jsonStringOusWith = JSON.stringify([...ousWithUsersSorted]);
				//console.log('jsonStringOusWith: ', jsonStringOusWith);
				this.setState({data: ousWithUsersSorted});
				//console.log(this.state.data);
				
			}, errHandler);
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
		this.setState({task: this.props.route.task});
	}
	
	render() {
		//console.log('Data contains so far: ', this.state.data);
		//console.log('OrganizationalUnits contain ', this.state.organizationalUnits );
		if(this.state.error) {
			return (
				<div>Error {this.state.error}</div>
			);
		}
		if(this.state.data && this.state.organizationalUnits) {
			return (
				<div>
					<OrganizationalUnits data={this.state.data} organizationalUnits={this.state.organizationalUnits} />
				</div>
			);
		}
		return <div>Loading...</div>;
	}
}

export default OrganizationalUnitsContainer;
