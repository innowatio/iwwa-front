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
import {getTitleForSingleSensor, getStringPeriod, getSensorName} from "lib/page-header-utils";

const selectStyles = {
    selectCompare: {
        width: "450px",
        height: "35px",
        display: "inline-block"
    }
};

const measurementTypeButtonStyle = (theme) => R.merge(styles(theme).buttonSelectChart, {
    minWidth: "132px",
    height: "45px",
    fontSize: "15px",
    margin: "0 0 0 10px",
    padding: "0"
});

const sourceButtonStyle = (theme) => R.merge(styles(theme).buttonSelectChart, {
    minWidth: "85px",
    height: "30px"
});

const consumptionButtonStyle = ({colors}) => ({
    color: colors.greySubTitle,
    textAlign: "center",
    marginRight: "10px !important",
    padding: "0",
    verticalAlign: "middle",
    borderRadius: "22px",
    width: "45px",
    height: "45px",
    transition: "width 0.4s ease-in-out",
    border: "none"
});

const consumptionButtonSelectedStyle = ({colors}) => ({
    color: colors.white,
    backgroundColor: colors.consumption,
    borderRadius: "22px",
    verticalAlign: "middle",
    width: "160px",
    height: "45px",
    transition: "width 0.4s ease-in-out"
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
                return parameters.getConsumptions(this.getTheme()).filter(consumption => {
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
            this.props.selectSingleElectricalSensor(this.state.value || chart[0].fullPath);
            break;
        case "dateFilter":
            this.props.selectDateRanges(
                this.state.value || (chart[0].date.type === "dateFilter" && chart[0].date) || {
                    start: moment().startOf("month").valueOf(),
                    end: moment().endOf("month").valueOf(),
                    valueType: {label: "calendario", key: "calendar"}
                }
            );
            break;
        case "siteCompare":
            this.props.selectMultipleElectricalSensor(this.state.value);
            break;
        }
        return this.closeModal();
    },
    onChangeWidgetValue: function (value) {
        this.setState({value});
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
    renderChildComponent: function () {
        switch (this.state.selectedWidget) {
        case "siteNavigator":
            return this.renderSiteNavigator();
        case "dateFilter":
            return this.renderDateFilter();
        case "siteCompare":
            return this.renderSiteCompare();
        }
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
    renderExportButton: function () {
        return (
            <div>
                <components.TutorialAnchor
                    message={tutorialString.export}
                    order={2}
                    position="right"
                    ref="export"
                >
                    <components.Popover
                        arrowColor={this.getTheme().colors.white}
                        hideOnChange={true}
                        title={
                            <components.Icon
                                color={this.getTheme().colors.iconDropdown}
                                icon={"export"}
                                size={"28px"}
                                style={{lineHeight: "20px", verticalAlign: "middle"}}
                            />
                        }
                        tooltipId="tooltipExport"
                        tooltipMessage="Esporta"
                        tooltipPosition="left"
                    >
                        <components.DropdownButton
                            allowedValues={parameters.getExportType()}
                            getColor={R.prop("color")}
                            getIcon={R.prop("iconClass")}
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
            <div>
                <div style={styles(this.getTheme()).titlePage}>
                    <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "16px", width: "100%"}}>
                        {this.getTitleForChart().toUpperCase()}
                    </div>
                    <components.Button style={alarmButtonStyle(this.getTheme())}>
                        <components.Icon
                            color={this.getTheme().colors.iconHeader}
                            icon={"danger"}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </components.Button>

                    <components.Popover
                        className="pull-right"
                        hideOnChange={true}
                        style={styles(this.getTheme()).chartPopover}
                        title={
                            <components.Icon
                                color={this.getTheme().colors.iconHeader}
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
                            style={styles(this.getTheme()).chartDropdownButton}
                        />
                    </components.Popover>
                </div>
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
                        color={this.getTheme().colors.iconArrowSwitch}
                        icon={"arrow-left"}
                        size={"34px"}
                        style={{lineHeight: "20px"}}
                    />
                </components.Button>
                <div style={styles(this.getTheme()).mainDivStyle}>
                    <bootstrap.Col sm={12} style={styles(this.getTheme()).colVerticalPadding}>
                        <components.FullscreenModal
                            onConfirm={this.onConfirmFullscreenModal}
                            onHide={this.closeModal}
                            onReset={this.closeModal}
                            show={this.state.showFullscreenModal}
                        >
                            {this.renderChildComponent()}
                        </components.FullscreenModal>
                        <span className="pull-left" style={{display: "flex"}}>
                            {ENVIRONMENT === "cordova" ? null : this.renderExportButton()}
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
                        <span className="pull-right" style={{display: "flex"}}>
                            <components.TutorialAnchor
                                message={tutorialString.valori}
                                order={1}
                                position="right"
                                ref="valori"
                            >
                                <components.ButtonGroupSelect
                                    allowedValues={parameters.getSources(this.getTheme())}
                                    getKey={R.prop("key")}
                                    getLabel={R.prop("label")}
                                    multi={valoriMulti}
                                    onChange={this.props.selectSource}
                                    onChangeMulti={this.onChangeMultiSources}
                                    style={sourceButtonStyle(this.getTheme())}
                                    styleToMergeWhenActiveState={{background: this.getTheme().colors.buttonPrimary, border: "0px none"}}
                                    value={selectedSources}
                                />
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
                                isComparationActive={this.isComparationActive(selectedSitesId, selectedSources)}
                                isDateCompareActive={this.isDateCompare()}
                                misure={this.props.collections.get("readings-daily-aggregates") || Immutable.Map()}
                                ref="historicalGraph"
                                resetCompare={this.props.removeAllCompare}
                                sites={selectedSites}
                            />
                        </components.TutorialAnchor>
                    </bootstrap.Col>
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
                            <components.TutorialAnchor
                                message={tutorialString.tipologie}
                                order={3}
                                position="left"
                                ref="tipologie"
                            >
                                <components.ButtonGroupSelect
                                    allowedValues={parameters.getMeasurementTypes()}
                                    getKey={R.prop("key")}
                                    getLabel={R.prop("label")}
                                    onChange={this.props.selectElectricalType}
                                    style={measurementTypeButtonStyle(this.getTheme())}
                                    styleToMergeWhenActiveState={{background: this.getTheme().colors.buttonPrimary, border: "0px none"}}
                                    value={[this.props.chart[0].measurementType]}
                                />
                            </components.TutorialAnchor>
                        </span>
                    </bootstrap.Col>
                </div>
                <components.Button style={R.merge(dateButtonStyle(this.getTheme()), {borderRadius: "20px 0 0 20px", right: "0px", padding: "0"})}>
                    <components.Icon
                        color={this.getTheme().colors.iconArrowSwitch}
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
