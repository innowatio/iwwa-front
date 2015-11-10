var bootstrap  = require("react-bootstrap");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var ConsumptionButtons = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        selectedValue: React.PropTypes.object,
        style: React.PropTypes.object,
        styleButton: React.PropTypes.object,
        styleButtonSelected: React.PropTypes.object,
        styleIcon: React.PropTypes.object
    },
    renderConsumptionButton: function (consumption) {
        var isSelected = R.equals(consumption, this.props.selectedValue);
        return (
            <bootstrap.Button
                key={consumption.key}
                onClick={R.partial(this.props.onChange, consumption)}
                style={R.merge(this.props.styleButton, isSelected ? this.props.styleButtonSelected : {})}
            >
                {consumption.icon ? <img src={isSelected && consumption.selected ? consumption.selected : consumption.icon} style={this.props.styleIcon} /> : ""}
                {consumption.label}
            </bootstrap.Button>);
    },
    render: function () {
        return (
            <bootstrap.ButtonGroup style={this.props.style}>
                {this.props.allowedValues.map(this.renderConsumptionButton)}
            </bootstrap.ButtonGroup>
        );
    }
});

module.exports = Radium(ConsumptionButtons);
