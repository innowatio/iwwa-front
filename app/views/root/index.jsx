var Radium = require("radium");
var React  = require("react");

var components = require("components");
var asteroid   = require("lib/asteroid");
var measures   = require("lib/measures");

var styles = {
    header: {
        position: "absolute",
        width: "100%",
        height: measures.headerHeight
    },
    content: {
        position: "absolute",
        top: measures.headerHeight,
        width: "100%",
        height: "calc(100% - " + measures.headerHeight + ")"
    }
};

var Root = React.createClass({
    propTypes: {
        children: React.PropTypes.node
    },
    mixins: [
        asteroid.getControllerViewMixin(),
        asteroid.getSubscriptionMixin()
    ],
    renderChildren: function () {
        return React.cloneElement(this.props.children, {
            collections: this.state.collections
        });
    },
    render: function () {
        return (
            <div>
                <div style={styles.header}>
                    <components.Header />
                </div>
                <div style={styles.content}>
                    {this.renderChildren()}
                </div>
                <components.LoginModal isOpen={!this.state.userId} />
            </div>
        );
    }
});

module.exports = Radium(Root);
