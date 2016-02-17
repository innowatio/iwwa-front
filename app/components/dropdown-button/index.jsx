var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
var components = require("components/");

var DropdownButton = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        getColor: React.PropTypes.func,
        getIcon: React.PropTypes.func,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func,
        value: React.PropTypes.any
    },
    getDefaultProps: function () {
        var defaultGetter = function (allowedItem) {
            return allowedItem.toString();
        };
        return {
            getColor: defaultGetter,
            getKey: defaultGetter,
            getLabel: defaultGetter,
            getIcon: defaultGetter
        };
    },
    getInitialState: function () {
        return {
            hover: "false",
            allowedValue: {}
        };
    },
    imageItem: function (allowedValue) {
        if (R.keys(allowedValue).length > 2) {
            return (
                <components.Icon
                    color={this.props.getColor(allowedValue)}
                    icon={this.props.getIcon(allowedValue)}
                    size={"30px"}
                    style={{lineHeight: "20px", verticalAlign: "middle", marginRight: "20px"}}
                />
            );
        }
    },
    mouseOver: function (item) {
        this.setState({
            hover: true,
            allowedValue: item
        });
    },
    renderButtonOption: function (allowedValue, index) {
        return (
            <bootstrap.ListGroupItem
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.props.onChange, [allowedValue])}
                onMouseOver={R.partial(this.mouseOver, [allowedValue])}
                style={{
                    borderLeft: "0px",
                    borderRight: "0px",
                    borderTop: (index === 0 ? "0px" : undefined),
                    borderTopLeftRadius: (index === 0 ? "4px" : undefined),
                    borderTopRightRadius: (index === 0 ? "4px" : undefined),
                    borderBottom: (index === 2 ? "0px" : undefined),
                    fontSize: "12px"
                }}
            >
                {this.imageItem(allowedValue)}
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

module.exports = DropdownButton;
