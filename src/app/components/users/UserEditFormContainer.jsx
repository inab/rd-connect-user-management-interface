import UserFormContainer from './UserFormContainer.jsx';

class UserEditFormContainer extends UserFormContainer {
	// We have to invalidate the user and the users cache
	componentWillUnmount() {
		super.componentWillUnmount();
		
		this.invalidateUser(this.props.params.username);
	}
}

export default UserEditFormContainer;
