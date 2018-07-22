import React from 'react';
import AbstractFetchedDataContainer from './AbstractUMContainer.jsx';
import { NavDropdown, Glyphicon, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class TemplateDomains extends AbstractFetchedDataContainer {
	constructor(props,context) {
		super(props,context);
	}
	
	componentWillMount() {
		super.componentWillMount();
		this.setState({
			templateDomains: null,
			failed: false
		});
	}
	
	componentDidMount() {
		this.templateDomainsPromise()
			.then((templateDomains) => {
				this.onChange({templateDomains: templateDomains});
			},(err) => {
				this.setState(err);
			});
	}
	
	render() {
		if(this.state.templateDomains) {
			return (
					<NavDropdown id="NavDropdown-TemplateDomains" eventKey={6.3} title={<Glyphicon glyph="envelope"> Templates</Glyphicon>}>{
						this.state.templateDomains.map((templateDomain) => {
								return <LinkContainer to={'/mail/domains/' + encodeURIComponent(templateDomain.apiKey)}><MenuItem>{templateDomain.desc}</MenuItem></LinkContainer>;
						})
					}</NavDropdown>
			);
		}
		
		if(this.state.error) {
			return (
				<MenuItem>Error: could not load template domains\n{this.state.error}</MenuItem>
			);
		}
		
		return <MenuItem>Loading...</MenuItem>;
	}
}

export default TemplateDomains;
