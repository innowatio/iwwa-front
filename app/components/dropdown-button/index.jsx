var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

// var colors = require("lib/colors");

var DropdownButton = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
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
                <img
                    src={this.props.getIcon(allowedValue)}
                    style={{width: "25px", marginRight: "20px"}}
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
                onClick={R.partial(this.props.onChange, allowedValue)}
                onMouseOver={R.partial(this.mouseOver, allowedValue)}
                style={{
                    borderLeft: "0px",
                    borderRight: "0px",
                    borderTop: (index === 0 ? "0px" : undefined),
                    borderTopLeftRadius: (index === 0 ? "4px" : undefined),
                    borderTopRightRadius: (index === 0 ? "4px" : undefined),
                    borderBottom: (index === 2 ? "0px" : undefined),
                    fontSize: "12px"
                    // background: (this.state.hover && this.state.allowedValue === allowedValue) ?
                    //     colors.primary :
                    //     colors.greyBackground,
                    // color: (this.state.hover && this.state.allowedValue === allowedValue) ?
                    //     colors.white :
                    //     colors.greySubTitle
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