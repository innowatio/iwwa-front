var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var colors     = require("lib/colors");

var DropdownSelect = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        value: React.PropTypes.any
    },
    getDefaultProps: function () {
        var defaultGetter = function (allowedValue) {
            return allowedValue.toString();
        };
        return {
            getKey: defaultGetter,
            getLabel: defaultGetter
        };
    },
    shouldComponentUpdate: function (nextProps) {
        return !(
            this.props.allowedValues === nextProps.allowedValues &&
            this.props.getKey === nextProps.getKey &&
            this.props.getLabel === nextProps.getLabel &&
            this.props.value === nextProps.value
        );
    },
    renderButtonOption: function (allowedValue, index) {
        var active = (allowedValue === this.props.value);
        return (
            <bootstrap.ListGroupItem
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.props.onChange, allowedValue)}
                style={{
                    background: (active ? colors.primary : ""),
                    color: (active ? colors.white : colors.darkBlack),
                    borderLeft: "0px",
                    borderRight: "0px",
                    borderTop: (index === 0 ? "0px" : undefined),
                    borderTopLeftRadius: (index === 0 ? "4px" : undefined),
                    borderTopRightRadius: (index === 0 ? "4px" : undefined),
                    borderBottom: (index === 2 ? "0px" : undefined),
                    fontSize: "12px",
                    textAlign: "center"
                }}
            >
                {this.props.getLabel(allowedValue)}
            </bootstrap.ListGroupItem>
        );
    },
    render: function () {
        var items = this.props.allowedValues.map(this.renderButtonOption);
        return (
            <div>
                {items.toArray ? items.toArray() : items}
            </div>
        );
    }
});

module.exports = DropdownSelect;
