var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");
var icons      = require("lib/icons");

var SiteNavigator = React.createClass({
    propTypes: {
        allowedValues: IPropTypes.map.isRequired,
        onChange: React.PropTypes.func.isRequired,
        showModal: React.PropTypes.bool,
        title: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            siteNavigatorView: this.props.showModal || false,
            pathParent: [],
            pathChildren: []
        };
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
    onClickChildren: function (value) {
        this.setState({
            pathChildren: value
        });
    },
    onClickParent: function (value) {
        this.setState({
            pathParent: value,
            pathChildren: []
        });
    },
    onClickSiteNavigatorButton: function () {
        this.setState({
            showModal: true
        });
    },
    closeModal: function () {
        this.setState({showModal: false});
    },
    getReturnValues: function () {
        return {
            site: this.state.pathParent.length > 0 ?
                this.getKeyParent(this.state.pathParent[0]) :
                "",
            sensor: R.last(this.state.pathChildren.filter(function (value) {
                return !R.isNil(value);
            }))
        };
    },
    onClickConfirm: function () {
        this.closeModal();
        this.props.onChange(this.getReturnValues());
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
                    <bootstrap.Button onClick={this.onClickConfirm}
                    >
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
            <span>
                <components.Button
                    bsStyle="link"
                    onClick={this.onClickSiteNavigatorButton}
                >
                    <img src={icons.iconSiti} style={{width: "75%"}} />
                </components.Button>
                <components.FullscreenModal
                    childComponent={this.renderChild()}
                    showModal={this.state.showModal}
                />
            </span>
        );
    }
});

module.exports = Radium(SiteNavigator);
