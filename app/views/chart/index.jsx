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
var styles             = require("lib/styles");
var tutorialString     = require("assets/JSON/tutorial-string.json").historicalGraph;
import {
    selectSingleElectricalSensor,
    selectElectricalType,
    selectEnvironmentalSensor,
    selectSource,
    selectMultipleElectricalSensor,
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
        selectElectricalType: React.PropTypes.func.isRequired,
        selectEnvironmentalSensor: React.PropTypes.func.isRequired,
        selectMultipleElectricalSensor: React.PropTypes.func.isRequired,
        selectSingleElectricalSensor: React.PropTypes.func.isRequired,
        selectSource: React.PropTypes.func.isRequired,
    },
    mixins: [
        GetTutorialMixin("historicalGraph",
            [
                "valori",
                "export",
                "tipologie",
                "siti",
                "dateFilter",
                "compare",
                "graph"
            ]
        )
    ],
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
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
        var siti = this.props.collections.get("sites") || Immutable.Map();
        // if (siti.size > 0 && this.props.chart.sensors < 1) {
        //     this.props.selectSingleElectricalSensor([siti.first().get("_id")]);
        // }
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
            {label: "Attiva", key: "activeEnergy"},
            {label: "Potenza Max", key: "maxPower"},
            {label: "Reattiva", key: "reactiveEnergy"}
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
        var dayStart;
        var dayEnd;
        // Query for date-compare
        if (R.contains("period", R.keys(props.chart.dateRanges))) {
            const data = new Date(props.chart.dateRanges.dateOne);
            const periodKey = props.chart.dateRanges.period.key;
            dayStart = moment(data).startOf("month").subtract(1, periodKey).format("YYYY-MM-DD");
            dayEnd = moment(data).add(1, periodKey).format("YYYY-MM-DD");
        // Query for date-filter
        } else if (props.chart.dateRanges && props.chart.dateRanges.range === "dateFilter") {
            dayStart = moment(props.chart.dateRanges.start).format("YYYY-MM-DD");
            dayEnd = moment(props.chart.dateRanges.end).format("YYYY-MM-DD");
        } else {
            // If no data is selected, is displayed the past month.
            dayStart = moment().startOf("month").format("YYYY-MM-DD");
            dayEnd = moment().endOf("month").format("YYYY-MM-DD");
        }
        const sensor = props.chart.electricalSensors.concat(props.chart.consumptionSensors);
        sensor.forEach(function (sensorId) {
            self.props.asteroid.subscribe("dailyMeasuresBySensor", sensorId, dayStart, dayEnd);
        });
    },
    getValoreActiveStyle: function (valore) {
        return R.merge(
            styles.buttonSelectValore,
            {background: valore.color, color: colors.white}
        );
    },
    switchDateCompareAndFilter: function () {
        return R.contains("period", R.keys(this.props.chart.dateRanges));
    },
    getSitoById: function (sitoId) {
        const sites = this.props.collections.get("sites") || Immutable.Map();
        return sites.find(site => {
            return site.get("_id") === sitoId;
        });
    },
    onChangeSensor: function (sensorId, siteId) {
        // TODO
        siteId = ["SitoDiTest1"];
        sensorId = ["ANZ01"];
        this.props.selectSingleElectricalSensor(sensorId, siteId);
    },
    firstSensorOfConsumptionInTheSite: function (consumptionTypes) {
        const site = this.getSitoById(this.props.chart.sites[0]);
        var typeOfSensorId;
        if (consumptionTypes.key === "co2") {
            typeOfSensorId = "COOV";
        } else {
            typeOfSensorId = "ZTHL";
        }
        return site.get("sensorsIds").find(sensorId => {
            if (!isNaN(parseInt(sensorId))) {
                return true;
            }
            return sensorId.slice(0, 4) === typeOfSensorId;
        });
    },
    onChangeConsumption: function (sensorId, consumptionTypes) {
        const selectedSensorId = this.firstSensorOfConsumptionInTheSite(consumptionTypes);
        this.props.selectEnvironmentalSensor([selectedSensorId], [consumptionTypes]);
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
        const sites = this.props.collections.get("sites") || Immutable.Map();

        const valoriMulti = (
            this.switchDateCompareAndFilter() &&
            this.props.chart.electricalSensors.length <= 1
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
                                    onChange={this.props.selectElectricalType}
                                    style={{float: "left"}}
                                    value={this.props.chart.electricalTypes[0]}
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
                                    allowedValues={sites}
                                    filter={CollectionUtils.sites.filter}
                                    getKey={CollectionUtils.sites.getKey}
                                    getLabel={CollectionUtils.sites.getLabel}
                                    onChange={this.onChangeSensor}
                                    placeholder={"Punto di misurazione"}
                                    value={this.getSitoById(this.props.chart.electricalSensors[0])}
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
                                    allowedValues={sites}
                                    filter={CollectionUtils.sites.filter}
                                    getKey={CollectionUtils.sites.getKey}
                                    getSitoLabel={CollectionUtils.sites.getLabel}
                                    onChange={this.props.selectMultipleElectricalSensor}
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
                        onChange={consumptionTypes => this.onChangeConsumption(null, consumptionTypes)}
                        selectedValue={this.props.chart.consumptionTypes[0]}
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
                            consumptionSensors={this.props.chart.consumptionSensors}
                            consumptionTypes={this.props.chart.consumptionTypes[0]}
                            dateCompare={this.switchDateCompareAndFilter() ? this.props.chart.dateRanges : undefined}
                            dateFilter={this.props.chart.dateRanges}
                            electricalSensors={this.props.chart.electricalSensors}
                            electricalTypes={this.props.chart.electricalTypes[0]}
                            getY2Label={CollectionUtils.labelGraph.getY2Label}
                            getYLabel={CollectionUtils.labelGraph.getYLabel}
                            misure={this.props.collections.get("readings-daily-aggregates") || Immutable.Map()}
                            ref="historicalGraph"
                            resetCompare={this.props.removeAllCompare}
                            sites={this.props.chart.sites.map(this.getSitoById)}
                            sources={this.props.chart.sources}
                        />
                    </components.TutorialAnchor>
                </bootstrap.Col>
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
        location: state.router.location,
        collections: state.collections,
        chart: state.chart
    };
}
function mapDispatchToProps (dispatch) {
    return {
        selectSingleElectricalSensor: bindActionCreators(selectSingleElectricalSensor, dispatch),
        selectElectricalType: bindActionCreators(selectElectricalType, dispatch),
        selectEnvironmentalSensor: bindActionCreators(selectEnvironmentalSensor, dispatch),
        selectSource: bindActionCreators(selectSource, dispatch),
        selectMultipleElectricalSensor: bindActionCreators(selectMultipleElectricalSensor, dispatch),
        selectDateRanges: bindActionCreators(selectDateRanges, dispatch),
        selectDateRangesCompare: bindActionCreators(selectDateRangesCompare, dispatch),
        removeAllCompare: bindActionCreators(removeAllCompare, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Chart);
