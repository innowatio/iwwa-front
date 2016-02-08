var bootstrap  = require("react-bootstrap");
var R          = require("ramda");
var Radium     = require("radium");
var React      = require("react");

var components = require("components");

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
        const consumptionButtonColor = {
            backgroundColor: consumption.color
        };
        return (
            <components.Button
                key={consumption.key}
                onClick={R.partial(this.props.onChange, [consumption])}
                style={R.merge(R.merge(this.props.styleButton, isSelected ? this.props.styleButtonSelected : {}), consumptionButtonColor)}
            >
                <img src={consumption.selected} style={this.props.styleIcon} />
                <div style={{textAlign: "center", transition: "width 0.5s ease-in-out", overflow: "hidden"}}>{isSelected ? consumption.label : ""}</div>
            </components.Button>);
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
