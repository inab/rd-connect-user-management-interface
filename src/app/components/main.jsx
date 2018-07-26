import React from 'react';
import Navigation from './Navigation.jsx';
import Breadcrumbs from 'react-breadcrumbs';


class Main extends React.Component {
    render() {
        return (
      <div>
        <header className="primary-header">
            <Navigation projectName="RD-Connect UMI" />
        </header>
        <aside className="primary-aside" />
        <main className="container">
          <Breadcrumbs
            routes={this.props.routes}
            params={this.props.params}
          />
          {this.props.children}
        </main>
      </div>
    );
  }
}

Main.propTypes = {
	children: React.PropTypes.object.isRequired,
	routes: React.PropTypes.array,
	params: React.PropTypes.object
};

export default Main;
