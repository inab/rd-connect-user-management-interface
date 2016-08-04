var React = require('react');

var Box = React.createClass({
    propTypes:{
        children: React.PropTypes.node
    },
    render: function () {
        return (
          <div className="BreadcrumbBox">
            {this.props.children}
          </div>
        );
    }
});

module.exports = Box;
