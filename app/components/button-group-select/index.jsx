var bootstrap       = require("react-bootstrap");
var Immutable       = require("immutable");
var IPropTypes      = require("react-immutable-proptypes");
var R               = require("ramda");
var React           = require("react");
var ReactDOM        = require("react-dom");
var ReactPureRender = require("react-addons-pure-render-mixin");

var components = require("components");
import {defaultTheme} from "lib/theme";

var ButtonGroupSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]).isRequired,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        // This parameter is for check if the sources are two (real and previsional)
        multi: React.PropTypes.bool,
        onChange: React.PropTypes.func.isRequired,
        onChangeMulti: React.PropTypes.func,
        showArrowActive: React.PropTypes.bool,
        style: React.PropTypes.object,
        styleToMergeWhenActiveState: React.PropTypes.object,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.list
        ]),
        vertical: React.PropTypes.bool
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    mixins: [ReactPureRender],
    getDefaultProps: function () {
        var defaultGetter = function (allowedValue) {
            return allowedValue.toString();
        };
        return {
            getActiveStyle: R.always({}),
            getKey: defaultGetter,
            getLabel: defaultGetter,
            multi: false,
            vertical: false
        };
    },
    componentDidMount: function () {
        const activeButton = this.refs.active;
        if (activeButton) {
            const domNode = ReactDOM.findDOMNode(activeButton);
            domNode.scrollIntoView();
        }
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    isActiveMulti: function (allowedValue) {
        var keys = this.props.value.map(this.props.getKey);
        var key = this.props.getKey(allowedValue);
        return (
            R.is(Immutable.List, keys) ?
            keys.contains(key) :
            R.contains(key, keys)
        );
    },
    isActiveSingle: function (allowedValue) {
        var keys = this.props.value.map(this.props.getKey);
        var key = this.props.getKey(allowedValue);
        return (
            R.is(Immutable.List, keys) ?
            keys.first() === key :
            keys[0] === key
        );
    },
    isActive: function (allowedValue) {
        return (
            this.props.multi ?
            this.isActiveMulti(allowedValue) :
            this.isActiveSingle(allowedValue)
        );
    },
    onChange: function (allowedValue) {
        return this.props.multi ?
            this.props.onChangeMulti(this.props.value, allowedValue) :
            this.props.onChange([allowedValue]);
    },
    getActiveStyle: function () {
        return R.merge(
            this.props.style || {},
            this.props.styleToMergeWhenActiveState || {}
        );
    },
    renderButtonArrow: function () {
        return (
            <div style={{
                content: "",
                display: "block",
                position: "absolute",
                zIndex: "100",
                left: "100%",
                top: "20px",
                width: "0px",
                height: "0px",
                marginLeft: "-1px",
                borderStyle: "solid",
                borderWidth: "8px 0 8px 18px",
                borderColor: "transparent transparent transparent " + this.getTheme().colors.buttonPrimary}} />
        );
    },
    renderButtonOption: function (allowedValue) {
        const active = this.isActive(allowedValue);
        return (
            <components.Button
                ref={active ? "active" : undefined}
                disabled={allowedValue.isDisabled || false}
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.onChange, [allowedValue])}
                style={active ? this.getActiveStyle() : this.props.style}
            >
                <p style={{overflow: "hidden", margin: "0px", padding: "0px", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>
                    {this.props.getLabel(allowedValue)}
                </p>
                {active && this.props.showArrowActive ? this.renderButtonArrow() : undefined}
            </components.Button>
        );
    },
    render: function () {
        return (
            <bootstrap.ButtonGroup vertical={this.props.vertical}>
                {this.props.allowedValues.map(this.renderButtonOption)}
            </bootstrap.ButtonGroup>
        );
    }
});

module.exports = ButtonGroupSelect;
