var R     = require("ramda");
var React = require("react");

var styles     = require("lib/styles");
var components = require("components");

var PageContainer = React.createClass({
    propTypes: {
        children: React.PropTypes.node,
        style: React.PropTypes.object
    },
    defaultProps: {
        style: {}
    },
    getViewTitle: function () {
        var title = R.path(["props", "route", "titleView"], this.props.children);
        if (title) {
            return (
                <h2
                    className="text-center"
                    style={styles.titlePage}
                >
                    <components.Spacer direction="v" size={5} />
                    {this.props.children.props.route.titleView}
                </h2>);
        }
    },
    render: function () {
        const {style} = this.props;
        return (
            <div
                {...this.props}
                style={{...style}}
            >
                {this.getViewTitle()}
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = PageContainer;
