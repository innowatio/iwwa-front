var Immutable  = require("immutable");
var R          = require("ramda");
var React      = require("react");
var moment     = require("moment");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

var CollectionUtils    = require("lib/collection-utils");
var colors             = require("lib/colors");
var components         = require("components/");
var icons              = require("lib/icons");
var GetTutorialMixin   = require("lib/get-tutorial-mixin");
var QuerystringMixin   = require("lib/querystring-mixin");
var styles             = require("lib/styles");
var tutorialString     = require("assets/JSON/tutorial-string.json").historicalGraph;
import {
    selectSingleSite,
    selectType,
    selectEnvironmental,
    selectSource,
    selectMultipleSite,
    selectDateRanges,
    selectDateRangesCompare,
    removeAllCompare
} from "actions/chart";

var selectStyles = {
    selectCompare: {
        width: "450px",
        height: "35px",
        display: "inline-block"
    }
};

var consumptionButtonStyle = {
    color: colors.greySubTitle,
    width: ENVIRONMENT === "cordova" ? "23%" : "180px",
    textAlign: "left",
    marginRight: "15px !important",
    borderRadius: "0px"
};

var consumptionButtonSelectedStyle = {
    color: colors.white,
    backgroundColor: colors.consumption
};

function mapStateToProps (state) {
    return {
        location: state.router.location,
        collections: state.collections,
        chart: state.chart
    };
}

function mapDispatchToProps (dispatch) {
    return {
        selectSingleSite: bindActionCreators(selectSingleSite, dispatch),
        selectType: bindActionCreators(selectType, dispatch),
        selectEnvironmental: bindActionCreators(selectEnvironmental, dispatch),
        selectSource: bindActionCreators(selectSource, dispatch),
        selectMultipleSite: bindActionCreators(selectMultipleSite, dispatch),
        selectDateRanges: bindActionCreators(selectDateRanges, dispatch),
        selectDateRangesCompare: bindActionCreators(selectDateRangesCompare, dispatch),
        removeAllCompare: bindActionCreators(removeAllCompare, dispatch)
    };
}

