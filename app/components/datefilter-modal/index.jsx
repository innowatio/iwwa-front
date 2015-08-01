var Radium         = require("radium");
var React          = require("react");
var bootstrap      = require("react-bootstrap");
var Calendar = require("react-widgets").Calendar;

var components = require("components/");

var DatefilterModal = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        style: React.PropTypes.object,
        title: React.PropTypes.element,
        value: React.PropTypes.array
    },
    getInitialState: function () {
        return {
            showModal: false,
            active: "activeSiteCompare",
            compare: " "
        };
    },
    close: function () {
        this.setState({
            showModal: false
        });
    },
    open: function (value) {
        this.setState({
            showModal: true,
            compare: value.label
        });
    },
    closeSuccess: function () {
        this.close();
    },
    reset: function () {
        // this.props.onChange(null);
    },
    handleSelect: function (select) {
        this.setState({
            active: select
        });
    },
    selectedChackboxDate: function (value) {
        this.setState({
            value: value
        });
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
                <components.Button
                    bsStyle="link"
                    onClick={this.open}
                >
                    {this.props.title}
                </components.Button>
                <bootstrap.Modal
                    container={this}
                    onHide={this.close}
                    show={this.state.showModal}
                >
                    <Radium.Style
                        rules={{
                            ".modal-content": {
                                width: "656px"
                            }
                        }}
                        scopeSelector=".modal-dialog"
                    />
                    <bootstrap.Modal.Header
                        closeButton
                        style={{borderBottom: "none"}}
                    >
                        <h3 className="text-center">{"Seleziona periodo"}</h3>
                    </bootstrap.Modal.Header>
                    <bootstrap.Modal.Body>
                        <span>
                        <h5 style={{marginLeft: "115px"}}>da <components.Spacer direction="h" size={360}/> a</h5>
                        </span>
                        <components.Spacer direction="v" size={15}/>
                        <Calendar
                            className="pull-right"
                            culture={"en-GB"}
                            dayFormat={day => ['L', 'M','M','G', 'V', 'S', 'D'][day]}
                            defaultValue={new Date()}
                            format="MMM dd, yyyy"
                            style={{width: "40%"}}
                        />
                        <Calendar
                            dayFormat={day => ['L', 'M','M','G', 'V', 'S', 'D'][day]}
                            defaultValue={new Date()}
                            format="MMM dd, yyyy"
                            style={{width: "40%"}}
                        />
                    </bootstrap.Modal.Body>
                </bootstrap.Modal>
            </span>
        );
    }
});

module.exports = Radium(DatefilterModal);
