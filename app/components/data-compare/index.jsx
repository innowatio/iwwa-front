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

var DataCompare = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        closeModal: React.PropTypes.func,
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func,
        value: React.PropTypes.object
    },
    getInitialState: function () {
        var now = new Date();
        return {
            value: {
                period: R.isNil(this.props.value) ? this.props.allowedValues[2] : this.props.value.period,
                dateOne: R.isNil(this.props.value) ? now : this.props.value.dateOne
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
    iconSelectData: function (active) {
        // TODO Quando ci sono le giuste inserirle al posto di queste
        var iconPower = "/_assets/icons/os__power.svg";
        var iconSiti = "/_assets/icons/os__map.svg";
        return active ?
            iconPower :
            iconSiti;
    },
    onClickButton: function () {
        this.props.closeModal();
        this.props.onChange(this.state.value, "sito");
    },
    renderDataCompare: function (allowedValue) {
        var active = allowedValue === this.state.value.period;
        return (
            <components.Button
                active={active}
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.selectedCheckboxDate, allowedValue)}
                style={styles.buttonCompare}
                value={allowedValue}
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

module.exports = DataCompare;
