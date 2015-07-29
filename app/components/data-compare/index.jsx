var bootstrap  = require("react-bootstrap");
var R          = require("ramda");
var React      = require("react");


var DataCompare = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            value: "Ieri e oggi"
        };
    },
    selectedChackboxDate: function (value) {
        this.setState({
            value: value
        });
    },
    renderDataCompare: function (allowedValue) {
        return (
                <bootstrap.Input
                    checked={this.state.value === this.props.getLabel(allowedValue)}
                    key={this.props.getKey(allowedValue)}
                    onChange={R.identity()}
                    onClick={R.partial(this.selectedChackboxDate, this.props.getLabel(allowedValue))}
                    type="radio"
                    value={this.props.getLabel(allowedValue)}
                >
                    <span>{this.props.getLabel(allowedValue)}</span>
                </bootstrap.Input>
        );
    },
    render: function () {
        return (
            <div className="checkbox checkbox-slider--b-flat">
                {this.props.allowedValues.map(this.renderDataCompare)}
            </div>
        );
    }
});

module.exports = DataCompare;
