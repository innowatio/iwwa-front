var R               = require("ramda");
var Radium          = require("radium");
var React           = require("react");
var bootstrap       = require("react-bootstrap");
var Calendar        = require("react-widgets").Calendar;
var moment          = require("moment");
var momentLocalizer = require("react-widgets/lib/localizers/moment");

var colors     = require("lib/colors");
var components = require("components/");
var measures   = require("lib/measures");

momentLocalizer(moment);

var DatefilterMonthlyModal = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        style: React.PropTypes.object,
        title: React.PropTypes.element,
        value: React.PropTypes.shape({
            start: React.PropTypes.date,
            end: React.PropTypes.date
        })
    },
    getInitialState: function () {
        return {
            custom: false,
            data: "",
            showModal: false,
            value: {
                start: this.defaultStartDate(),
                end: this.defaultEndDate()
            }
        };
    },
    componentWillReceiveProps: function (props) {
        return this.getStateFromProps(props);
    },
    getStateFromProps: function (props) {
        if (!R.isEmpty(props.value)) {
            this.setState({
                value: {
                    start: new Date(props.value.start),
                    end: new Date(props.value.end)
                }
            });
        }
    },
    getDefault: function (valueObject, key, defaultValue) {
        var defaultTo = R.defaultTo(defaultValue);

        var result = defaultValue;
        var hasKey = R.has(key);
        if (!R.isNil(valueObject) && hasKey(valueObject)) {
            return defaultTo(new Date(valueObject[key]));
        }

        return result;
    },
    confirmAndClose: function () {
        // Transform in UNIX timestamp for the redux-state.
        const date = {
            range: "dateFilter",
            start: moment(this.state.value.start).valueOf(),
            end: moment(this.state.value.end).valueOf()
        };
        this.props.onChange(date);
        this.close();
    },
    close: function () {
        this.setState({
            showModal: false
        });
    },
    defaultStartDate: function () {
        return moment().startOf("month")._d;
    },
    defaultEndDate: function () {
        return moment().endOf("month")._d;
    },
    open: function () {
        this.setState({
            custom: false,
            showModal: true
        });
    },
    closeSuccess: function () {
        this.close();
    },
    reset: function () {
        this.setState({
            custom: false,
            value: {
                start: this.defaultStartDate(),
                end: this.defaultEndDate()
            }
        });
    },
    setDate: function (dateValue) {
        var startDate = moment(dateValue)._d;
        var endDate = moment(dateValue).endOf("month")._d;
        this.setState({
            value: {
                start: startDate,
                end: endDate
            }
        });
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
                                width: measures.modalWidthLarge
                            },
                            ".modal-body": {
                                padding: "0px"
                            },
                            ".rw-state-focus": {
                                border: "1px solid" + colors.greyBorder,
                                boxShadow: "none",
                                WebkitBoxShadow: "none"
                            },
                            ".rw-state-focus:hover": {
                                borderColor: colors.greyBorder,
                                boxShadow: "none",
                                WebkitBoxShadow: "none"
                            },
                            ".rw-state-focus:click": {
                                borderColor: colors.greyBorder,
                                boxShadow: "none",
                                WebkitBoxShadow: "none"
                            },
                            ".rw-state-selected": {
                                backgroundColor: colors.primary,
                                color: colors.white
                            },
                            ".rw-calendar-grid td .rw-btn:hover": {
                                backgroundColor: colors.primary,
                                color: colors.white
                            }
                        }}
                        scopeSelector=".modal-dialog"
                    />
                    <bootstrap.Modal.Header
                        closeButton={true}
                        style={{borderBottom: "none"}}
                    >
                        <h3 className="text-center" style={{color: colors.primary}}>{"Seleziona periodo"}</h3>
                    </bootstrap.Modal.Header>
                    <bootstrap.Modal.Body style={{textAlign: "center"}}>
                        <Calendar
                            className="centering"
                            culture="it"
                            finalView="decade"
                            format="DD MMM YYYY"
                            initialView="year"
                            monthFormat="MMMM"
                            onChange={this.setDate}
                            style={{borderRadius: "0px", outline: "0px"}}
                            value={this.state.value ? this.state.value.start : undefined}
                        />
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
                            onClick={this.confirmAndClose}
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

module.exports = Radium(DatefilterMonthlyModal);
