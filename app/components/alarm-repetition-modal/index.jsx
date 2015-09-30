var Calendar   = require("react-widgets").Calendar;
var Radium     = require("radium");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");

var colors     = require("lib/colors");
var components = require("components");
var stringIt   = require("lib/string-it");
var styles     = require("lib/styles");
var TimePicker = require("react-time-picker");
var icons      = require("lib/icons");

var style = {
    timePicker: {
        border: "0px none",
        width: "40%",
        padding: "1px",
        paddingLeft: "5px"
    },
    option: {
        color: colors.greySubTitle,
        textAlign: "left"
    }
};

var AlarmRepetitionModal = React.createClass({
    propTypes: {
        updateParentState: React.PropTypes.func.isRequired,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object]).isRequired
    },
    getInitialState: function () {
        return {
            isOpen: false,
            isDatepickerVisible: false,
            valueRepetition: this.props.value.weekDays || [],
            valueDate: this.props.value.day || null,
            valueTimeEnd: this.props.value.timeEnd || "00:00",
            valueTimeStart: this.props.value.timeStart || "00:00"
        };
    },
    getRepetitionOptions: function () {
        return [
            {label: "Tutti i giorni", key: [0, 1, 2, 3, 4, 5, 6], action: this.actionPutOrRemoveInArray},
            {label: "Lunedì", key: 1, action: this.actionPutOrRemoveInArray},
            {label: "Martedì", key: 2, action: this.actionPutOrRemoveInArray},
            {label: "Mercoledì", key: 3, action: this.actionPutOrRemoveInArray},
            {label: "Giovedì", key: 4, action: this.actionPutOrRemoveInArray},
            {label: "Venerdì", key: 5, action: this.actionPutOrRemoveInArray},
            {label: "Sabato", key: 6, action: this.actionPutOrRemoveInArray},
            {label: "Domenica", key: 0, action: this.actionPutOrRemoveInArray},
            // TODO mettere tutte le date per la voce "Giorni Festivi" (IWWA-31)
            {label: "Giorni Festivi", key: [0, 6], action: this.actionPutOrRemoveInArray},
            this.renderDateSelection(),
            this.renderTimeSelection()
        ];
    },
    labelParser: function () {
        var labels = [];
        var repetitions = this.props.value.weekDays;
        this.getRepetitionOptions().map(function (record) {
            if (R.contains(record.key, repetitions)) {
                labels.push(record.label);
            }
        });
        return labels.join(" - ");
    },
    onChange: function (param, value) {
        var newValue = {};
        newValue[param] = value;
        this.setState(newValue);
    },
    onChangeDatePicker: function (value) {
        // set the date and unset all week days
        this.setState({valueDate: value, valueRepetition: []});
    },
    actionPutOrRemoveInArray: function (value) {
        var newValue = this.state.valueRepetition;
        if (R.isArrayLike(value)) {
            newValue = value;
        } else {
            if (R.contains(value, newValue)) {
                newValue.splice(newValue.indexOf(value), 1);
            } else {
                newValue.push(value);
            }
        }
        // set repetition day / reset datepicker
        this.setState({valueRepetition: newValue, valueDate: null});
    },
    onClickConfirm: function () {
        this.props.updateParentState({
            repetition: {
                day: this.state.valueDate,
                weekDays: this.state.valueRepetition,
                timeEnd: this.state.valueTimeEnd,
                timeStart: this.state.valueTimeStart
            }
        });
        this.toggleModal();
    },
    toggleDatepicker: function () {
        this.setState({isDatepickerVisible: !this.state.isDatepickerVisible});
    },
    toggleModal: function () {
        this.setState({isOpen: !this.state.isOpen});
    },
    renderDateSelection: function () {
        return (
            <span key="datepicker">
                <bootstrap.ListGroupItem
                    onClick={this.toggleDatepicker}
                    style={style.option}
                >
                    {"Solo il giorno"}
                    <img src={icons.iconCalendar} style={{height: "18px", marginLeft: "50px"}}/>
                </bootstrap.ListGroupItem>
                <bootstrap.ListGroupItem style={{display: this.state.isDatepickerVisible ? "" : "none"}}>
                    <Calendar
                        culture={"en-GB"}
                        dayFormat={day => ["D", "L", "M", "M", "G", "V", "S"][day]}
                        format="MMM dd, yyyy"
                        min={new Date()}
                        onChange={this.onChangeDatePicker}
                        value={this.state.valueDate}
                    />
                </bootstrap.ListGroupItem>
            </span>
        );
    },
    renderTimeSelection: function () {
        return (
            <bootstrap.ListGroupItem
                key={"timepickers"}
                style={{
                    color: colors.greySubTitle,
                    alignItems: "center",
                    display: "flex",
                    textAlign: "left",
                    paddingTop: "2px",
                    paddingBottom: "2px"
                }}
            >
                <span style={{
                    color: colors.greySubTitle,
                    alignItems: "center",
                    display: "flex"
                }}>
                    {"Dalle ore"}
                    <TimePicker
                        className="timepicker"
                        onChange={R.partial(this.onChange, "valueTimeStart")}
                        style={style.timePicker}
                        value={this.state.valueTimeStart}
                    />
                </span>
                <components.Spacer direction="h" size={50} />
                <span style={{
                    color: colors.greySubTitle,
                    alignItems: "center",
                    display: "flex"
                }}>
                    {"Alle ore"}
                    <Radium.Style
                        rules={{
                            "div > span": {
                                margin: "0px !important"
                            }
                        }}
                        scopeSelector=".timepicker"
                    />
                    <TimePicker
                        className="timepicker"
                        onChange={R.partial(this.onChange, "valueTimeEnd")}
                        style={style.timePicker}
                        value={this.state.valueTimeEnd}
                    />
                </span>
            </bootstrap.ListGroupItem>
        );
    },
    render: function () {
        return (
            <span>
                <h4 style={{color: colors.primary}}>{stringIt.titleAlarmNotify}</h4>
                <div onClick={this.toggleModal} style={styles.divAlarmOpenModal}>
                    {this.labelParser()}
                    <img src={icons.iconArrowRight} style={{float: "right", width: "33px"}} />
                </div>
                <components.ModalOptionList
                    allowedValues={this.getRepetitionOptions()}
                    getKey={R.prop("key")}
                    getLabel={R.prop("label")}
                    header={<h4 style={{color: colors.primary}}>{"Seleziona tipo di notifica"} </h4>}
                    isModalOpen={this.state.isOpen}
                    onClickConfirm={this.onClickConfirm}
                    onClickReset={this.toggleModal}
                    toggleModal={this.toggleModal}
                    value={this.state.valueRepetition}
                />
            </span>
        );
    }
});

module.exports = Radium(AlarmRepetitionModal);
