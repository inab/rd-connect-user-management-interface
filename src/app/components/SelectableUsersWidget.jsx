import React from 'react';
import Select from 'react-select';

export function genCustomUsersWidgetInstance(selectableUsers) {
	return (props) => {
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
}
