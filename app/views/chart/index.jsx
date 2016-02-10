var Immutable  = require("immutable");
var R          = require("ramda");
var React      = require("react");
var moment     = require("moment");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

var CollectionUtils    = require("lib/collection-utils");
var components         = require("components/");
var icons              = require("lib/icons");
var GetTutorialMixin   = require("lib/get-tutorial-mixin");
var tutorialString     = require("assets/JSON/tutorial-string.json").historicalGraph;
import * as parameters from "./parameters";
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
import {styles} from "lib/styles_restyling";
import {defaultTheme} from "lib/theme";

const selectStyles = {
    selectCompare: {
        width: "450px",
        height: "35px",
        display: "inline-block"
    }
};

const consumptionButtonStyle = ({colors}) => ({
    color: colors.greySubTitle,
    textAlign: "center",
    marginRight: "15px !important",
    borderRadius: "22px",
    width: "45px",
    height: "45px",
    transition: "width 0.4s ease-in-out",
    border: "none"
});

const consumptionButtonSelectedStyle = ({colors}) => ({
    color: colors.white,
    backgroundColor: colors.consumption,
    textAlign: "left",
    borderRadius: "22px",
    width: ENVIRONMENT === "cordova" ? "23%" : "160px",
    height: "45px",
    transition: "width 0.4s ease-in-out"
});

