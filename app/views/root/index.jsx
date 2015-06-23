var React  = require("react");
var Router = require("react-router");

var components = require("components");

var Root = React.createClass({
    render: function () {
        return (
            <div className="av-root">
                <div className="header">
                    <components.Header />
                </div>
                <div className="content">
                    <Router.RouteHandler />
                </div>
            </div>
        );
    }
});

module.exports = Root;
