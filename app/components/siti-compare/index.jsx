var R          = require("ramda");
var React       = require("react");
var IPropTypes  = require("react-immutable-proptypes");

var colors           = require("lib/colors");
var components       = require("components/");

var SitiCompare = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        filter: React.PropTypes.func,
        getSitoLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        open: React.PropTypes.string,
        style: React.PropTypes.object,
        value: React.PropTypes.array
    },
    getInitialState: function () {
        return {
            valueFirst: this.props.value[0],
            valueSecond: this.props.value[1]
        };
    },
    componentWillReceiveProps: function (props) {
        return this.getStateFromProps(props);
    },
    getStateFromProps: function (props) {
        this.setState({
            valueFirst: props.value[0],
            valueSecond: props.value[1]
        });
    },
    multi1: function (propsValue) {
        this.setState({
            valueFirst: propsValue[0]
        });
    },
    multi2: function (propsValue) {
        this.setState({
            valueSecond: propsValue[0]
        });
    },
    onClick: function () {
        var list = R.reject(
            function (a) {
                return a === undefined;
            },
            [this.state.valueFirst, this.state.valueSecond]
        );
        if (list.length === 2) {
            return R.partial(this.props.onChange, list);
        }
    },
    render: function () {
        console.log(this.state);
        return (
            <div>
                <components.Select
                    allowedValues={this.props.allowedValues}
                    filter={this.props.filter}
                    getLabel={this.props.getSitoLabel}
                    onChange={this.multi1}
                    open={this.props.open}
                    placeholder={"Seleziona punto 1"}
                    style={this.props.style}
                    value={this.state.valueFirst}
                />
                <components.Select
                    allowedValues={this.props.allowedValues}
                    filter={this.props.filter}
                    getLabel={this.props.getSitoLabel}
                    onChange={this.multi2}
                    open={this.props.open}
                    placeholder={"Seleziona punto 2"}
                    style={this.props.style}
                    value={this.state.valueSecond}
                />
                <components.Button
                    onClick={this.onClick()}
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

module.exports = SitiCompare;
