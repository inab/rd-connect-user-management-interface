import OrganizationalUnitFormContainer from './OrganizationalUnitFormContainer.jsx';

class OrganizationalUnitEditFormContainer extends OrganizationalUnitFormContainer {
	componentWillUnmount() {
		super.componentWillUnmount();
		
		this.invalidateOrganizationalUnit(this.props.params.organizationalUnit);
	}
}

export default OrganizationalUnitEditFormContainer;
