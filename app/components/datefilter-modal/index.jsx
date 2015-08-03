var R         = require("ramda");
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
        value: React.PropTypes.shape({
            start: React.PropTypes.date,
            end: React.PropTypes.date
        })
    },
    getInitialState: function () {
        return {
            showModal: false,
            value: {
                start: this.getDefault(this.props.value, "start", this.defaultStartDate()),
                end: this.getDefault(this.props.value, "end", new Date())
            }
        };
    },
    getDefault: function (valueObject, key, defaultValue) {
        var defaultTo = R.defaultTo(defaultValue);

        var result = defaultValue;
        if (R.has(defaultValue, key)) {
            return defaultTo(valueObject[key]);
        }

        return result;
    },
    close: function () {
        this.setState({
            showModal: false
        });
    },
    defaultStartDate: function () {
        var now = new moment()._d;
        return moment(now).subtract(1, "weeks")._d;
    },
    open: function () {
        this.setState({
            showModal: true
        });
    },
    closeSuccess: function () {
        this.close();
    },
    reset: function () {
        this.setState({
            value: {
                start: this.defaultStartDate(),
                end: new Date()
            }
        });
    },
    setDate: function (dateKey, dateValue) {
        this.setState({
            value: R.assoc(dateKey, dateValue, this.state.value[dateKey])
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
                        <h3 className="text-center" style={{color: colors.primary}}>{"Seleziona periodo"}</h3>
                    </bootstrap.Modal.Header>
                    <bootstrap.Modal.Body>
                        <span>
                        <h4 style={{marginLeft: "115px"}}>da <components.Spacer direction="h" size={360}/> a</h4>
                        </span>
                        <components.Spacer direction="v" size={10}/>
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

                    {/* <!-- WARNING: the first calendar is on the right so the 1st here is the 2nd in the page --> */}
                            <Calendar
                                className="pull-right"
                                culture={"en-GB"}
                                dayFormat={day => ['D', 'L', 'M','M','G', 'V', 'S'][day]}
                                format="MMM dd, yyyy"
                                onChange={R.partial(this.setDate, "end")}
                                style={{width: "40%"}}
                                value={this.state.value.end}
                            />
                            <Calendar
                                dayFormat={day => ['D', 'L', 'M','M','G', 'V', 'S'][day]}
                                format="MMM dd, yyyy"
                                onChange={R.partial(this.setDate, "start")}
                                style={{width: "40%"}}
                                value={this.state.value.start}
                            />
                        </div>
                    </bootstrap.Modal.Body>
                    <bootstrap.Modal.Footer style={{textAlign: "center", border: "0px", marginTop: "20px"}}>
                        <components.Button
                            onClick={this.reset}
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
                            onClick={R.partial(this.props.onChange, this.state.value)}
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
