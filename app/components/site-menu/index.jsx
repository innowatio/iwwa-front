var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");

var SiteNavigator = React.createClass({
    propTypes: {
        allowedValues: IPropTypes.map.isRequired,
        onChange: React.PropTypes.func.isRequired,
        title: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            pathParent: [],
            pathChildren: []
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
            pathParent: value,
            pathChildren: []
        });
    },
    onClickChildren: function (value) {
        this.setState({
            pathChildren: value
        });
    },
    getReturnValues: function () {
        return {
            site: this.state.pathParent.length > 0 ?
                this.getKeyParent(this.state.pathParent[0]) :
                "",
            sensor: R.last(this.state.pathChildren.filter(function (value) {
                return !R.isNil(value);
            }))
        }
    },
    renderSitesParent: function () {
        return (
            <components.ButtonGroupSelect
                allowedValues={this.props.allowedValues.toArray()}
                getKey={this.getKeyParent}
                getLabel={this.getLabelParent}
                multi={false}
                onChange={this.onClickParent}
                value={this.state.pathParent}
                vertical={true}
            />
        );
    },
    renderSitesChildren: function () {
        if (this.state.pathParent && this.state.pathParent.length > 0) {
            return (
                <components.TreeView
                    allowedValues={this.props.allowedValues.getIn([this.state.pathParent[0].get("_id"), "sensors"])}
                    getKey={this.getKeyChildren}
                    getLabel={this.getLabelChildren}
                    multi={false}
                    onChange={this.onClickChildren}
                    value={this.state.pathChildren.length > 1 ? this.state.pathChildren : [undefined]}
                    vertical={true}
                />
            );
        }
    },
    renderChild: function () {
        return (
            <div style={{width: "100%"}}>
                <div>
                    {this.props.title}
                </div>
                <div style={{width: "100%", height: "100%"}}>
                    <div style={{width: "35%", float: "left"}}>
                        {this.renderSitesParent()}
                    </div>
                    <div style={{width: "65%", float: "right"}}>
                        {this.renderSitesChildren()}
                    </div>
                </div>
                <div style={{width: "100%"}}>
                    <bootstrap.Button onClick={R.partial(this.props.onChange, [this.getReturnValues()])}>
                        OK
                    </bootstrap.Button>
                    <bootstrap.Button>
                        RESET
                    </bootstrap.Button>
                </div>
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
