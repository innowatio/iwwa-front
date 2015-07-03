var R         = require("ramda");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var DropdownButtonSelect = React.createClass({
    propTypes: {
        allowedItems: React.PropTypes.array.isRequired,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        title: React.PropTypes.string,
        value: React.PropTypes.any.isRequired
    },
    getDefaultProps: function () {
        return {
            getLabel: function (allowedItem) {
                return allowedItem.toString();
            }
        };
    },
    renderButtonOption: function (allowedItem) {
        var label = this.props.getLabel(allowedItem);
        return (
            <bootstrap.MenuItem
                active={allowedItem === this.props.value}
                eventKey={label}
                key={label}
                onSelect={R.partial(this.props.onChange, allowedItem)}
            >
                {label}
            </bootstrap.MenuItem>
        );
    },
    render: function () {
        return (
            <bootstrap.DropdownButton
                className="ac-button-dropdown"
                title={this.props.title}
            >
                {this.props.allowedItems.map(this.renderButtonOption)}
            </bootstrap.DropdownButton>
        );
    }
});

module.exports = DropdownButtonSelect;
