var R          = require("ramda");
var React      = require("react");

var colors     = require("lib/colors");
var components = require("components/");

var styles = {
    buttonCompare: {
        width: "200px",
        height: "40px",
        marginRight: "8px",
        marginBottom: "13px"
    }
};

var DateCompare = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        closeModal: React.PropTypes.func,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func,
        value: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            value: {
                period: R.isNil(this.props.value) || R.isNil(this.props.value.period) ?
                    this.props.allowedValues[0] :
                    this.props.value.period,
                dateOne: R.isNil(this.props.value) || R.isNil(this.props.value.dateOne) ?
                    new Date() :
                    this.props.value.dateOne
            }
        };
    },
    componentWillReceiveProps: function (props) {
        return this.getStateFromProps(props);
    },
    getStateFromProps: function (props) {
        this.setState({
            value: props.value
        });
    },
    selectedCheckboxDate: function (allowedValue) {
        var newState = R.merge(this.state.value, {period: allowedValue});
        this.setState({
            value: newState
        });
    },
    onClickButton: function () {
        this.props.closeModal();
        this.props.onChange(this.state.value);
    },
    renderDataCompare: function (allowedValue) {
        return (
            <components.Button
                active={R.equals(allowedValue, R.path(["period"], this.state.value))}
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.selectedCheckboxDate, [allowedValue])}
                style={styles.buttonCompare}
                value={allowedValue}
            >
                {this.props.getLabel(allowedValue)}
            </components.Button>
        );
    },
    render: function () {
        return (
            <div>
                {this.props.allowedValues.map(this.renderDataCompare)}
                <components.Button
                    onClick={this.onClickButton}
                    style={{
                        background: colors.primary,
                        marginTop: "60px",
                        color: colors.white,
                        width: "230px",
                        height: "45px"
                    }}
                >
                    {"CONFERMA"}
                </components.Button>
            </div>
        );
    }
});

module.exports = DateCompare;
