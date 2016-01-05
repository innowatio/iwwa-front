var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");

var SiteNavigator = React.createClass({
    propTypes: {
        allowedValues: IPropTypes.map,
        title: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            pathParent: undefined,
            pathNavigator: []
        }
    },
    getKeyParent: function (value) {
        return value.get("_id");
    },
    getLabelParent: function (value) {
        return value.get("name");
    },
    getKeyChildren: function (value) {
        return value.get("id");
    },
    getLabelChildren: function (value) {
        return value.get("id");
    },
    onClickParent: function (value) {
        this.setState({
            pathParent: value[0],
            pathNavigator: []
        });
    },
    onClickNavigator: function (value) {
        this.setState({
            pathNavigator: value
        });
    },
    renderSitesParent: function () {
        return (
            <components.MenuBox
                allowedValues={this.props.allowedValues}
                depth={1}
                getKey={this.getKeyParent}
                getLabel={this.getLabelParent}
                multi={false}
                onChange={this.onClickParent}
                value={this.state.pathParent ? [this.state.pathParent] : [undefined]}
                vertical={true}
            />
        );
    },
    renderSitesChildren: function () {
        if (this.state.pathParent) {
            return (
                <components.MenuBox
                    allowedValues={Immutable.Map(this.props.allowedValues.get(this.state.pathParent))}
                    depth={-1}
                    getChildren={["sensors", "children"]}
                    getKey={this.getKeyChildren}
                    getLabel={this.getLabelChildren}
                    multi={false}
                    onChange={this.onClickNavigator}
                    value={this.state.pathNavigator.length > 1 ? this.state.pathNavigator : [undefined]}
                    vertical={true}
                />
            );
        }
    },
    renderChild: function () {
        return (
            <div style={{width: "100%"}}>
                {/*     TITLE       */}
                <div>
                    {this.props.title}
                </div>
                {/*     BODY       */}
                <div>
                    <div style={{width: "35%"}}>
                        {this.renderSitesParent()}
                    </div>
                    <div style={{width: "65%"}}>
                        {this.renderSitesChildren()}
                    </div>
                </div>
                <bootstrap.Button>
                    OK
                </bootstrap.Button>
                <bootstrap.Button>
                    RESET
                </bootstrap.Button>
            </div>
        );
    },
    render: function () {
        return (
            <components.FullscreenModal
                childComponent={this.renderChild()}
            />
        );
    }
});

module.exports = Radium(SiteNavigator);
