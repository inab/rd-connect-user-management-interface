var React = require('react');
var Navigation = require('./Navigation.jsx');
var Home = require('./Home.jsx');
var Breadcrumbs = require('react-breadcrumbs');

var Main = React.createClass({
    propTypes:{
        children: React.PropTypes.object.isRequired,
        routes: React.PropTypes.array,
        params: React.PropTypes.object
    },
    render: function () {
        return (
      <div>
        <header className="primary-header">
            <Navigation projectName="react-bootstrap-starter" />
        </header>
        <aside className="primary-aside"></aside>
        <main className = "container">
          <Breadcrumbs
            routes={this.props.routes}
            params={this.props.params}
          />
          {this.props.children || <Home />}
        </main>
      </div>
    );
  }
});

module.exports = Main;
