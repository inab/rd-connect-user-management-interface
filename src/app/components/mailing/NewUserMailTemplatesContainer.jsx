import React from 'react';
import auth from 'components/auth.jsx';

class NewUserMailTemplatesContainer extends React.PureComponent {
	constructor(props) {
		super(props);
		this.update = this.update.bind(this);
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		//return nextProps.user.id === props.user.id;
	}
	
	update(e) {
		//this.props.update(e.target.value)
	}
	
	render() {
		return <div>NewUserMailTemplatesContainer to be implemented</div>;
	}
}


export default NewUserMailTemplatesContainer;