var Chart = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        chart: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
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
        selectSource: React.PropTypes.func.isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    mixins: [
        GetTutorialMixin("historicalGraph",
            ["valori", "export", "tipologie", "siti", "dateFilter", "compare", "graph"]
        )
    ],
    getInitialState: function () {
        return {
            siteNavigatorView: false
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
        this.props.asteroid.subscribe("sensors");
        if (this.props.chart[0].alarms) {
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
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    updateFirstSiteToChart: function () {
        var sites = this.props.collections.get("sites") || Immutable.Map();
        if (sites.size > 0 && !this.props.chart[0].sensorId) {
            const firstSite = sites.first();
            this.props.selectSingleElectricalSensor({
                sensor: firstSite.get("sensorsIds").first(),
                site: firstSite.get("_id"),
                fullPath: [firstSite.get("_id")]
            });
        }
    },
    onChangeExport: function (valueChanged) {
        var exportAPILocation = this.refs.historicalGraph.refs.compareGraph.refs.temporalLineGraph;
        if (valueChanged.key === "png") {
            exportAPILocation.exportPNG();
        } else if (valueChanged.key === "csv") {
            exportAPILocation.exportCSV();
        }
    },
    subscribeToMisure: function (props) {
        const dateFirstChartState = props.chart[0].date;
        var dateStart;
        var dateEnd;
        // Query for date-compare
        if (dateFirstChartState.type === "dateCompare") {
            const dateSecondChartState = props.chart[1].date;
            dateStart = [
                moment.utc(dateFirstChartState.start).format("YYYY-MM-DD"),
                moment.utc(dateSecondChartState.start).format("YYYY-MM-DD")
            ];
            dateEnd = [
                moment.utc(dateFirstChartState.end).format("YYYY-MM-DD"),
                moment.utc(dateSecondChartState.end).format("YYYY-MM-DD")
            ];
        // Query for date-filter
        } else if (dateFirstChartState.type === "dateFilter") {
            dateStart = moment.utc(dateFirstChartState.start).format("YYYY-MM-DD");
            dateEnd = moment.utc(dateFirstChartState.end).format("YYYY-MM-DD");
        } else {
            // If no data is selected, is displayed the past month.
            dateStart = moment.utc().startOf("month").format("YYYY-MM-DD");
            dateEnd = moment.utc().endOf("month").format("YYYY-MM-DD");
        }
        const sensors = props.chart.map(singleSelection => singleSelection.sensorId);
        const measurementTypes = props.chart.map(singleSelection => singleSelection.measurementType.key);
        const sources = props.chart.map(singleSelection => singleSelection.source.key);
        sensors[0] && sensors.forEach((sensorId, idx) => {
            props.asteroid.subscribe(
                "dailyMeasuresBySensor",
                sensorId,
                R.is(Array, dateStart) ? dateStart[idx] : dateStart,
                R.is(Array, dateEnd) ? dateEnd[idx] : dateEnd,
                sources[idx],
                measurementTypes[idx]
            );
        });
    },
    getValoreActiveStyle: function (valore) {
        const theme = this.getTheme();
        return R.merge(
            styles(theme).buttonSelectValore,
            {background: valore.color, color: theme.colors.white}
        );
    },
    getSitoById: function (sitoId) {
        const sites = this.props.collections.get("sites") || Immutable.Map();
        return sites.find(site => {
            return site.get("_id") === sitoId;
        });
    },
    getSensorById: function (sensorId) {
        return this.props.collections.getIn(["sensors", sensorId]);
    },
    getConsumptionVariablesFromFullPath: function (fullPath) {
        if (R.isArrayLike(fullPath) && fullPath.length > 0) {
            // All sensors under a site
            const site = this.getSitoById(fullPath[0]);
            const sensorsType = site.get("sensorsIds").map(sensorId => {
                const sensorObject = this.getSensorById(sensorId);
                if (sensorObject) {
                    return sensorObject.get("type");
                }
                return undefined;
            });
            return parameters.getConsumptions(this.getTheme()).filter(consumption => {
                return R.contains(consumption.key, sensorsType);
            });
        }
        return [];
    },
    firstSensorOfConsumptionInTheSite: function (consumptionTypes) {
        const site = this.getSitoById(this.props.chart[0].site);
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
    onChangeMultiSources: function (currentValue, allowedValue) {
        const value = currentValue.map(value => value.key);
        const index = value.indexOf(allowedValue.key);
        if (index === -1) {
            /*
            *   The array does not contain the current value, hence we add it
            */
            this.props.selectSource(R.append(allowedValue, R.uniq(currentValue)));
        } else {
            /*
            *   The array contains the current value, hence we remove it
            */
            const arrayWithValueRemoved = R.remove(index, 1, currentValue);
            arrayWithValueRemoved.length > 0 ? this.props.selectSource(arrayWithValueRemoved) : null;
        }
    },
    isDateCompare: function () {
        return this.props.chart[0].date.type === "dateCompare";
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
                            allowedValues={parameters.getExportType()}
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
        const selectedSitesId = R.uniq(this.props.chart.map(singleSelection => singleSelection.site));
        const selectedSites = selectedSitesId.map(siteId => this.getSitoById(siteId));
        const selectedSources = this.props.chart.map(singleSelection => singleSelection.source);
        const selectedConsumptionType = (
            this.props.chart.length > 1 &&
            R.allUniq(this.props.chart.map(singleSelection => singleSelection.measurementType))
        ) ?
            this.props.chart[1].measurementType :
            null;
        const valoriMulti = (!this.isDateCompare() && selectedSitesId.length < 2 && !selectedConsumptionType);
        const variables = this.getConsumptionVariablesFromFullPath(this.props.chart[0].fullPath);
        return (
            <div style={styles(this.getTheme()).mainDivStyle}>
                <bootstrap.Col sm={12} style={styles(this.getTheme()).colVerticalPadding}>
                    <span className="pull-left" style={{display: "flex"}}>
                        <components.TutorialAnchor
                            message={tutorialString.valori}
                            order={1}
                            position="right"
                            ref="valori"
                        >
                            <components.ButtonGroupSelect
                                allowedValues={parameters.getSources(this.getTheme())}
                                getActiveStyle={this.getValoreActiveStyle}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                multi={valoriMulti}
                                onChange={this.props.selectSource}
                                onChangeMulti={this.onChangeMultiSources}
                                value={selectedSources}
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
                                    allowedValues={parameters.getMeasurementTypes()}
                                    getKey={R.prop("key")}
                                    getLabel={R.prop("label")}
                                    onChange={this.props.selectElectricalType}
                                    style={{float: "left"}}
                                    value={this.props.chart[0].measurementType}
                                />
                            </components.Popover>
                        </components.TutorialAnchor>
                        <components.TutorialAnchor
                            message={tutorialString.siti}
                            order={4}
                            position="left"
                            ref="siti"
                        >
                            <components.SiteNavigator
                                allowedValues={sites.sortBy(site => site.get("name"))}
                                defaultPath={this.props.chart[0].fullPath || []}
                                onChange={this.props.selectSingleElectricalSensor}
                                title={"Quale punto di misurazione vuoi visualizzare?"}
                            />
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
                                value={
                                    this.props.chart[0].date.type === "dateFilter" ?
                                    this.props.chart[0].date : {}
                                }
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
                                    filter={CollectionUtils.sites.filter}
                                    getKey={CollectionUtils.sites.getKey}
                                    getSitoLabel={CollectionUtils.sites.getLabel}
                                    onChange={this.props.selectMultipleElectricalSensor}
                                    open={"undefined"}
                                    sites={sites}
                                    style={selectStyles.selectCompare}
                                    value={selectedSitesId}
                                />
                                <components.DateCompare
                                    allowedValues={parameters.getDateCompare()}
                                    getKey={R.prop("key")}
                                    getLabel={R.prop("label")}
                                    onChange={this.props.selectDateRangesCompare}
                                    period={this.props.chart[0].date.period}
                                />
                            </components.Compare>
                        </components.TutorialAnchor>
                    </span>
                </bootstrap.Col>
                <bootstrap.Col className="modal-container" sm={12}>
                    <components.TutorialAnchor
                        message={ENVIRONMENT === "cordova" ? tutorialString.appGraph : tutorialString.webGraph}
                        order={7}
                        position="top"
                        ref="graph"
                    >
                        <components.HistoricalGraph
                            chart={this.props.chart}
                            getY2Label={CollectionUtils.labelGraph.getY2Label}
                            getYLabel={CollectionUtils.labelGraph.getYLabel}
                            isComparationActive={this.isDateCompare() || selectedSitesId.length > 1}
                            isDateCompareActive={this.isDateCompare()}
                            misure={this.props.collections.get("readings-daily-aggregates") || Immutable.Map()}
                            ref="historicalGraph"
                            resetCompare={this.props.removeAllCompare}
                            sites={selectedSites}
                        />
                    </components.TutorialAnchor>
                </bootstrap.Col>
                <bootstrap.Col sm={12}>
                    <components.ConsumptionButtons
                        allowedValues={variables}
                        onChange={consumptionTypes => this.onChangeConsumption(null, consumptionTypes)}
                        selectedValue={selectedConsumptionType}
                        style={{width: "100%"}}
                        styleButton={consumptionButtonStyle(this.getTheme())}
                        styleButtonSelected={consumptionButtonSelectedStyle(this.getTheme())}
                        styleIcon={{position: "absolute", left: "2px", top: "2px", height: "90%"}}
                    />
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
