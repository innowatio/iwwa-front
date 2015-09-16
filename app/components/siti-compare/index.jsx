var R          = require("ramda");
var React      = require("react");
var IPropTypes = require("react-immutable-proptypes");

var colors     = require("lib/colors");
var components = require("components/");

var SitiCompare = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.oneOfType([
            React.PropTypes.array,
            IPropTypes.iterable
        ]).isRequired,
        closeModal: React.PropTypes.func,
        filter: React.PropTypes.func,
        getSitoLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        open: React.PropTypes.string,
        resetParam: React.PropTypes.func,
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
            return () => {
                this.props.onChange(list, "dateCompare");
                this.props.closeModal();
            };
        }
    },
    titleFirstSelect: function () {
        return R.isNil(this.state.valueFirst) ?
        <span>
            Seleziona punto 1
            <components.Icon icon="chevron-down" style={{float: "right"}}/>
        </span> :
        <span>
            {this.props.getSitoLabel(this.state.valueFirst)}
            <components.Spacer direction="h" size={30} />
            {this.state.valueFirst.get("pod")}
            <components.Icon icon="chevron-down" style={{float: "right"}}/>
        </span>;
    },
    titleSecondSelect: function () {
        return R.isNil(this.state.valueSecond) ?
        <span>
            Seleziona punto 2
            <components.Icon icon="chevron-down" style={{float: "right"}}/>
        </span> :
        <span>
            {this.props.getSitoLabel(this.state.valueSecond)}
            <components.Spacer direction="h" size={30} />
            {this.state.valueSecond.get("pod")}
            <components.Icon icon="chevron-down" style={{float: "right"}}/>
        </span>;
    },
    render: function () {
        return (
            <div className="select-popover">
                <components.Popover
                    arrow="none"
                    style="inherit"
                    title={this.titleFirstSelect()}
                >
                    <components.SelectTree
                        allowedValues={this.props.allowedValues}
                        buttonCloseDefault={true}
                        filter={this.props.filter}
                        getLabel={this.props.getSitoLabel}
                        onChange={this.multi1}
                        value={this.state.valueFirst}
                    />
                </components.Popover>
                <components.Spacer direction="v" size={30} />
                <components.Popover
                    arrow="none"
                    style="inherit"
                    title={this.titleSecondSelect()}
                >
                    <components.SelectTree
                        allowedValues={this.props.allowedValues}
                        buttonCloseDefault={true}
                        filter={this.props.filter}
                        getLabel={this.props.getSitoLabel}
                        onChange={this.multi2}
                        value={this.state.valueSecond}
                    />
                </components.Popover>
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
