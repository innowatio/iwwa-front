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
// var GetTutorialMixin   = require("lib/get-tutorial-mixin");
// var tutorialString     = require("assets/JSON/tutorial-string.json").historicalGraph;
import * as parameters from "./parameters";
import {consumptionSensors} from "lib/sensors-decorators";
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
import {getTitleForSingleSensor, getStringPeriod, getSensorName} from "lib/page-header-utils";

const measurementTypeButtonStyle = (theme) => R.merge(styles(theme).buttonSelectChart, {
    minWidth: "132px",
    height: "45px",
    fontSize: "15px",
    fontWeight: "300",
    margin: "0 0 0 10px",
    padding: "0"
});

const sourceButtonStyle = (theme) => R.merge(styles(theme).buttonSelectChart, {
    minWidth: "85px",
    height: "30px",
    fontWeight: "300"
});

const consumptionButtonStyle = ({colors}) => ({
    color: colors.greySubTitle,
    textAlign: "center",
    marginRight: "15px !important",
    padding: "0",
    verticalAlign: "middle",
    borderRadius: "22px",
    width: "45px",
    height: "45px",
    transition: "width 0.3s ease-in-out",
    border: "none"
});

const consumptionButtonSelectedStyle = ({colors}) => ({
    color: colors.white,
    backgroundColor: colors.consumption,
    borderRadius: "22px",
    verticalAlign: "middle",
    width: "160px",
    height: "45px",
    transition: "width 0.3s ease-in-out"
});

const dateButtonStyle = ({colors}) => ({
    background: colors.primary,
    border: "0px none",
    height: "35px",
    width: "auto",
    position: "absolute",
    top: "50%"
});

