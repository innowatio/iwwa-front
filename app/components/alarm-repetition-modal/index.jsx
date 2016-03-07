var Calendar      = require("react-widgets").Calendar;
var Radium        = require("radium");
var R             = require("ramda");
var React         = require("react");
var bootstrap     = require("react-bootstrap");
var TimePicker    = require("react-time-picker");

var components = require("components");
var stringIt   = require("lib/string-it");
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

const style = ({colors}) => ({
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
});

var styleH3 = ({colors}) => ({
    fontSize: "20px",
    lineHeight: "20px",
    fontWeight: "400",
    color: colors.mainFontColor
});

var AlarmRepetitionModal = React.createClass({
    propTypes: {
        updateParentState: React.PropTypes.func.isRequired,
        value: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object]).isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
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
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getRepetitionOptions: function () {
        return [
            {label: "Tutti i giorni", key: [0, 1, 2, 3, 4, 5, 6], action: this.actionPutOrRemoveInArray},
            {label: "Lun", key: 1, action: this.actionPutOrRemoveInArray},
            {label: "Mar", key: 2, action: this.actionPutOrRemoveInArray},
            {label: "Mer", key: 3, action: this.actionPutOrRemoveInArray},
            {label: "Gio", key: 4, action: this.actionPutOrRemoveInArray},
            {label: "Ven", key: 5, action: this.actionPutOrRemoveInArray},
            {label: "Sab", key: 6, action: this.actionPutOrRemoveInArray},
            {label: "Dom", key: 0, action: this.actionPutOrRemoveInArray},
            // TODO mettere tutte le date per la voce "Giorni Festivi" (IWWA-31)
            {label: "Giorni Festivi", key: [0, 6], action: this.actionPutOrRemoveInArray},
            this.renderDateSelection(),
            this.renderTimeSelection()
        ];
    },
    labelParser: function () {
        var labels = [];
        var repetitions = this.props.value.weekDays || [];
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
        const theme = this.getTheme();
        return (
            <span key="datepicker">
                <bootstrap.ListGroupItem
                    onClick={this.toggleDatepicker}
                    style={style(theme).option}
                >
                    {"Solo il giorno"}
                    <components.Icon
                        color={theme.colors.iconCalendar}
                        icon={"calendar"}
                        size={"34px"}
                        style={{
                            verticalAlign: "middle",
                            lineHeight: "20px"
                        }}
                    />
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
        const theme = this.getTheme();
        return (
            <bootstrap.ListGroupItem
                key={"timepickers"}
                style={{
                    color: theme.colors.greySubTitle,
                    alignItems: "center",
                    display: "flex",
                    textAlign: "left",
                    paddingTop: "2px",
                    paddingBottom: "2px"
                }}
            >
                <span
                    style={{
                        color: theme.colors.greySubTitle,
                        alignItems: "center",
                        display: "flex"
                    }}
                >
                    {"Dalle ore"}
                    <TimePicker
                        className="timepicker"
                        onChange={R.partial(this.onChange, ["valueTimeStart"])}
                        style={style(theme).timePicker}
                        value={this.state.valueTimeStart}
                    />
                </span>
                <components.Spacer direction="h" size={50} />
                <span
                    style={{
                        color: theme.colors.greySubTitle,
                        alignItems: "center",
                        display: "flex"
                    }}
                >
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
                        onChange={R.partial(this.onChange, ["valueTimeEnd"])}
                        style={style(theme).timePicker}
                        value={this.state.valueTimeEnd}
                    />
                </span>
            </bootstrap.ListGroupItem>
        );
    },
    render: function () {
        const theme = this.getTheme();
        return (
            <span>
                <h3 style={styleH3(theme)}>{stringIt.titleAlarmNotify}</h3>
                <div onClick={this.toggleModal} style={styles(theme).divAlarmOpenModal}>
                    {this.labelParser()}
                    <components.Icon
                        color={this.getTheme().colors.iconArrow}
                        icon={"arrow-right"}
                        size={"38px"}
                        style={{
                            float: "right",
                            verticalAlign: "middle",
                            lineHeight: "20px"
                        }}
                    />
                </div>
                <components.ModalOptionList
                    allowedValues={this.getRepetitionOptions()}
                    getKey={R.prop("key")}
                    getLabel={R.prop("label")}
                    header={
                        <h4
                            style={{
                                color: theme.colors.mainFontColor,
                                fontSize: "20px",
                                marginBottom: "10px"
                            }}
                        >
                        {"Seleziona tipo di notifica"}</h4>
                    }
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
