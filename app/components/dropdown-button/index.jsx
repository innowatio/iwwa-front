var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");

var components = require("components/");
var colors     = require("lib/colors");

var DropdownButton = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        getIcon: React.PropTypes.func
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
    imageItem: function (allowedValue) {
        if (R.keys(allowedValue).length === 3) {
            return (
                <img
                    src={this.props.getIcon(allowedValue)}
                    style={{width: "25px", marginRight: "20px"}}
                />
            )
        }
    },
    renderButtonOption: function (allowedValue, index) {
        var active = (allowedValue === this.props.value);
        return (
            <bootstrap.ListGroupItem
                style={{
                    background: (active ? colors.primary : ""),
                    color: (active ? colors.white : colors.darkBlack),
                    borderLeft: "0px",
                    borderRight: "0px",
                    borderTop: (index === 0 ? "0px": undefined),
                    borderTopLeftRadius: (index === 0 ? "4px" : undefined),
                    borderTopRightRadius: (index === 0 ? "4px" : undefined),
                    borderBottom: (index === 2 ? "0px" : undefined)
                }}
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.props.onChange, allowedValue)}
            >
                {this.imageItem(allowedValue)}
                {this.props.getLabel(allowedValue)}
            </bootstrap.ListGroupItem>
        );
    },
    renderOverlay: function () {
        var items = this.props.allowedValues.map(this.renderButtonOption);
        return (
            <bootstrap.Popover className="dropdown-select-popover">
                <Radium.Style
                    rules={{
                        "": {
                            padding: "0px"
                        },
                        ".popover-content": {
                            padding: "0px",
                            cursor: "pointer"
                        }
                    }}
                    scopeSelector=".dropdown-select-popover"
                />
                {items.toArray ? items.toArray() : items}
            </bootstrap.Popover>
        )
    },
    render: function () {
        return (
            <bootstrap.OverlayTrigger
                trigger="click"
                placement="bottom"
                rootClose={true}
                overlay={this.renderOverlay()}
            >
                <components.Button  bsStyle="link">
                    {this.props.title}
                </components.Button>
            </bootstrap.OverlayTrigger>
        );
    }
});

module.exports = DropdownButton;
