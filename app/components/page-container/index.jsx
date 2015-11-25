var R     = require("ramda");
var React = require("react");

var styles = require("lib/styles");

const customStyles = {
    pageContainer: {
        boxSizing: "border-box",
        height: "100%",
        width: "100%",
        padding: "30px"
    }
};

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
                    {this.props.children.props.route.titleView}
                </h2>);
        }
    },
    render: function () {
        const {style} = this.props;
        return (
            <div
                {...this.props}
                style={{...customStyles.pageContainer, ...style}}
            >
                {this.getViewTitle()}
                {this.props.children}
            </div>
        );
    }
});

module.exports = PageContainer;
