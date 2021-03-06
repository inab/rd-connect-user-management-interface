import React from 'react';
import Select from 'react-select';

const FLAVOURS = [
	{ label: 'Chocolate', value: 'chocolate' },
	{ label: 'Vanilla', value: 'vanilla' },
	{ label: 'Strawberry', value: 'strawberry' },
	{ label: 'Caramel', value: 'caramel' },
	{ label: 'Cookies and Cream', value: 'cookiescream' },
	{ label: 'Peppermint', value: 'peppermint' },
];

const WHY_WOULD_YOU = [
	{ label: 'Chocolate (are you crazy?)', value: 'chocolate', disabled: true },
].concat(FLAVOURS.slice(1));

var MultiSelectField = React.createClass({
	displayName: 'MultiSelectField',
	propTypes: {
		label: React.PropTypes.string,
        options: React.PropTypes.array.isRequired,
        initialSelected: React.PropTypes.array,
        onChangeSelected: React.PropTypes.func
	},
	getInitialState () {
		return {
			disabled: false,
			crazy: false,
			options: this.props.options,
			value: this.props.initialSelected,
		};
	},
	handleSelectChange (value) {//onChange
		//console.log('You\'ve selected:', value);
		this.setState({ value: value });
        this.props.onChangeSelected(value);
	},
	toggleDisabled (e) {
		this.setState({ disabled: e.target.checked });
	},
	toggleChocolate (e) {
		let crazy = e.target.checked;
		this.setState({
			crazy: crazy,
			options: crazy ? WHY_WOULD_YOU : FLAVOURS,
		});
	},
	render () {
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select multi simpleValue disabled={this.state.disabled} value={this.state.value} placeholder="Select the users that belong to this group)" options={this.state.options} onChange={this.handleSelectChange} />
				<div className="checkbox-list" />
			</div>
		);
	}
});

module.exports = MultiSelectField;
