var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");
var Calendar  = require("react-widgets").Calendar;
var moment    = require("moment");

var colors = require("lib/colors");
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
    defaultDate: function () {
        var now = new Date();
        return moment(now).subtract(1, "weeks")._d;
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
                        <div className="rw-calendar-modal">
                            <Radium.Style
                                rules={{
                                    ".rw-header": {
                                        background: colors.primary,
                                        color: colors.white
                                    },
                                    ".rw-header .rw-btn-view": {
                                        background: colors.primary,
                                        color: colors.white,
                                        borderRadius: "0px"
                                    },
                                    ".rw-btn": {
                                        outline: "0px",
                                        outlineStyle: "none",
                                        outlineWidth: "0px"
                                    }
                                }}
                                scopeSelector=".rw-calendar-modal"
                            />
                            <Calendar
                                className="pull-right"
                                culture={"en-GB"}
                                dayFormat={day => ['D', 'L', 'M','M','G', 'V', 'S'][day]}
                                defaultValue={new Date()}
                                format="MMM dd, yyyy"
                                style={{width: "40%"}}
                            />
                            <Calendar
                                dayFormat={day => ['D', 'L', 'M','M','G', 'V', 'S'][day]}
                                defaultValue={this.defaultDate()}
                                format="MMM dd, yyyy"
                                style={{width: "40%"}}
                            />
                        </div>
                    </bootstrap.Modal.Body>
                    <bootstrap.Modal.Footer style={{textAlign: "center", border: "0px", marginTop: "20px"}}>
                        <components.Button
                            onClick={this.closeSuccess}
                            style={{
                                background: colors.greyBackground,
                                color: colors.primary,
                                width: "230px",
                                height: "45px"
                            }}
                        >
                            {"RESET"}
                        </components.Button>
                        <components.Spacer direction="h" size={20} />
                        <components.Button
                            onClick={this.close}
                            style={{
                                background: colors.primary,
                                color: colors.white,
                                width: "230px",
                                height: "45px"
                            }}
                        >
                            {"CONFERMA"}
                        </components.Button>
                    </bootstrap.Modal.Footer>
                </bootstrap.Modal>
            </span>
        );
    }
});

module.exports = Radium(DatefilterModal);
