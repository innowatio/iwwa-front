var bootstrap  = require("react-bootstrap");
var Immutable  = require("immutable");
var IPropTypes = require("react-immutable-proptypes");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var colors     = require("lib/colors");
var components = require("components");
var icons      = require("lib/icons");

// TODO remove importants
var buttonBasicStyle = {
    background: colors.greyBackground + "!important",
    color: colors.primary + "!important",
    borderRadius: "0px !important",
    fontSize: "13px" + "!important"
};

var buttonBasicStyleActive = {
    background: colors.primary + "!important",
    color: colors.white + "!important",
    fontSize: "13px" + "!important"
};

var itemsStyle = R.merge(buttonBasicStyle, {
    background: `${colors.white} !important`,
    border: "1px solid " + colors.greySubTitle + " !important",
    marginTop: "5px !important",
    width: "100%",
    padding: "10px"
});

var itemsStyleActive = {
    background: colors.primary + "!important",
    color: colors.white + "!important",
    fontSize: "13px" + "!important"
};

var SiteNavigator = React.createClass({
    propTypes: {
        allowedValues: IPropTypes.map.isRequired,
        defaultPath: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]),
        onChange: React.PropTypes.func.isRequired,
        showModal: React.PropTypes.bool,
        title: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            siteNavigatorView: this.props.showModal || false,
            pathParent: undefined,
            pathChildren: []
        };
    },
    componentWillReceiveProps: function (props) {
        return this.getStateFromProps(props);
    },
    getStateFromProps: function (props) {
        const path = props.defaultPath;
        var parent = [];
        var children = [];
        if (path.length > 0) {
            parent = path[0];
            children = path.slice(1, path.length);
        }
        this.setState({
            pathParent: parent,
            pathChildren: children
        });
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
    getFilterCriteria (values) {
        return values.filter((value) => {
            return ["CO2", "THL"].indexOf(value.get("type").toUpperCase()) < 0;
        });
    },
    onClickChildren: function (value) {
        this.setState({
            pathChildren: value
        });
    },
    onClickParent: function (value) {
        this.setState({
            pathParent: this.getKeyParent(value[0]),
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
        var site = this.state.pathParent;
        var childrenPath = this.state.pathChildren.filter(function (value) {
            return !R.isNil(value);
        });
        return {
            fullPath: [site].concat(childrenPath),
            site: site,
            sensor: R.last(childrenPath)
        };
    },
    onClickConfirm: function () {
        this.closeModal();
        this.props.onChange(this.getReturnValues());
    },
    renderSitesParent: function () {
        var self = this;
        return (
            <components.ButtonGroupSelect
                allowedValues={this.props.allowedValues.toArray()}
                getKey={this.getKeyParent}
                getLabel={this.getLabelParent}
                multi={false}
                onChange={this.onClickParent}
                value={[this.props.allowedValues.find((value) => {
                    return self.getKeyParent(value) === self.state.pathParent;
                })].filter(function (value) {
                    return !R.isNil(value);
                })}
                vertical={true}
            />
        );
    },
    renderSitesChildren: function () {
        if (this.state.pathParent) {
            return (
                <components.TreeView
                    allowedValues={this.props.allowedValues.getIn([this.state.pathParent, "sensors"]) || []}
                    filterCriteria={this.getFilterCriteria}
                    getKey={this.getKeyChildren}
                    getLabel={this.getLabelChildren}
                    multi={false}
                    onChange={this.onClickChildren}
                    value={this.state.pathChildren.length > 0 ? this.state.pathChildren : [undefined]}
                    vertical={true}
                />
            );
        }
    },
    renderChild: function () {
        return (
            <div style={{width: "100%"}}>
                <div>
                    <h3 className="text-center" style={{color: colors.primary}}>{this.props.title}</h3>
                </div>
                <bootstrap.Col style={{height: "70vh", padding: "20px", overflow: "auto"}} xs={4}>
                    <div className="site-navigator-parent">
                        <Radium.Style
                            rules={{
                                ".btn-group-vertical": {
                                    width: "100%",
                                    padding: "12px",
                                    overflow: "auto"
                                },
                                "button.btn": itemsStyle,
                                "button.btn.active": itemsStyleActive
                            }}
                            scopeSelector=".site-navigator-parent"
                        />
                        {this.renderSitesParent()}
                    </div>
                </bootstrap.Col>
                <bootstrap.Col xs={8}>
                    <div className="site-navigator-child" style={{height: "60vh", margin: "20px", border: "solid " + colors.primary}}>
                        <Radium.Style
                            rules={{
                                ".btn-group-vertical": {
                                    width: "30%",
                                    padding: "12px"
                                },
                                "button.btn": itemsStyle,
                                "button.btn.active": itemsStyleActive
                            }}
                            scopeSelector=".site-navigator-child"
                        />
                        {this.renderSitesChildren()}
                    </div>
                </bootstrap.Col>
                <div style={{width: "100%", height: "100%", bottom: 0, textAlign: "center"}}>
                    <bootstrap.Button
                        onClick={this.onClickConfirm}
                        style={R.merge(buttonBasicStyleActive, {
                            width: "230px",
                            height: "45px"
                        })}
                    >
                        OK
                    </bootstrap.Button>
                    <components.Spacer direction="h" size={20} />
                    <bootstrap.Button
                        style={R.merge(buttonBasicStyle, {
                            width: "230px",
                            height: "45px"
                        })}
                    >
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
