var React = require('react');
var Navigation = require('./Navigation.jsx');
var Home = require('./Home.jsx');


var Main = React.createClass({
    propTypes:{
        children: React.PropTypes.object.isRequired
    },
    render: function () {
        return (
      <div>
        <header className="primary-header">
            <Navigation projectName="react-bootstrap-starter" />
        </header>
        <aside className="primary-aside"></aside>
        <main className = "container">
          {this.props.children || <Home />}
        </main>
      </div>
    );
  }
});

module.exports = Main;
