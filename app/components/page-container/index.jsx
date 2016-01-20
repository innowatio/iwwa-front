var R     = require("ramda");
var React = require("react");

var icons      = require("lib/icons_restyling");
var styles     = require("lib/styles_restyling");
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

            // TODO Mettere nome sito - pod - data, ora è schiantato dentro
            // also: Dividere lo stile del titolo dallo stile del div che lo contiene

            return (
                <div style={styles.titlePage}>
                    <h2 style={{
                        fontSize: "18px",
                        marginBottom: "0px",
                        paddingTop: "18px"
                    }}>
                        {"COIN BG · CORSIA 1 · 5-15 GIUGNO 2015"}
                    </h2>
                    <img className="pull-right" src={icons.iconSettings} style={{marginTop: "-20px"}}/>
                </div>);
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