var Chart = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        chart: React.PropTypes.object.isRequired,
        collections: IPropTypes.map.isRequired,
        localStorage: React.PropTypes.object,
        location: React.PropTypes.object.isRequired,
        removeAllCompare: React.PropTypes.func.isRequired,
        selectDateRanges: React.PropTypes.func.isRequired,
        selectDateRangesCompare: React.PropTypes.func.isRequired,
        selectEnvironmental: React.PropTypes.func.isRequired,
        selectMultipleSite: React.PropTypes.func.isRequired,
        selectSingleSite: React.PropTypes.func.isRequired,
        selectSource: React.PropTypes.func.isRequired,
        selectType: React.PropTypes.func.isRequired
    },
    mixins: [QuerystringMixin,
        GetTutorialMixin("historicalGraph", [
            "valori",
            "export",
            "tipologie",
            "siti",
            "dateFilter",
            "compare",
            "graph"
    ])],
    componentDidMount: function () {
        this.props.asteroid.subscribe("siti");
        if (this.props.chart.alarms) {
            this.props.asteroid.subscribe("alarms");
        }
        this.updateFirstSiteToChart();
        this.subscribeToMisure(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.subscribeToMisure(props);
    },
    componentDidUpdate: function () {
        this.updateFirstSiteToChart();
    },
    updateFirstSiteToChart: function () {
        var siti = this.props.collections.get("siti") || Immutable.Map();
        if (siti.size > 0 && this.props.chart.sites < 1) {
            this.props.selectSingleSite([siti.first().get("_id")]);
        }
    },
    getPeriods: function () {
        return [
            {label: "Settimana", key: "week"},
            {label: "Mese", key: "month"},
            {label: "Trimestre", key: "quarter"}
        ];
    },
    getTipologie: function () {
        return [
            {label: "Attiva", key: "energia attiva"},
            {label: "Potenza Max", key: "potenza massima"},
            {label: "Reattiva", key: "energia reattiva"}
        ];
    },
    getValori: function () {
        return [
            {label: "Reale", color: colors.lineReale, key: "real"},
            {label: "Previsionale", color: colors.linePrevisionale, key: "previsionale"}
        ];
    },
    getConsumptions: function () {
        return [
            {
                label: "Temperatura",
                color: colors.consumption,
                key: "temperature",
                icon: icons.iconTemperature,
                selected: icons.iconTemperatureSelected

            },
            {
                label: "Umidità",
                color: colors.consumption,
                key: "humidity",
                icon: icons.iconHumidity,
                selected: icons.iconHumiditySelected
            },
            {
                label: "Lux",
                color: colors.consumption,
                key: "illuminance",
                icon: icons.iconIdea,
                selected: icons.iconIdeaSelected
            },
            {
                label: "CO2",
                color: colors.consumption,
                key: "co2",
                icon: icons.iconCO2,
                selected: icons.iconCO2Selected
            }
            // {label: "Allarmi", key: "allarms", icon: icons.iconAlarm}
        ];
    },
    getExportType: function () {
        return [
            {label: "Png", key: "png", icon: icons.iconPNG},
            {label: "Csv", key: "csv", icon: icons.iconCSV}
        ];
    },
    getDateCompare: function () {
        return [
            // {label: "IERI", key: "days"},
            // {label: "7 GG FA", key: "7 days before"},
            // {label: "SETTIMANA SCORSA", key: "weeks"},
            {label: "MESE SCORSO", key: "months"},
            {label: "12 MESI FA", key: "years"}
        ];
    },
    // getDateFilter: function () {
    //     return [
    //         {label: "IERI", key: "days"},
    //         {label: "SETTIMANA SCORSA", key: "weeks"},
    //         {label: "MESE SCORSO", key: "months"},
    //         {label: "2 MESI FA", key: "2months"},
    //         {label: "ALTRO PERIODO", key: "custom"}
    //     ];
    // },
    onChangeExport: function (valueChanged) {
        var exportAPILocation = this.refs.historicalGraph.refs.compareGraph.refs.temporalLineGraph;
        if (valueChanged.key === "png") {
            exportAPILocation.exportPNG();
        } else if (valueChanged.key === "csv") {
            exportAPILocation.exportCSV();
        }
    },
    subscribeToMisure: function (props) {
        var self = this;
        var date;
        // Query for date-compare
        if (R.contains("period", R.keys(props.chart.dateRanges[0]))) {
            const data = new Date(props.chart.dateRanges[0].dateOne);
            const periodKey = props.chart.dateRanges[0].period.key;
            const dateString1 = moment(data).subtract(1, periodKey).format("YYYY-MM");
            const dateString2 = moment(data).format("YYYY-MM");
            date = [dateString1, dateString2];
        // Query for date-filter
        } else if (R.contains("start", R.keys(props.chart.dateRanges[0]))) {
            const data = new Date(props.chart.dateRanges[0].start);
            date = [moment(data).format("YYYY-MM")];
        } else {
            // If no data is selected, is displayed the past month.
            date = [moment().format("YYYY-MM")];
        }
        props.chart.sites.forEach(function (sito) {
            date.forEach(function (data) {
                self.props.asteroid.subscribe("misureBySitoAndMonth", sito, data);
            });
        });
    },
    getValoreActiveStyle: function (valore) {
        return R.merge(
            styles.buttonSelectValore,
            {background: valore.color, color: colors.white}
        );
    },
    switchDateCompareAndFilter: function () {
        return R.contains("period", R.keys(this.props.chart.dateRanges[0]));
    },
    getSitoById: function (siti, sitoId) {
        return siti.get(sitoId);
    },
    renderExportButton: function () {
        return (
            <div style={{marginTop: "3px"}}>
                <components.TutorialAnchor
                    message={tutorialString.export}
                    order={2}
                    position="right"
                    ref="export"
                >
                    <components.Popover
                        hideOnChange={true}
                        title={<img src={icons.iconExport} style={{width: "50%"}} />}
                        tooltipId="tooltipExport"
                        tooltipMessage="Esporta"
                        tooltipPosition="right"
                    >
                        <components.DropdownButton
                            allowedValues={this.getExportType()}
                            getIcon={R.prop("icon")}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            onChange={this.onChangeExport}
                        />
                    </components.Popover>
                </components.TutorialAnchor>
            </div>
        );
    },
    render: function () {
        const siti = this.props.collections.get("siti") || Immutable.Map();

        var valoriMulti = (
            this.switchDateCompareAndFilter() &&
            this.props.chart.sites.length <= 1
        );

        return (
            <div style={styles.mainDivStyle}>
                <bootstrap.Col sm={12} style={styles.colVerticalPadding}>
                    <span className="pull-left" style={{display: "flex"}}>
                        <components.TutorialAnchor
                            message={tutorialString.valori}
                            order={1}
                            position="right"
                            ref="valori"
                        >
                            <components.ButtonGroupSelect
                                allowedValues={this.getValori()}
                                getActiveStyle={this.getValoreActiveStyle}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                multi={valoriMulti}
                                onChange={this.props.selectSource}
                                value={this.props.chart.sources}
                            />
                        </components.TutorialAnchor>
                    {ENVIRONMENT === "cordova" ? null : this.renderExportButton()}
                    </span>
                    <span className="pull-right" style={{display: "flex"}}>
                        <components.TutorialAnchor
                            message={tutorialString.tipologie}
                            order={3}
                            position="left"
                            ref="tipologie"
                        >
                            <components.Popover
                                hideOnChange={true}
                                title={<img src={icons.iconPower} style={{width: "75%"}} />}
                                tooltipId="tooltipInterest"
                                tooltipMessage="Quantità d'interesse"
                                tooltipPosition="left"
                            >
                                <components.DropdownSelect
                                    allowedValues={this.getTipologie()}
                                    getKey={R.prop("key")}
                                    getLabel={R.prop("label")}
                                    onChange={this.props.selectType}
                                    style={{float: "left"}}
                                    value={this.props.chart.types[0]}
                                />
                            </components.Popover>
                        </components.TutorialAnchor>
                        <components.TutorialAnchor
                            message={tutorialString.siti}
                            order={4}
                            position="left"
                            ref="siti"
                        >
                            <components.Popover
                                hideOnChange={true}
                                title={<img src={icons.iconSiti} style={{width: "75%"}} />}
                                tooltipId="tooltipMisurazione"
                                tooltipMessage="Punti di misurazione"
                                tooltipPosition="top"
                            >
                                <components.SelectTree
                                    allowedValues={siti}
                                    filter={CollectionUtils.siti.filter}
                                    getKey={CollectionUtils.siti.getKey}
                                    getLabel={CollectionUtils.siti.getLabel}
                                    onChange={this.props.selectSingleSite}
                                    placeholder={"Punto di misurazione"}
                                    value={siti.get(this.props.chart.sites[0])}
                                />
                            </components.Popover>
                        </components.TutorialAnchor>
                        <components.TutorialAnchor
                            message={tutorialString.dateFilter}
                            order={5}
                            position="left"
                            ref="dateFilter"
                        >
                            <components.DatefilterMonthlyModal
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                onChange={this.props.selectDateRanges}
                                title={<img src={icons.iconCalendar} style={{width: "75%"}} />}
                                value={this.props.chart.dateRanges[0]}
                            />
                        </components.TutorialAnchor>
                        <components.TutorialAnchor
                            message={tutorialString.compare}
                            order={6}
                            position="left"
                            ref="compare"
                        >
                            <components.Compare>
                                <components.SitiCompare
                                    allowedValues={siti}
                                    filter={CollectionUtils.siti.filter}
                                    getKey={CollectionUtils.siti.getKey}
                                    getSitoLabel={CollectionUtils.siti.getLabel}
                                    onChange={this.props.selectMultipleSite}
                                    open={"undefined"}
                                    style={selectStyles.selectCompare}
                                    value={this.props.chart.sites}
                                />
                                <components.DateCompare
                                    allowedValues={this.getDateCompare()}
                                    getKey={R.prop("key")}
                                    getLabel={R.prop("label")}
                                    onChange={this.props.selectDateRangesCompare}
                                    value={this.props.chart.dateRanges[0]}
                                />
                            </components.Compare>
                        </components.TutorialAnchor>
                    </span>
                </bootstrap.Col>
                <bootstrap.Col sm={12}>
                    <components.ConsumptionButtons
                        allowedValues={this.getConsumptions()}
                        onChange={this.props.selectEnvironmental}
                        selectedValue={this.props.chart.types[1]}
                        style={{width: "100%"}}
                        styleButton={consumptionButtonStyle}
                        styleButtonSelected={consumptionButtonSelectedStyle}
                        styleIcon={{height: "25px", marginRight: "10px", borderRadius: "0px"}}
                    />
                </bootstrap.Col>
                <bootstrap.Col className="modal-container" sm={12}>
                    <components.TutorialAnchor
                        message={ENVIRONMENT === "cordova" ? tutorialString.appGraph : tutorialString.webGraph}
                        order={7}
                        position="top"
                        ref="graph"
                    >
                        <components.HistoricalGraph
                            alarms={this.props.chart.alarms}
                            consumption={this.props.chart.types[1]}
                            dateCompare={this.switchDateCompareAndFilter() ? this.props.chart.dateRanges[0] : undefined}
                            dateFilter={this.props.chart.dateRanges[0]}
                            getY2Label={CollectionUtils.labelGraph.getY2Label}
                            getYLabel={CollectionUtils.labelGraph.getYLabel}
                            misure={this.props.collections.get("site-month-readings-aggregates") || Immutable.Map()}
                            ref="historicalGraph"
                            resetCompare={this.props.removeAllCompare}
                            siti={this.props.chart.sites.map(R.partial(this.getSitoById, [siti]))}
                            tipologia={this.props.chart.types[0]}
                            valori={this.props.chart.sources}
                        />
                    </components.TutorialAnchor>
                </bootstrap.Col>
            </div>
        );
    }
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(Chart);
