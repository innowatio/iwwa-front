var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var DateTimePicker    = require("react-widgets/lib/DateTimePicker");
var ButtonGroupSelect = require("components/button-group-select");

var DatepickerFilter = React.createClass({
    getInitialState: function () {
        return {
            showModal: false
        };
    },
    close: function () {
        this.setState({
            showModal: false
        });
    },
    open: function () {
        this.setState({
            showModal: true
        });
    },
    setValue: function (value) {
        this.setState({
            value: value
        });
    },
    render: function () {
        return (
            <bootstrap.Modal
                container={this}
                onHide={this.close}
                show={this.state.showModal}
            >
                <bootstrap.Modal.Header closeButton>
                    <bootstrap.Modal.Title>{"Modal heading"}</bootstrap.Modal.Title>
                </bootstrap.Modal.Header>
                <bootstrap.Modal.Body>
                    <ButtonGroupSelect
                        allowedValues={[
                            "1 week",
                            "1 month"
                        ]}
                        onChange={ function (value) { console.log( value ); } }
                        value={""}
                    />
                    <DateTimePicker
                        defaultValue={new Date()}
                        footer={true}
                        format={"MMM dd, yyyy"}
                        onChange={ this.setValue }
                        time={false}
                    />
                </bootstrap.Modal.Body>
            </bootstrap.Modal>
        );
    }
});

module.exports = Radium(DatepickerFilter);
