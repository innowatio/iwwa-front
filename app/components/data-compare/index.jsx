var R          = require("ramda");
var React      = require("react");

var components = require("components/");

var styles = {
    buttonCompare: {
        width: "200px",
        marginRight: "8px",
        marginBottom: "13px"
    }
};

var DataCompare = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            value: this.props.allowedValues[2].label
        };
    },
    selectedChackboxDate: function (value) {
        this.setState({
            value: value
        });
    },
    iconSelectData: function (active) {
        // TODO Quando ci sono le giuste inserirle al posto di queste
        var iconPower = "/_assets/icons/os__power.svg";
        var iconSiti = "/_assets/icons/os__map.svg";
        return active ?
            iconPower :
            iconSiti;
    },
    renderDataCompare: function (allowedValue) {
        var active = this.state.value === this.props.getLabel(allowedValue);
        return (
            <components.Button
                active={active}
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.selectedChackboxDate, this.props.getLabel(allowedValue))}
                style={styles.buttonCompare}
                value={this.props.getLabel(allowedValue)}
            >
                {this.props.getLabel(allowedValue)}
                <img className="pull-right" src={this.iconSelectData(active)} style={{width: "22px"}}/>
            </components.Button>
        );
    },
    render: function () {
        return (
            <div>
                {this.props.allowedValues.map(this.renderDataCompare)}
            </div>
        );
    }
});

module.exports = DataCompare;
