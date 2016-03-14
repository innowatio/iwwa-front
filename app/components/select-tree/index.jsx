var bootstrap       = require("react-bootstrap");
var IPropTypes      = require("react-immutable-proptypes");
var R               = require("ramda");
var Radium          = require("radium");
var React           = require("react");
var ReactLink       = require("react/lib/ReactLink");
var ReactPureRender = require("react-addons-pure-render-mixin");
var Waypoint        = require("react-waypoint");

var components = require("components");
import {defaultTheme} from "lib/theme";

var SelectTree = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        buttonCloseDefault: React.PropTypes.bool,
        chart: React.PropTypes.object,
        filter: React.PropTypes.func.isRequired,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        valueLink: ReactLink.PropTypes.link()
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    mixins: [ReactPureRender],
    getDefaultProps: function () {
        return {
            getLabel: function (allowedValue) {
                return allowedValue.toString();
            }
        };
    },
    getInitialState: function () {
        return {
            numberOfValues: 20,
            value: this.getValue(),
            inputFilter: "",
            activeKey: "",
            subMenu: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getValue: function () {
        return (
            this.props.valueLink ?
            this.props.valueLink.value :
            (
                R.is(Array, this.props.value) ?
                this.props.value[0] :
                this.props.value
            )
        );
    },
    onClickActiveSite: function (allowedValue) {
        this.setState({
            value: allowedValue
        });
        if (this.props.onChange) {
            this.props.onChange([allowedValue.get("_id")]);
        }
        if (this.props.valueLink) {
            this.props.valueLink.requestChange(allowedValue);
        }
    },
    onClickOpenPanel: function (allowedValue) {
        var value = this.props.getLabel(allowedValue);
        if (this.state.activeKey === value) {
            this.setState({
                activeKey: ""
            });
        } else {
            this.setState({
                activeKey: value
            });
        }
    },
    filter: function (allowedValue) {
        return this.props.filter(allowedValue, this.state.inputFilter);
    },
    renderHeader: function (allowedValue) {
        const {colors} = this.getTheme();
        return (
            <span>
                <components.Button
                    bsStyle="link"
                    onClick={R.partial(this.onClickActiveSite, [allowedValue])}
                    style={{
                        textDecoration: "none",
                        width: this.state.subMenu ? "430px" : "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        border: "0px",
                        backgroundColor: allowedValue === this.state.value ? colors.primary : colors.backgroundSelectSearch,
                        color: colors.mainFontColor
                    }}
                >
                    {this.props.getLabel(allowedValue)}
                    <br />
                    {allowedValue.get("pod")}
                </components.Button>
                {this.renderButtonSubMenu(allowedValue)}
            </span>
        );
    },
    renderButtonSubMenu: function (allowedValue) {
        const {colors} = this.getTheme();
        return this.state.subMenu ?
            (<div>
                <components.Button
                    bsStyle="link"
                    onClick={R.partial(this.onClickOpenPanel, [allowedValue])}
                    style={{
                        height: "54px ",
                        width: this.state.subMenu ? "20%" : "0%",
                        backgroundColor: allowedValue === this.state.value ? colors.primary : colors.backgroundSelectSearch,
                        color: colors.mainFontColor
                    }}
                >
                    <components.Icon
                        color={colors.iconInputSelect}
                        icon={"arrow-down"}
                        size={"20px"}
                        style={{lineHeight: "20px", float: "right"}}
                    />
                </components.Button>
            </div>) : null;
    },
    renderPanel: function (allowedValue) {
        const theme = this.getTheme();
        return (
            <bootstrap.Panel
                collapsible={true}
                eventKey={this.props.getLabel(allowedValue)}
                header={this.renderHeader(allowedValue)}
                key={this.props.getKey(allowedValue)}
                style={{
                    width: this.props.buttonCloseDefault ? "430px" : "200px",
                    border: "0px",
                    marginTop: "0px",
                    borderRadius: "0px",
                    backgroundColor: theme.colors.transparent
                }}
            >
            </bootstrap.Panel>
        );
    },
    render: function () {
        const {colors} = this.getTheme();
        var panelOfSite = this.props.allowedValues
            .filter(this.filter)
            .slice(0, this.state.numberOfValues)
            .map(this.renderPanel)
            .toList()
            .toJS();
        return (
            <div
                className="site-selector"
                style={{
                    position: "relative",
                    overflow: "auto",
                    maxHeight: "400px",
                    width: this.props.buttonCloseDefault ? "400px" : "",
                    backgroundColor: colors.transparent,
                    color: colors.white
                }}
            >
                <Radium.Style
                    rules={{
                        ".form-group": {
                            height: "34px",
                            margin: "0px",
                            zIndex: "10"
                        },
                        ".panel-group": {
                            paddingTop: "10px",
                            marginBottom: "0px"
                        },
                        ".panel-title": {
                            fontSize: "13px"
                        },
                        ".panel-default > .panel-heading": {
                            backgroundColor: colors.white,
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            padding: "0px",
                            borderRadius: "0px",
                            border: "0px"
                        },
                        ".input-search": {
                            position: "relative",
                            borderBottomLeftRadius: "0px",
                            borderTop: "1px solid " + colors.borderSelectSearch,
                            borderLeft: "1px solid " + colors.borderSelectSearch,
                            borderBottom: "1px solid " + colors.borderSelectSearch,
                            borderRight: "0",
                            outline: "0px",
                            boxShadow: "none",
                            height: "45px",
                            fontSize: "14px",
                            color: colors.mainFontColor,
                            backgroundColor: colors.backgroundSelectSearch
                        },
                        ".form-control:focus": {
                            borderColor: colors.greyBorder
                        },
                        ".input-group-addon": {
                            borderBottomRightRadius: "0px",
                            backgroundColor: colors.backgroundSelectSearch,
                            borderTop: "1px solid " + colors.borderSelectSearch,
                            borderRight: "1px solid " + colors.borderSelectSearch,
                            borderBottom: "1px solid " + colors.borderSelectSearch
                        }
                    }}
                    scopeSelector=".site-selector"
                />
                <bootstrap.Input
                    addonAfter={
                        <components.Icon
                            color={this.getTheme().colors.iconInputSearch}
                            icon={"search"}
                            size={"28px"}
                            style={{lineHeight: "20px", margin: "0", padding: "0"}}
                        />
                    }
                    className="input-search"
                    onChange={(input) => this.setState({inputFilter: input.target.value})}
                    placeholder="Ricerca"
                    type="text"
                />
                <bootstrap.PanelGroup
                    accordion={true}
                    activeKey={this.state.activeKey}
                    style={{
                        maxHeight: "300px",
                        border: "1px solid " + colors.borderSelectSearch,
                        borderRadius: "10px",
                        overflow: "hidden"
                    }}
                >
                    {panelOfSite}
                    <Waypoint
                        onEnter={() => this.setState({
                            numberOfValues: this.state.numberOfValues + 20
                        })}
                    />
                </bootstrap.PanelGroup>
            </div>
        );
    }
});

module.exports = Radium(SelectTree);
