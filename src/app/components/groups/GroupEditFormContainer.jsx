import GroupFormContainer from './GroupFormContainer.jsx';

class GroupEditFormContainer extends GroupFormContainer {
	// We have to invalidate the group and the groups cache
	componentWillUnmount() {
		super.componentWillUnmount();

		this.invalidateGroup(this.props.params.groupname);
	}
}

export default GroupEditFormContainer;