const alarmButtonStyle = ({colors}) => ({
    background: colors.titleColor,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px"
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
        // GetTutorialMixin("historicalGraph",
        //     ["valori", "export", "tipologie", "siti", "dateFilter", "compare", "graph"]
        // )
    ],
    getInitialState: function () {
        return {
            showFullscreenModal: false,
            selectedWidget: null,
            value: undefined
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
    closeModal: function () {
        this.setState({
            showFullscreenModal: false,
            selectedWidget: null,
            value: undefined
        });
    },
    updateFirstSiteToChart: function () {
        var sites = this.props.collections.get("sites") || Immutable.Map();
        if (sites.size > 0 && !this.props.chart[0].sensorId) {
            const firstSite = sites.first();
            this.props.selectSingleElectricalSensor([firstSite.get("_id")]);
        }
    },
    exportPng: function () {
        var exportAPILocation = this.refs.historicalGraph.refs.compareGraph.refs.temporalLineGraph;
        exportAPILocation.exportPNG();
    },
    exportCsv: function () {
        var exportAPILocation = this.refs.historicalGraph.refs.compareGraph.refs.temporalLineGraph;
        exportAPILocation.exportCSV();
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
            if (site) {
                const sensorsType = site.get("sensorsIds").map(sensorId => {
                    const sensorObject = this.getSensorById(sensorId);
                    if (sensorObject) {
                        return sensorObject.get("type");
                    }
                });
                return consumptionSensors(this.getTheme()).filter(consumption => {
                    return R.contains(consumption.type, sensorsType);
                });
            }
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
    isComparationActive: function (selectedSitesId, selectedSources) {
        return (
            this.isDateCompare() ||
            selectedSitesId.length > 1 ||
            (
                this.props.chart.length >= 2 &&
                !R.allUniq(this.props.chart.map(singleSelection => singleSelection.measurementType)) &&
                R.uniq(selectedSources).length === 1
            )
        );
    },
    getTitleForChart: function () {
        if (this.props.chart.length === 1) {
            // Selezione sito-pod-sensor:
            // NameSito (· NamePod/Sensor )· Period
            return [
                getTitleForSingleSensor(this.props.chart[0], this.props.collections),
                getStringPeriod(this.props.chart[0].date)
            ].join(" · ");
        } else if (this.props.chart.length > 1) {
            // Comparazione per data (su sito pod o sensor):
            // NameSito (· NamePod/Sensor )· Period1 & Period2
            if (
                !R.isEmpty(this.props.chart[0].date.period) &&
                this.props.chart[0].date !== this.props.chart[1].date &&
                R.equals(this.props.chart[0].fullPath, this.props.chart[1].fullPath)
            ) {
                return [
                    getTitleForSingleSensor(this.props.chart[0], this.props.collections),
                    getStringPeriod(this.props.chart[0].date)
                ].join(" · ");
            } else if (this.props.chart[0].site === this.props.chart[1].site) {
                // Compara energia con variabile:
                // NameSito (· NamePod/Sensor )· measureType & variableType
                return [
                    getTitleForSingleSensor(this.props.chart[0], this.props.collections),
                    getSensorName(this.props.chart[1].sensorId, this.props.collections)
                ].join(" & ") + ` · ${getStringPeriod(this.props.chart[0].date)}`;
            // Comparazione siti:
            // NameSito1 & NameSito2
            } else if (this.props.chart[0].fullPath !== this.props.chart[1].fullPath) {
                return [
                    getTitleForSingleSensor(this.props.chart[0], this.props.collections),
                    getTitleForSingleSensor(this.props.chart[1], this.props.collections)
                ].join(" & ") + ` · ${getStringPeriod(this.props.chart[0].date)}`;
            }
        }
    },
    onChangeWidget: function ({key}) {
        this.setState({
            showFullscreenModal: true,
            selectedWidget: key
        });
    },
    onConfirmFullscreenModal: function () {
        const {chart} = this.props;
        switch (this.state.selectedWidget) {
            case "siteNavigator":
                // Set the default value to pass.
                this.props.selectSingleElectricalSensor(this.state.value || chart[0].fullPath);
                break;
            case "dateFilter":
                this.props.selectDateRanges(
                    // Set the default value to pass.
                    this.state.value || (chart[0].date.type === "dateFilter" && chart[0].date) || {
                        start: moment().startOf("month").valueOf(),
                        end: moment().endOf("month").valueOf(),
                        valueType: {label: "calendario", key: "calendar"}
                    }
                );
                break;
            case "siteCompare":
                this.props.selectMultipleElectricalSensor(
                    this.state.value ||
                    // Set the default value to pass.
                    (this.props.chart[1] && this.props.chart[1].fullPath)
                );
                break;
            case "dateCompare":
                this.props.selectDateRangesCompare(
                    this.state.value ||
                    (this.props.chart[0].date.type === "dateCompare" &&  {
                        period: this.props.chart[0].date.period,
                        dateOne: moment.utc().valueOf()
                    }) || {
                        // Set the default value to pass.
                        period: parameters.getDateCompare()[0],
                        dateOne: moment.utc().valueOf()
                    }
                );
                break;
        }
        return this.closeModal();
    },
    onChangeWidgetValue: function (value) {
        this.setState({value});
    },
    selectedSitesId: function () {
        return R.uniq(this.props.chart.map(singleSelection => singleSelection.site));
    },
    selectedSources: function () {
        return this.props.chart.map(singleSelection => singleSelection.source);
    },
    renderChildComponent: function () {
        switch (this.state.selectedWidget) {
            case "siteNavigator":
                return this.renderSiteNavigator();
            case "dateFilter":
                return this.renderDateFilter();
            case "siteCompare":
                return this.renderSiteCompare();
            case "dateCompare":
                return this.renderDateCompare();
            case "export":
                return this.renderExport();
        }
    },
    renderDateCompare: function () {
        return (
            <components.DateCompare
                allowedValues={parameters.getDateCompare()}
                getKey={R.prop("key")}
                getLabel={R.prop("label")}
                onChange={this.onChangeWidgetValue}
                period={
                    (this.state.value && this.state.value.period) ||
                    this.props.chart[0].date.period ||
                    parameters.getDateCompare()[0]
                }
                title={"SELEZIONA IL PERIODO DA CONFRONTARE CON LA SELEZIONE ATTIVA"}
            />
        );
    },
    renderSiteCompare: function () {
        const sites = this.props.collections.get("sites") || Immutable.Map();
        return (
            <components.SiteNavigator
                allowedValues={sites.sortBy(site => site.get("name"))}
                onChange={this.onChangeWidgetValue}
                path={this.state.value || (this.props.chart[1] && this.props.chart[1].fullPath) || []}
                title={
                    " QUALE PUNTO DI MISURAZIONE VUOI COMPARARE CON " +
                    getTitleForSingleSensor(this.props.chart[0], this.props.collections).toUpperCase() +
                    " ? "
                }
            />
        );
    },
    renderDateFilter: function () {
        return (
            <components.DateFilter
                getKey={R.prop("key")}
                getLabel={R.prop("label")}
                onChange={this.onChangeWidgetValue}
                title={"SELEZIONA IL PERIODO DA VISUALIZZARE"}
                value={
                    this.state.value && this.state.selectedWidget === "dateFilter" ? this.state.value : (
                    this.props.chart[0].date.type === "dateFilter" ? this.props.chart[0].date : undefined
                )}
            />
        );
    },
    renderSiteNavigator: function () {
        const sites = this.props.collections.get("sites") || Immutable.Map();
        return (
            <components.SiteNavigator
                allowedValues={sites.sortBy(site => site.get("name"))}
                onChange={this.onChangeWidgetValue}
                path={this.state.value || this.props.chart[0].fullPath || []}
                title={"QUALE PUNTO DI MISURAZIONE VUOI VISUALIZZARE?"}
            />
        );
    },
    renderExport: function () {
        return (
            <components.Export
                exportPng={this.exportPng}
                exportCsv={this.exportCsv}
                title={"INVIA I DATI VISUALIZZATI VIA EMAIL"}
            />
        );
    },
    renderChartResetButton: function () {
        const {colors} = this.getTheme();
        return this.isComparationActive(this.selectedSitesId(), this.selectedSources()) ? (
            <div
                className="pull-left"
                onClick={this.props.removeAllCompare}
                style={{
                    color: colors.resetCompare,
                    display: "flex",
                    position: "relative",
                    marginLeft: "50px",
                    verticalAlign: "middle",
                    lineHeight: "28px",
                    cursor: "pointer"
                }}
            >
                <components.Icon
                    color={this.getTheme().colors.iconLogout}
                    icon={"logout"}
                    size={"28px"}
                    style={{lineHeight: "20px", paddingRight: "5px"}}
                />
                <components.Spacer direction="h" size={5} />
                {"Esci dal confronto"}
            </div>
        ) : null;
    },
    render: function () {
        const theme = this.getTheme();
        const selectedSites = this.selectedSitesId().map(siteId => this.getSitoById(siteId));
        const selectedConsumptionType = (
            this.props.chart.length > 1 &&
            R.allUniq(this.props.chart.map(singleSelection => singleSelection.measurementType))
        ) ?
            this.props.chart[1].measurementType :
            null;
        const valoriMulti = (!this.isDateCompare() && this.selectedSitesId().length < 2 && !selectedConsumptionType);
        const variables = this.getConsumptionVariablesFromFullPath(this.props.chart[0].fullPath);
        return (
            <div>
                <div style={styles(this.getTheme()).titlePage}>
                    {/* Title Page */}
                    <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "16px", width: "100%"}}>
                        {this.getTitleForChart().toUpperCase()}
                    </div>
                    <components.Button style={alarmButtonStyle(this.getTheme())}>
                        <components.Icon
                            color={theme.colors.iconHeader}
                            icon={"danger"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </components.Button>
                    <components.Popover
                        className="pull-right"
                        hideOnChange={true}
                        style={styles(theme).chartPopover}
                        title={
                            <components.Icon
                                color={theme.colors.iconHeader}
                                icon={"settings"}
                                size={"32px"}
                                style={{lineHeight: "20px", verticalAlign: "middle"}}
                            />
                        }
                    >
                        <components.DropdownButton
                            allowedValues={parameters.getChartSetting(this.getTheme())}
                            getColor={R.prop("color")}
                            getIcon={R.prop("iconClass")}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            onChange={this.onChangeWidget}
                            style={styles(theme).chartDropdownButton}
                        />
                    </components.Popover>
                </div>
                {/* Button Left and Right arrow */}
                <components.Button
                    style={R.merge(dateButtonStyle(
                        this.getTheme()), {
                            borderRadius: "0 20px 20px 0",
                            left: "0px",
                            padding: "0"
                        })
                    }
                >
                    <components.Icon
                        color={theme.colors.iconArrowSwitch}
                        icon={"arrow-left"}
                        size={"34px"}
                        style={{lineHeight: "20px"}}
                    />
                </components.Button>
                {/* Button top chart */}
                <div style={styles(theme).mainDivStyle}>
                    <bootstrap.Col sm={12} style={styles(theme).colVerticalPadding}>
                        {this.renderChartResetButton()}
                        <span className="pull-right" style={{display: "flex"}}>
                            <components.ButtonGroupSelect
                                allowedValues={parameters.getSources(this.getTheme())}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                multi={valoriMulti}
                                onChange={this.props.selectSource}
                                onChangeMulti={this.onChangeMultiSources}
                                style={sourceButtonStyle(this.getTheme())}
                                styleToMergeWhenActiveState={{
                                    background: this.getTheme().colors.buttonPrimary,
                                    border: "0px none"
                                }}
                                value={this.selectedSources()}
                            />
                        </span>
                    </bootstrap.Col>
                    {/* Chart and widget modal */}
                    <bootstrap.Col className="modal-container" sm={12}>
                        <components.FullscreenModal
                            backgroundColor={
                                this.state.selectedWidget !== "export" ?
                                undefined :
                                theme.colors.backgroundModalExport
                            }
                            onConfirm={this.onConfirmFullscreenModal}
                            onHide={this.closeModal}
                            onReset={this.closeModal}
                            renderConfirmButton={this.state.selectedWidget !== "export" && !R.isNil(this.state.selectedWidget)}
                            show={this.state.showFullscreenModal}
                        >
                            {this.renderChildComponent()}
                        </components.FullscreenModal>
                        <components.HistoricalGraph
                            chart={this.props.chart}
                            getY2Label={CollectionUtils.labelGraph.getY2Label}
                            getYLabel={CollectionUtils.labelGraph.getYLabel}
                            isComparationActive={this.isComparationActive(this.selectedSitesId(), this.selectedSources())}
                            isDateCompareActive={this.isDateCompare()}
                            misure={this.props.collections.get("readings-daily-aggregates") || Immutable.Map()}
                            ref="historicalGraph"
                            sites={selectedSites}
                        />
                    </bootstrap.Col>
                    {/* Button bottom chart */}
                    <bootstrap.Col sm={12}>
                        <span className="pull-left" style={{display: "flex", width: "auto"}}>
                            <components.ConsumptionButtons
                                allowedValues={variables}
                                onChange={consumptionTypes => this.onChangeConsumption(null, consumptionTypes)}
                                selectedValue={selectedConsumptionType}
                                styleButton={consumptionButtonStyle(this.getTheme())}
                                styleButtonSelected={consumptionButtonSelectedStyle(this.getTheme())}
                            />
                        </span>
                        <span className="pull-right" style={{display: "flex"}}>
                            <components.ButtonGroupSelect
                                allowedValues={parameters.getMeasurementTypes()}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                onChange={this.props.selectElectricalType}
                                style={measurementTypeButtonStyle(this.getTheme())}
                                styleToMergeWhenActiveState={{
                                    background: theme.colors.buttonPrimary,
                                    border: "0px none",
                                    fontWeight: "300"
                                }}
                                value={[this.props.chart[0].measurementType]}
                            />
                        </span>
                    </bootstrap.Col>
                </div>
                <components.Button
                    style={
                        R.merge(dateButtonStyle(this.getTheme()),
                        {borderRadius: "20px 0 0 20px", right: "0px", padding: "0"})
                    }
                >
                    <components.Icon
                        color={theme.colors.iconArrowSwitch}
                        icon={"arrow-right"}
                        size={"34px"}
                        style={{lineHeight: "20px"}}
                    />
                </components.Button>
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
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
