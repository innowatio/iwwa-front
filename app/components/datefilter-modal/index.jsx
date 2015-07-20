var R              = require("ramda");
var Radium         = require("radium");
var React          = require("react");
var bootstrap      = require("react-bootstrap");
var DateTimePicker = require("react-widgets").DateTimePicker;

var components = require("components");

var DatepickerFilter = React.createClass({
    propTypes: {
        getPeriodKey: React.PropTypes.func.isRequired,
        getPeriodLabel: React.PropTypes.func.isRequired,
        onChange: React.PropTypes.func.isRequired,
        periods: React.PropTypes.arrayOf(React.PropTypes.shape({
            key: React.PropTypes.string,
            label: React.PropTypes.string
        })).isRequired,
        value: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            showModal: false,
            value: this.props.value || this.getDefaultValue()
        };
    },
    getDefaultValue: function () {
        /*
        *   Not in getDefaultProps as the method doesn't know about the instance
        *   of the component, and therefore its props
        */
        var now = new Date();
        return {
            period: this.props.periods[0],
            dateOne: now,
            dateTwo: now
        };
    },
    close: function () {
        this.setState({
            showModal: false
        });
    },
    open: function () {
        this.setState({
            showModal: true,
            value: this.props.value || this.getDefaultValue()
        });
    },
    setPeriod: function (period) {
        this.setState({
            value: R.assoc("period", period[0], this.state.value)
        });
    },
    setDate: function (dateKey, dateValue) {
        this.setState({
            value: R.assoc(dateKey, dateValue, this.state.value)
        });
    },
    closeSuccess: function () {
        this.props.onChange(this.state.value);
        this.close();
    },
    reset: function () {
        this.props.onChange(null);
    },
    renderResetButton: function () {
        return this.props.value ? (
            <bootstrap.Button onClick={this.reset}>
                <components.Icon icon="times" />
            </bootstrap.Button>
        ) : null;
    },
    render: function () {
        return (
            <span>
                <bootstrap.ButtonGroup>
                    <bootstrap.Button onClick={this.open} >
                        {"Confronta per data"}
                    </bootstrap.Button>
                    {this.renderResetButton()}
                </bootstrap.ButtonGroup>
                <bootstrap.Modal
                    container={this}
                    onHide={this.close}
                    show={this.state.showModal}
                >
                    <bootstrap.Modal.Header closeButton>
                        <bootstrap.Modal.Title>
                            {"Scegli le date da confrontare"}
                        </bootstrap.Modal.Title>
                    </bootstrap.Modal.Header>
                    <bootstrap.Modal.Body>
                        <components.ButtonGroupSelect
                            allowedValues={this.props.periods}
                            getKey={this.props.getPeriodKey}
                            getLabel={this.props.getPeriodLabel}
                            onChange={this.setPeriod}
                            value={[this.state.value.period]}
                        />
                        <components.Spacer direction="v" size={16} />
                        <div>
                            <label>
                                {"Data d'inizio primo set"}
                            </label>
                            <DateTimePicker
                                defaultValue={new Date()}
                                footer={true}
                                format="MMM dd, yyyy"
                                onChange={R.partial(this.setDate, "dateOne")}
                                time={false}
                                value={this.state.value.dateOne}
                            />
                        </div>
                        <components.Spacer direction="v" size={16} />
                        <div>
                            <label>
                                {"Data d'inizio secondo set"}
                            </label>
                            <DateTimePicker
                                defaultValue={new Date()}
                                footer={true}
                                format={"MMM dd, yyyy"}
                                onChange={R.partial(this.setDate, "dateTwo")}
                                time={false}
                                value={this.state.value.dateTwo}
                            />
                        </div>
                    </bootstrap.Modal.Body>
                    <bootstrap.Modal.Footer>
                        <bootstrap.Button onClick={this.close}>
                            {"Cancel"}
                        </bootstrap.Button>
                        <bootstrap.Button onClick={this.closeSuccess}>
                            {"Apply"}
                        </bootstrap.Button>
                    </bootstrap.Modal.Footer>
                </bootstrap.Modal>
            </span>
        );
    }
});

module.exports = Radium(DatepickerFilter);
