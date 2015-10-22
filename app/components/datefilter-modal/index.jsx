var R         = require("ramda");
var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");
var Calendar  = require("react-widgets").Calendar;
var moment    = require("moment");

var colors     = require("lib/colors");
var components = require("components/");
var measures   = require("lib/measures");

var styles = {
    buttonCompare: {
        width: "200px",
        height: "40px",
        marginRight: "8px",
        marginBottom: "13px"
    }
};

var DatefilterModal = React.createClass({
    propTypes: {
        allowedValues: React.PropTypes.array.isRequired,
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func,
        style: React.PropTypes.object,
        title: React.PropTypes.element,
        value: React.PropTypes.shape({
            start: React.PropTypes.date,
            end: React.PropTypes.date
        })
    },
    getInitialState: function () {
        return {
            active: this.props.getKey(this.props.allowedValues[2]),
            custom: false,
            showModal: false,
            value: {
                start: this.getDefault(this.props.value, "start", this.defaultStartDate()),
                end: this.getDefault(this.props.value, "end", this.defaultEndDate())
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
    confirmAndClose: function () {
        R.partial(this.props.onChange, this.state.value, "dateCompare")();
        this.close();
    },
    close: function () {
        this.setState({
            showModal: false
        });
    },
    defaultStartDate: function () {
        return moment().subtract(1, "months").startOf("month")._d;
    },
    defaultEndDate: function () {
        return moment().subtract(1, "months").endOf("month")._d;
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
                end: new Date()
            }
        });
    },
    setDate: function (dateKey, dateValue) {
        var obj = {};
        obj[dateKey] = dateValue;
        this.setState({
            value: R.merge(this.state.value, obj)
        });
    },
    selectedCheckboxDate: function (allowedValue) {
        var checkedKey = this.props.getKey(allowedValue);
        if (checkedKey === "custom") {
            this.setState({
                custom: true,
                value: {
                    start: this.defaultStartDate(),
                    end: new Date()
                }
            });
        } else if (checkedKey === "2months") {
            this.setState({
                value: {
                    start: moment().subtract(2, "months").startOf("month"),
                    end: moment().subtract(1, "months").endOf("month")
                }
            });
        } else if (checkedKey === "months") {
            this.setState({
                value: {
                    start: moment().subtract(1, "months").startOf("month"),
                    end: moment().subtract(1, "months").endOf("month")
                }
            });
        } else {
            this.setState({
                value: {
                    start: moment().subtract(1, checkedKey),
                    end: new Date()
                }
            });
        }
        this.setState({
            active: checkedKey
        });
    },
    renderButtonFilter: function (allowedValue) {
        var active = this.props.getKey(allowedValue) === this.state.active;
        return (
            <components.Button
                active={active}
                key={this.props.getKey(allowedValue)}
                onClick={R.partial(this.selectedCheckboxDate, allowedValue)}
                style={styles.buttonCompare}
                value={allowedValue}
            >
                {this.props.getLabel(allowedValue)}
            </components.Button>
        );
    },
    renderCustomButton: function () {
        return (
            <div>
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
                        dayFormat={day => ["D", "L", "M", "M", "G", "V", "S"][day]}
                        format="MMM dd, yyyy"
                        onChange={R.partial(this.setDate, "end")}
                        style={{width: "40%"}}
                        value={this.state.value.end}
                    />
                    <Calendar
                        dayFormat={day => ["D", "L", "M", "M", "G", "V", "S"][day]}
                        format="MMM dd, yyyy"
                        onChange={R.partial(this.setDate, "start")}
                        style={{width: "40%"}}
                        value={this.state.value.start}
                    />
                </div>
            </div>
        );
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
                    <bootstrap.Modal.Body style={{textAlign: "center"}}>
                        {this.state.custom ? this.renderCustomButton() : this.props.allowedValues.map(this.renderButtonFilter)}
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

module.exports = Radium(DatefilterModal);
