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
        console.log("close");
        this.setState({
            showModal: false
        });
    },
    open: function () {
        console.log("open");
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
            <div>
                <bootstrap.Button
                    onClick={this.open}
                >
                    {"Compara per data"}
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
                        <ButtonGroupSelect
                            allowedValues={[
                                "1 week",
                                "1 month"
                            ]}
                            onChange={ function () { console.log("just a log"); } }
                            value={""}
                        />
                        <DateTimePicker
                            defaultValue={new Date()}
                            footer={true}
                            onChange={ this.setValue }
                            time={false}
                        />
                    </bootstrap.Modal.Body>
                </bootstrap.Modal>
            </div>
        );
    }
});

module.exports = Radium(DatepickerFilter);
