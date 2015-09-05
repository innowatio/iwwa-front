var Immutable  = require("immutable");
var Radium     = require("radium");
var bootstrap  = require("react-bootstrap");
var R          = require("ramda");
var React      = require("react");
var ReactLink  = require("react/lib/ReactLink");
var IPropTypes = require("react-immutable-proptypes");
var Waypoint   = require("react-waypoint");

var components = require("components");
var colors     = require("lib/colors");

var SelectTree = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        filter: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        label: React.PropTypes.string,
        onChange: React.PropTypes.func,
        open: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        style: React.PropTypes.object,
        value: React.PropTypes.array,
        valueLink: ReactLink.PropTypes.link()
    },
    mixins: [React.addons.PureRenderMixin],
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
            value: Immutable.Iterable,
            inputFilter: "",
            activeKey: ""
        };
    },
    getValue: function () {
        return (
            this.props.valueLink ?
            this.props.valueLink.value :
            (
                R.isArrayLike(this.props.value) ?
                this.props.value[0] :
                this.props.value
            )
        );
    },
    onClickPanel: function (allowedValue) {
        this.setState({
            value: allowedValue
        });
        if (this.props.onChange) {
            this.props.onChange([allowedValue]);
        }
        //     if (this.props.valueLink) {
        //         this.props.valueLink.requestChange(newValue);
        //     }
        // },
    },
    filter: function (allowedValue) {
        return this.props.filter(allowedValue, this.state.inputFilter);
    },
    renderHeader: function (allowedValue) {
        return (
            <span>
                <components.Button
                    bsStyle="link"
                    onClick={R.partial(this.onClickPanel, allowedValue)}
                    style={{
                        height: "54px",
                        width: "20%",
                        backgroundColor: allowedValue === this.state.value ? colors.primary : colors.white,
                        color: allowedValue === this.state.value ? colors.white : colors.black
                    }}
                >
                    <components.Icon
                        icon={allowedValue === this.state.value ? "minus" : "plus"}
                        style={{float: "left"}}
                    />
                </components.Button>
                <components.Button
                    bsStyle="link"
                    style={{
                        textDecoration: "none",
                        width: "80%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        backgroundColor: allowedValue === this.state.value ? colors.primary : colors.white,
                        color: allowedValue === this.state.value ? colors.white : colors.black
                    }}
                >
                    {this.props.getLabel(allowedValue)}
                    <br />
                    {allowedValue.get("pod")}
                </components.Button>
            </span>
        );
    },
    renderPanel: function (allowedValue) {
        return (
            <bootstrap.Panel
                collapsible
                eventKey={this.props.getLabel(allowedValue)}
                header={this.renderHeader(allowedValue)}
                style={{
                    width: "200px",
                    borderTop: "0px",
                    marginTop: "0px",
                    borderRadius: "0px"
                }}
            >
            </bootstrap.Panel>
        );
    },
    render: function () {
        var things = this.props.allowedValues
            .filter(this.filter)
            .slice(0, this.state.numberOfValues)
            .map(this.renderPanel)
            .toList();
        return (
            <div className="site-selector" style={{position: "relative", overflow: "scroll", width: "200px"}}>
                <Radium.Style
                    rules={{
                        ".form-group": {
                            position: "fixed",
                            height: "34px",
                            width: "200px",
                            margin: "0px"
                        },
                        ".panel-group": {
                            paddingTop: "34px",
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
                            padding: "0px"
                        },
                        ".input-search": {
                            borderBottomLeftRadius: "0px",
                            borderTop: "none",
                            borderLeft: "none",
                            borderRight: "none",
                            outline: "0px",
                            boxShadow: "none"
                        },
                        ".form-control:focus": {
                            borderColor: colors.greyBorder
                        },
                        ".input-group-addon": {
                            borderBottomRightRadius: "0px",
                            borderTop: "none",
                            borderLeft: "none",
                            borderRight: "none",
                            backgroundColor: colors.white
                        }
                    }}
                    scopeSelector=".site-selector"
                />
                <bootstrap.Input
                    addonAfter={<components.Icon icon="search"/>}
                    className="input-search"
                    onChange={(input) => this.setState({inputFilter: input.target.value})}
                    placeholder="Ricerca"
                    type="text"
                />
                <bootstrap.Accordion>
                    {things}
                    <Waypoint
                      onEnter={() => this.setState({
                          numberOfValues: this.state.numberOfValues + 20
                      })}
                      threshold={0.8}
                    />
                </bootstrap.Accordion>
            </div>
        );
    }
});

module.exports = Radium(SelectTree);
