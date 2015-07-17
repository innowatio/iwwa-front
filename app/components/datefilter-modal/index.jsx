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
        value: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
            showModal: false,
            value: this.props.value
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
            value: this.props.value
        });
    },
    setValue: function (propKey, propValue) {
        this.setState({
            value: R.assoc(propKey, propValue, this.state.value)
        });
    },
    closeSuccess: function () {
        this.props.onChange(this.state.value);
        this.close();
    },
    render: function () {
        return (
            <span>
                <bootstrap.Button onClick={this.open} >
                    {"Compara per data (placeholder)"}
                </bootstrap.Button>
                <bootstrap.Modal
                    container={this}
                    onHide={this.close}
                    show={this.state.showModal}
                >
                    <bootstrap.Modal.Header closeButton>
                        <bootstrap.Modal.Title>{"Modal heading"}</bootstrap.Modal.Title>
                    </bootstrap.Modal.Header>
                    <bootstrap.Modal.Body>
                        <components.ButtonGroupSelect
                            allowedValues={this.props.periods}
                            getKey={this.props.getPeriodKey}
                            getLabel={this.props.getPeriodLabel}
                            onChange={R.partial(this.setValue, "period")}
                            value={this.state.value.period}
                        />
                        <DateTimePicker
                            defaultValue={new Date()}
                            footer={true}
                            format="MMM dd, yyyy"
                            onChange={R.partial(this.setValue, "dateOne")}
                            time={false}
                            value={this.state.value.dateOne}
                        />
                        <DateTimePicker
                            defaultValue={new Date()}
                            footer={true}
                            format={"MMM dd, yyyy"}
                            onChange={R.partial(this.setValue, "dateTwo")}
                            time={false}
                            value={this.state.value.dateTwo}
                        />
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
