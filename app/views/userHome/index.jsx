var Radium = require("radium");
var React  = require("react");

var Home = React.createClass({
    propTypes: {
    },
    /*
    renderChildren: function () {
        return React.cloneElement(this.props.children, {
            asteroid: asteroid,
            collections: this.state.collections
        });
    },
    */
    render: function () {
        return (
            <div>
                <div>
                    {"Home"}
                </div>
            </div>
        );
    }
});

module.exports = Radium(Home);
