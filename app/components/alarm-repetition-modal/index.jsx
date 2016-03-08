var ReactWidgets   = require("react-widgets");
var Radium         = require("radium");
var R              = require("ramda");
var React          = require("react");
var bootstrap      = require("react-bootstrap");
var TimePicker     = require("react-time-picker");
var Calendar       = ReactWidgets.Calendar;

var components = require("components");
var stringIt   = require("lib/string-it");
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";
import icons from "lib/icons";

const style = ({colors}) => ({
    timePicker: {
        border: "0px none",
        width: "40%",
        padding: "1px",
        paddingLeft: "5px",
        margin: "20px 0px 10px 0px"
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
        const {colors} = this.getTheme();
        return (
            <span key="datepicker">
                <bootstrap.ListGroupItem
                    onClick={this.toggleDatepicker}
                    style={style(theme).option,
                        {backgroundColor: colors.transparent,
                            color: colors.mainFontColor,
                            fontSize: "16px",
                            borderLeft: "0px",
                            borderRight: "0px",
                            borderColor: colors.borderButtonCalendar,
                            borderRadius: "0px",
                            outline: "none"}
                    }
                >
                    {"Solo il giorno"}
                    <components.Icon
                        color={colors.iconCalendar}
                        icon={"calendar"}
                        size={"28px"}
                        style={{
                            verticalAlign: "middle",
                            lineHeight: "20px",
                            marginLeft: "30px"
                        }}
                    />
                </bootstrap.ListGroupItem>
                <bootstrap.ListGroupItem
                    className="single-day"
                    style={{
                        display: this.state.isDatepickerVisible ? "" : "none",
                        borderBottomLeftRadius: "0px",
                        borderBottomRightRadius: "0px",
                        borderColor: colors.borderContentModal
                    }}
                >
                    <Radium.Style
                        rules={{
                            // Calendar CSS
                            "": {
                                backgroundColor: colors.transparent,
                                borderTop: "0px",
                                borderLeft: "0px",
                                borderRight: "0px",
                                borderBottom: "1px solid " + colors.white
                            },
                            ":focus":{
                                outline: "none"
                            },
                            ".rw-calendar": {
                                outline: "none"
                            },
                            ".rw-widget": {
                                background: "none",
                                outline: "none",
                                margin: "20px 10px",
                                paddingBottom: "15px",
                                borderColor: colors.borderButtonCalendar
                            },
                            ".rw-calendar > div > table": {
                                borderTop: "1px solid " + colors.borderButtonCalendar
                            },
                            ".rw-calendar table thead tr": {
                                border: "0px"
                            },
                            ".rw-state-focus": {
                                background: "none",
                                outline: "none"
                            },
                            ".rw-btn": {
                                textTransform: "uppercase",
                                textAlign: "center",
                                marginBottom: "10px",
                                outline: "none"
                            },
                            ".rw-off-range": {
                                backgroundColor: colors.borderButtonCalendar
                            },
                            ".rw-now": {
                                border: `1px solid ${colors.buttonPrimary} !important`
                            },
                            ".rw-btn .rw-state-focus": {
                                border: "1px solid " + colors.borderButtonCalendar,
                                boxShadow: "none",
                                WebkitBoxShadow: "none",
                                backgroundColor: colors.backgroundContentModal,
                                colors: colors.white,
                                outline: "none"
                            },
                            ".rw-state-focus:hover": {
                                borderColor: colors.borderButtonCalendar,
                                boxShadow: "none",
                                WebkitBoxShadow: "none"
                            },
                            ".rw-state-focus:click": {
                                borderColor: colors.borderButtonCalendar,
                                boxShadow: "none",
                                WebkitBoxShadow: "none",
                                outline: "none"
                            },
                            ".rw-state-selected": {
                                backgroundColor: colors.buttonPrimary,
                                color: colors.white,
                                border: "none !important"
                            },
                            ".rw-calendar-grid td .rw-btn:hover": {
                                backgroundColor: colors.buttonPrimary,
                                color: colors.white,
                                border: "none"
                            },
                            ".rw-calendar-grid td .rw-btn": {
                                borderRadius: "30px",
                                border: `1px solid ${colors.borderButtonCalendar}`,
                                width: "90%",
                                margin: "5px 5%",
                                padding: "0px",
                                color: colors.white
                            },
                            ".rw-header": {
                                margin: "15px 10px 10px 10px",
                                padding: "0px"
                            },
                            ".rw-widget .rw-header .rw-btn-view": {
                                backgroundColor: colors.backgroundContentModal,
                                borderLeft: "0px",
                                borderRight: "0px",
                                borderRadius: "0px",
                                borderTop: `1px solid ${colors.borderButtonCalendar}`,
                                borderBottom: `1px solid ${colors.borderButtonCalendar}`,
                                width: "90%",
                                height: "34px",
                                color: colors.white,
                                outline: "none"
                            },
                            ".rw-widget .rw-header .rw-btn-left": {
                                borderTop: `1px solid ${colors.borderButtonCalendar}`,
                                borderBottom: `1px solid ${colors.borderButtonCalendar}`,
                                borderLeft: `1px solid ${colors.borderButtonCalendar}`,
                                borderRight: "0px",
                                backgroundImage: `url(${icons.iconArrowLeft})`,
                                backgroundPosition: "center",
                                width: "5%",
                                height: "34px",
                                backgroundSize: "35px 35px",
                                backgroundRepeat: "no-repeat",
                                borderBottomLeftRadius: "30px",
                                borderTopLeftRadius: "30px",
                                outline: "none"
                            },
                            ".rw-i": {
                                display: "none"
                            },
                            ".rw-widget .rw-header .rw-btn-right": {
                                borderTop: `1px solid ${colors.borderButtonCalendar}`,
                                borderBottom: `1px solid ${colors.borderButtonCalendar}`,
                                borderRight: `1px solid ${colors.borderButtonCalendar}`,
                                borderLeft: "0px",
                                backgroundImage: `url(${icons.iconArrowRightWhite})`,
                                backgroundPosition: "center",
                                width: "5%",
                                height: "34px",
                                backgroundSize: "35px 35px",
                                backgroundRepeat: "no-repeat",
                                borderBottomRightRadius: "30px",
                                borderTopRightRadius: "30px",
                                outline: "none"
                            },
                            ".rw-calendar-grid .rw-nav-view": {
                                outline: "none"
                            }
                        }}
                        scopeSelector=".single-day"
                    />
                    <Calendar
                        culture={"it"}
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
                    color: theme.colors.mainFontColor,
                    alignItems: "center",
                    display: "flex",
                    textAlign: "left",
                    paddingTop: "2px",
                    paddingBottom: "2px",
                    backgroundColor: theme.colors.transparent,
                    border: "0px",
                    borderRadius: "0px"
                }}
            >
                <span
                    style={{
                        color: theme.colors.mainFontColor,
                        fontSize: "16px",
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
                        color: theme.colors.mainFontColor,
                        fontSize: "16px",
                        alignItems: "center",
                        display: "flex"
                    }}
                >
                    {"Alle ore"}
                    <Radium.Style
                        rules={{
                            "div > span": {
                                margin: "0px auto !important",
                                backgroundColor: theme.colors.trasparent,
                                borderRadius: "30px",
                                width: "35px",
                                height: "35px",
                                lineHeight: "30px",
                                border: "1px solid " + theme.colors.borderContentModal
                            },
                            "div > input": {
                                border: "1px solid " + theme.colors.borderContentModal,
                                backgroundColor: theme.colors.backgroundInputSearch,
                                outline: "none",
                                padding: "4px",
                                margin: "3px 0px"
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
                    header={"Seleziona tipo di notifica"}
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
