import React from 'react';
import Select from 'react-select';

export function genCustomUsersWidgetInstance(selectableUsers) {
	let customUsersWidgetInstance = (props) => {
		return (
			<Select
				disabled={props.disabled}
				placeholder="Select the user(s)"
				options={selectableUsers}
				value={props.value}
				onChange={(values) => props.onChange(values)}
				multi
			/>
		);
	};
	customUsersWidgetInstance.propTypes = {
		disabled: React.PropTypes.bool.isRequired,
		value: React.PropTypes.any.isRequired,
		onChange: React.PropTypes.func.isRequired
	};
	return customUsersWidgetInstance;
}

