var R               = require("ramda");
var Radium          = require("radium");
var React           = require("react");
var Calendar        = require("react-widgets").Calendar;
var moment          = require("moment");
var momentLocalizer = require("react-widgets/lib/localizers/moment");

import components from "components";
import {defaultTheme} from "lib/theme";
import {styles} from "lib/styles_restyling";
import icons from "lib/icons";

const styleDateFilter = ({colors}) => ({
    borderRadius: "30px",
    outline: "0px",
    marginLeft: "30px",
    marginRight: "30px",
    backgroundColor: colors.backgroundCalendar,
    opacity: 0.8,
    border: `1px solid ${colors.white}`,
    height: "55vh",
    minHeight: "400px"
});

const styleCalendar = ({colors}) => ({
    outline: "0px",
    backgroundColor: colors.transparent,
    border: "0px",
    width: "91%",
    marginLeft: "4.5%"
});

momentLocalizer(moment);

var DateFilter = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        getKey: React.PropTypes.func,
        getLabel: React.PropTypes.func,
        onChange: React.PropTypes.func.isRequired,
        style: React.PropTypes.object,
        title: React.PropTypes.node,
        value: React.PropTypes.shape({
            start: React.PropTypes.date,
            end: React.PropTypes.date
        })
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            showModal: false,
            start: this.defaultStartDate(),
            end: this.defaultEndDate(),
            type: "calendar"
        };
    },
    componentWillReceiveProps: function (props) {
        return this.getStateFromProps(props);
    },
    getStateFromProps: function (props) {
        if (!R.isEmpty(props.value)) {
            this.setState({
                start: new Date(props.value.start),
                end: new Date(props.value.end)
            });
        }
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    defaultStartDate: function () {
        return moment().startOf("month").toDate();
    },
    defaultEndDate: function () {
        return moment().endOf("month").toDate();
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
    // confirmAndClose: function () {
    //     // Transform in UNIX timestamp for the redux-state.
    //     const date = {
    //         start: moment(this.state.start).valueOf(),
    //         end: moment(this.state.end).valueOf()
    //     };
    //     this.props.onChange(date);
    //     this.close();
    // },
    // close: function () {
    //     this.setState({
    //         showModal: false
    //     });
    // },
    // open: function () {
    //     this.setState({
    //         showModal: true
    //     });
    // },
    // closeSuccess: function () {
    //     this.close();
    // },
    // reset: function () {
    //     this.setState({
    //         start: this.defaultStartDate(),
    //         end: this.defaultEndDate(),
    //         type: "calendar"
    //     });
    // },
    setMonthlyDate: function (dateValue) {
        var startDate = moment(dateValue).toDate();
        var endDate = moment(dateValue).endOf("month").toDate();
        this.setState({
            start: startDate,
            end: endDate,
            type: "calendar"
        });
    },
    setTimeInterval: function ([temporalFilter]) {
        switch (temporalFilter.key) {
        case "yesterday":
            this.setState({
                start: moment.utc().subtract({day: 1}).startOf("day"),
                end: moment.utc().subtract({day: 1}).endOf("day"),
                type: temporalFilter
            });
            break;
        case "today":
            this.setState({
                start: moment.utc().startOf("day"),
                end: moment.utc().endOf("day"),
                type: temporalFilter
            });
            break;
        case "lastWeek":
            this.setState({
                start: moment.utc().subtract({week: 1}).startOf("isoWeek"),
                end: moment.utc().subtract({week: 1}).endOf("isoWeek"),
                type: temporalFilter
            });
            break;
        case "currentWeek":
            this.setState({
                start: moment.utc().startOf("isoWeek"),
                end: moment.utc().endOf("isoWeek"),
                type: temporalFilter
            });
        }
    },
    getTemporalFilter: function () {
        return [
            {label: "IERI", key: "yesterday"},
            {label: "OGGI", key: "today"},
            {label: "SETTIMANA CORRENTE", key: "lastWeek"},
            {label: "SETTIMANA SCORSA", key: "currentWeek"}
        ];
    },
    render: function () {
        const {colors} = this.getTheme();
        return (
            <div className="date-filter">
                <div>
                    <h3 className="text-center" style={styles(this.getTheme()).titleFullScreenModal}>
                        {this.props.title}
                    </h3>
                </div>
                <Radium.Style
                    rules={{
                        // Calendar CSS
                        ".rw-btn .rw-state-focus .rw-state-selected": {
                            backgroundColor: colors.primary
                        },
                        ".rw-state-focus": {
                            background: "none"
                        },
                        ".rw-btn": {
                            textTransform: "uppercase"
                        },
                        ".rw-now": {
                            border: `1px solid ${colors.buttonPrimary} !important`
                        },
                        ".rw-btn .rw-state-focus": {
                            border: "1px solid" + colors.white,
                            boxShadow: "none",
                            WebkitBoxShadow: "none",
                            backgroundColor: colors.backgroundCalendar,
                            colors: colors.white
                        },
                        ".rw-state-focus:hover": {
                            borderColor: colors.white,
                            boxShadow: "none",
                            WebkitBoxShadow: "none"
                        },
                        ".rw-state-focus:click": {
                            borderColor: colors.white,
                            boxShadow: "none",
                            WebkitBoxShadow: "none"
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
                            border: `1px solid ${colors.white}`,
                            width: "90%",
                            marginLeft: "8%",
                            color: colors.white
                        },
                        ".rw-header": {
                            marginLeft: "2%",
                            marginTop: "2%"
                        },
                        ".rw-calendar .rw-header .rw-btn-view": {
                            backgroundColor: colors.backgroundCalendar,
                            borderLeft: "0px",
                            borderRight: "0px",
                            borderRadius: "0px",
                            borderTop: `1px solid ${colors.white}`,
                            borderBottom: `1px solid ${colors.white}`,
                            width: "89.3%",
                            color: colors.white,
                            outline: "none"
                        },
                        ".rw-calendar .rw-header .rw-btn-left": {
                            borderTop: `1px solid ${colors.white}`,
                            borderBottom: `1px solid ${colors.white}`,
                            borderLeft: `1px solid ${colors.white}`,
                            borderRight: "0px",
                            backgroundImage: `url(${icons.iconArrowLeft})`,
                            backgroundPosition: "center",
                            width: "5%",
                            height: "34px",
                            backgroundSize: "37px 37px",
                            backgroundRepeat: "no-repeat",
                            borderBottomLeftRadius: "30px",
                            borderTopLeftRadius: "30px",
                            outline: "none"
                        },
                        ".rw-i": {
                            display: "none"
                        },
                        ".rw-calendar .rw-header .rw-btn-right": {
                            borderTop: `1px solid ${colors.white}`,
                            borderBottom: `1px solid ${colors.white}`,
                            borderRight: `1px solid ${colors.white}`,
                            borderLeft: "0px",
                            backgroundImage: `url(${icons.iconArrowRightWhite})`,
                            backgroundPosition: "center",
                            width: "5%",
                            height: "34px",
                            backgroundSize: "45px 45px",
                            backgroundRepeat: "no-repeat",
                            borderBottomRightRadius: "30px",
                            borderTopRightRadius: "30px",
                            outline: "none"
                        },
                        ".rw-calendar-grid .rw-nav-view": {
                            outline: "none"
                        },
                        ".rw-calendar-grid": {
                            outline: "none"
                        }
                    }}
                    scopeSelector=".date-filter"
                />
                <div style={styleDateFilter(this.getTheme())}>
                    <Calendar
                        className="centering"
                        culture="it"
                        finalView="decade"
                        format="DD MMM YYYY"
                        initialView="year"
                        monthFormat="MMMM"
                        onChange={this.setMonthlyDate}
                        style={styleCalendar(this.getTheme())}
                        value={this.state.type === "calendar" ? this.state.start : undefined}
                    />
                    <div style={{borderTop: `1px solid ${colors.white}`}} />
                    <div style={{marginTop: "4%", display: "flex", justifyContent: "center"}}>
                        <components.ButtonGroupSelect
                            allowedValues={this.getTemporalFilter()}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            onChange={this.setTimeInterval}
                            style={R.merge(
                                styles(this.getTheme()).buttonSelectChart, {
                                    background: "none",
                                    border: `1px solid ${colors.white}`,
                                    width: "17%",
                                    minWidth: "200px",
                                    height: "41px",
                                    marginRight: "8px",
                                    fontSize: "14px"
                                }
                            )}
                            styleToMergeWhenActiveState={{background: this.getTheme().colors.buttonPrimary}}
                            value={[this.state.type]}
                        />
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Radium(DateFilter);
