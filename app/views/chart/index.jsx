var Immutable  = require("immutable");
var R          = require("ramda");
var React      = require("react");
var bootstrap  = require("react-bootstrap");
var IPropTypes = require("react-immutable-proptypes");
import moment from "moment";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    Button,
    ButtonGroupSelect,
    ConfirmModal,
    ConsumptionButtons,
    DateFilter,
    DateCompare,
    DropdownButton,
    Export,
    FullscreenModal,
    HistoricalGraph,
    Icon,
    Popover,
    SiteNavigator,
    Spacer
} from "components";
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
    removeAllCompare,
    resetZoom,
    setZoomExtremes,
    toggleAlarms
} from "actions/chart";
import {styles} from "lib/styles";
import {defaultTheme} from "lib/theme";
import {getTitleForSingleSensor, getStringPeriod, getSensorName} from "lib/page-header-utils";
import mergeSiteSensors from "lib/merge-site-sensors";

const measurementTypeButtonStyle = (theme) => R.merge(styles(theme).buttonSelectChart, {
    minWidth: "132px",
    height: "45px",
    fontSize: "15px",
    fontWeight: "300",
    margin: "0 0 0 10px",
    padding: "0px"
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
    padding: "0px",
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
    backgroundColor: colors.primary,
    border: "0px none",
    height: "35px",
    width: "auto",
    position: "absolute",
    top: "50%"
});

const alarmButtonStyle = ({colors}, isActive) => ({
    backgroundColor: isActive ? colors.backgroundChartSelectedButton : colors.backgroundDanger,
    border: "0px none",
    borderRadius: "100%",
    height: "50px",
    margin: "auto",
    width: "50px"
});

var Chart = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        chartState: React.PropTypes.shape({
            alarms: React.PropTypes.object,
            charts: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
            zoom: React.PropTypes.arrayOf(React.PropTypes.object)
        }).isRequired,
        collections: IPropTypes.map.isRequired,
        localStorage: React.PropTypes.object,
        location: React.PropTypes.object.isRequired,
        removeAllCompare: React.PropTypes.func.isRequired,
        resetZoom: React.PropTypes.func.isRequired,
        selectDateRanges: React.PropTypes.func.isRequired,
        selectDateRangesCompare: React.PropTypes.func.isRequired,
        selectElectricalType: React.PropTypes.func.isRequired,
        selectEnvironmentalSensor: React.PropTypes.func.isRequired,
        selectMultipleElectricalSensor: React.PropTypes.func.isRequired,
        selectSingleElectricalSensor: React.PropTypes.func.isRequired,
        selectSource: React.PropTypes.func.isRequired,
        setZoomExtremes: React.PropTypes.func.isRequired,
        toggleAlarms: React.PropTypes.func.isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
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
        this.props.asteroid.subscribe("alarms");
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
    closeFullscreenModal: function () {
        this.setState({
            showFullscreenModal: false,
            selectedWidget: null,
            value: undefined
        });
    },
    closeModals: function () {
        this.setState({
            showConfirmModal: false,
            showFullscreenModal: false
        });
    },
    updateFirstSiteToChart: function () {
        var sites = this.props.collections.get("sites") || Immutable.Map();
        if (sites.size > 0 && !this.props.chartState.charts[0].sensorId) {
            const firstSite = sites.first();
            this.props.selectSingleElectricalSensor([firstSite.get("_id")]);
        }
    },
    openDownloadLink: function (content, name) {
        var encodedUri = encodeURI(content);
        var link = document.createElement("a");
        link.setAttribute("id", "csvDownload");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", name);
        link.setAttribute("target", "_blank");
        document.body.appendChild(link); //Required for Firefox
        link.click();
    },
    exportPng: function () {
        const exportAPILocation = this.refs.historicalGraph.refs.graphType.refs.highcharts.refs.chart;
        const chart = exportAPILocation.getChart();
        chart.exportChart();
    },

    exportCsv: function (exportStart, exportEnd) {
        const sensorId = this.props.chartState.charts[0].sensorId;
        var csvData = "";
        this.props.asteroid.call("getDailyAggregatesByRange", sensorId, exportStart, exportEnd).then(value => {
            value.forEach(child => {
                var times = child.measurementTimes.split(",");
                var values = child.measurementValues.split(",");
                for (var x=0; x < times.length; x++) {
                    var date = moment(Number(times[x])).toISOString();
                    csvData = csvData + child.sensorId + ";" + child.measurementType + ";" + date + ";" + values[x] +"\n";
                }
            });
            const dataTypePrefix = "data:text/csv;base64,";
            this.openDownloadLink(dataTypePrefix + window.btoa(csvData), "chart.csv");
        });
        /*
        Export chart in CSV
        const exportAPILocation = this.refs.historicalGraph.refs.graphType.refs.highcharts.refs.chart;
        const chart = exportAPILocation.getChart();
        const csvData = chart.getCSV();
        console.log(csvData);
        const dataTypePrefix = "data:text/csv;base64,";
        this.openDownloadLink(dataTypePrefix + window.btoa(csvData), "chart.csv");
        */
    },

    subscribeToMisure: function (props) {
        const chartFilter = props.chartState.charts;
        const dateFirstChartState = chartFilter[0].date;
        var dateStart;
        var dateEnd;
        // Query for date-compare
        if (dateFirstChartState.type === "dateCompare") {
            const dateSecondChartState = chartFilter[1].date;
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
        const sensors = chartFilter.map(singleSelection => singleSelection.sensorId);
        const measurementTypes = chartFilter.map(singleSelection => singleSelection.measurementType.key);
        const sources = chartFilter.map(singleSelection => singleSelection.source.key);
        sensors[0] && sensors.forEach((sensorId, idx) => {
            props.asteroid.subscribe(
                "dailyMeasuresBySensor",
                sensorId,
                R.is(Array, dateStart) ? dateStart[idx] : dateStart,
                R.is(Array, dateEnd) ? dateEnd[idx] : dateEnd,
                sources[idx],
                measurementTypes[idx]
            );

            props.asteroid.subscribe(
                "alarmsAggregates",
                measurementTypes[idx],
                R.is(Array, dateStart) ? dateStart[idx] : dateStart,
                R.is(Array, dateEnd) ? dateEnd[idx] : dateEnd
            );
        });
    },
    getAlarmsData: function () {
        const {charts} = this.props.chartState;
        const site = charts[0] ? charts[0].sensorId : null;
        const measurementType = charts[0] ? charts[0].measurementType : null;
        const {start, end} = charts[0].date;
        const alarmsUser = this.props.collections.get("alarms");
        const alarmsAggregates = this.props.collections.get("alarms-aggregates");

        const {alarms} = this.props.chartState;

        if (charts && alarms.show && site && measurementType && alarmsUser && alarmsAggregates) {

            const decoratedAggregates = alarmsAggregates.map(aggregate => {
                const siteAlarms = alarmsUser.find(x => x.get("_id") === aggregate.get("alarmId"));
                const decorated = {
                    ...siteAlarms.toJS(),
                    ...aggregate.toJS()
                };
                return decorated;
            }).toArray();

            const filteredSensors = decoratedAggregates
                .filter(x => x.sensorId === site)
                .filter(x => x.measurementType === measurementType.key)
                .filter(x => start <= moment.utc(x.date).valueOf() && moment.utc(x.date).valueOf() <= end);

            return filteredSensors;
        }
        return [];
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
    getSortedAndDecoratedSites: function () {
        const sites = this.props.collections.get("sites") || Immutable.Map();
        const sensors = this.props.collections.get("sensors") || Immutable.Map();

        return sites
            .map((value) => Immutable.fromJS(mergeSiteSensors(value, sensors)))
            .sortBy(site => site.get("name"));
    },
    getConsumptionVariablesFromFullPath: function (fullPath) {
        if (R.isArrayLike(fullPath) && fullPath.length > 0) {
            // All sensors under a site
            const site = this.getSitoById(fullPath[0]);
            if (site) {
                const sensors = site.get("sensorsIds").map(sensorId => {
                    const sensorObject = this.getSensorById(sensorId);
                    if (sensorObject) {
                        return sensorObject;
                    }
                }).filter(sensor => {
                    return !R.isNil(sensor);
                });
                var sensorsButtonList = consumptionSensors(this.getTheme()).map(button => {
                    const sensorsButton = sensors.filter(x => {
                        return R.contains(button.key, x.get("measurementTypes") || []);
                    });
                    return {
                        ...button,
                        sensors: sensorsButton.toJS()
                    };
                });
                return sensorsButtonList.filter(x => x.sensors.length > 0);
            }
        }
        return [];
    },
    firstSensorOfConsumptionInTheSite: function (consumptionTypes) {
        const site = this.getSitoById(this.props.chartState.charts[0].site);
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
    changeDateRanges: function (goForward) {
        this.props.resetZoom();
        const {date} = this.props.chartState.charts[0];
        var number = goForward ? 1 : -1;
        var diff = Math.round(moment.duration(date.end - date.start).asDays());
        var dateRange = {};
        switch (diff) {
            case 1:
                dateRange.end = moment.utc(date.end).add({
                    days: number
                }).valueOf();
                dateRange.start = moment.utc(date.start).add({
                    days: number
                }).valueOf();
                break;
            case 7:
                dateRange.end = moment.utc(date.end).add({
                    weeks: number
                }).valueOf();
                dateRange.start = moment.utc(date.start).add({
                    weeks: number
                }).valueOf();
                break;
            default:
                dateRange.end = moment.utc(date.end).add({
                    months: number
                }).valueOf();
                dateRange.start = moment.utc(date.start).add({
                    months: number
                }).valueOf();
                break;
        }
        switch (date.type) {
            case "dateFilter":
                this.props.selectDateRanges({
                    ...date,
                    end: dateRange.end,
                    start: dateRange.start,
                    valueType: {}
                });
                break;
            case "dateCompare":
                this.props.selectDateRangesCompare({
                    ...date,
                    dateOne: dateRange.start
                });
                break;
            default:
        }
    },
    handleClickLeft: function () {
        this.changeDateRanges(false);
    },
    handleClickRight: function () {
        this.changeDateRanges(true);
    },
    onChangeConsumption: function (sensorId, consumptionTypes) {
        this.props.selectEnvironmentalSensor([sensorId], [consumptionTypes]);
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
        return this.props.chartState.charts[0].date.type === "dateCompare";
    },
    allUniq: function (list) {
        return R.equals(list, R.uniq(list));
    },
    isComparationActive: function () {
        const selectedSitesId = this.selectedSitesId();
        const selectedSources = this.selectedSources();
        return (
            this.isDateCompare() ||
            selectedSitesId.length > 1 ||
            (
                this.props.chartState.charts.length >= 2 &&
                !this.allUniq(this.props.chartState.charts.map(singleSelection => singleSelection.measurementType)) &&
                R.uniq(selectedSources).length === 1
            )
        );
    },
    getTitleForChart: function () {
        const chartFilter = this.props.chartState.charts;
        if (chartFilter.length === 1) {
            // Selezione sito-pod-sensor:
            // NameSito (· NamePod/Sensor )· Period
            return [
                getTitleForSingleSensor(chartFilter[0], this.props.collections),
                getStringPeriod(chartFilter[0].date)
            ].join(" · ");
        } else if (chartFilter.length > 1) {
            // Comparazione per data (su sito pod o sensor):
            // NameSito (· NamePod/Sensor )· Period1 & Period2
            if (
                !R.isEmpty(chartFilter[0].date.period) &&
                chartFilter[0].date !== chartFilter[1].date &&
                R.equals(chartFilter[0].fullPath, chartFilter[1].fullPath)
            ) {
                return [
                    getTitleForSingleSensor(chartFilter[0], this.props.collections),
                    getStringPeriod(chartFilter[0].date)
                ].join(" · ");
            } else if (chartFilter[0].site === chartFilter[1].site) {
                // Compara energia con variabile:
                // NameSito (· NamePod/Sensor )· measureType & variableType
                return [
                    getTitleForSingleSensor(chartFilter[0], this.props.collections),
                    getSensorName(chartFilter[1].sensorId, this.props.collections)
                ].join(" & ") + ` · ${getStringPeriod(chartFilter[0].date)}`;
            // Comparazione siti:
            // NameSito1 & NameSito2
            } else if (chartFilter[0].fullPath !== chartFilter[1].fullPath) {
                return [
                    getTitleForSingleSensor(chartFilter[0], this.props.collections),
                    getTitleForSingleSensor(chartFilter[1], this.props.collections)
                ].join(" & ") + ` · ${getStringPeriod(chartFilter[0].date)}`;
            }
        }
    },
    onChangeWidget: function ({key}) {
        this.setState({
            showFullscreenModal: true,
            selectedWidget: key,
            value: undefined
        });
    },
    onConfirmFullscreenModal: function () {
        const chartFilter = this.props.chartState.charts;
        switch (this.state.selectedWidget) {
            case "siteNavigator":
                // Set the default value to pass.
                this.props.selectSingleElectricalSensor(this.state.value || chartFilter[0].fullPath);
                break;
            case "dateFilter":
                this.props.selectDateRanges(
                    this.state.value || (chartFilter[0].date.type === "dateFilter" && chartFilter[0].date)
                );
                this.props.resetZoom();
                break;
            case "siteCompare":
                this.props.selectMultipleElectricalSensor(
                    this.state.value ||
                    // Set the default value to pass.
                    (chartFilter[1] && chartFilter[1].fullPath)
                );
                break;
            case "dateCompare":
                this.props.selectDateRangesCompare(
                    this.state.value ||
                    (chartFilter[0].date.type === "dateCompare" &&  {
                        period: chartFilter[0].date.period,
                        dateOne: moment.utc().valueOf()
                    }) || {
                        // Set the default value to pass.
                        period: parameters.getDateCompare()[0],
                        dateOne: moment.utc().valueOf()
                    }
                );
                this.props.resetZoom();
                break;
        }
        this.setState({showConfirmModal: true});
    },
    onChangeWidgetValue: function (value) {
        this.setState({value});
    },
    selectedSitesId: function () {
        return R.uniq(this.props.chartState.charts.map(singleSelection => singleSelection.site));
    },
    selectedSources: function () {
        return this.props.chartState.charts.map(singleSelection => singleSelection.source);
    },
    getModalTitle: function () {
        switch (this.state.selectedWidget) {
            case "siteNavigator":
                return "HAI SCELTO DI VISUALIZZARE";
            case "dateFilter":
                return "HAI SCELTO DI VISUALIZZARE I CONSUMI RELATIVI AL MESE DI";
            case "siteCompare":
                return "HAI SCELTO DI CONFRONTARE";
            case "dateCompare":
                return "HAI SCELTO DI CONFRONTARE IL PERIODO";
        }
    },
    getModalSubtitle: function () {
        const chartFilter = this.props.chartState.charts;
        switch (this.state.selectedWidget) {
            case "siteNavigator":
                return getTitleForSingleSensor(chartFilter[0], this.props.collections);
            case "dateFilter":
                return getStringPeriod(chartFilter[0].date);
            case "siteCompare":
                return (
                    getTitleForSingleSensor(chartFilter[0], this.props.collections)
                    + " CON " +
                    getTitleForSingleSensor(chartFilter[1] || {}, this.props.collections)
                );
            case "dateCompare":
                return (
                    getStringPeriod(chartFilter[0].date)
                );
        }
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
            <DateCompare
                allowedValues={parameters.getDateCompare()}
                getKey={R.prop("key")}
                getLabel={R.prop("label")}
                onChange={this.onChangeWidgetValue}
                period={
                    (this.state.value && this.state.value.period) ||
                    this.props.chartState.charts[0].date.period ||
                    parameters.getDateCompare()[0]
                }
                title={"SELEZIONA IL PERIODO DA CONFRONTARE CON LA SELEZIONE ATTIVA"}
            />
        );
    },
    renderSiteCompare: function () {
        const chartFilter = this.props.chartState.charts;
        return (
            <SiteNavigator
                allowedValues={this.getSortedAndDecoratedSites()}
                onChange={this.onChangeWidgetValue}
                path={this.state.value || (chartFilter[1] && chartFilter[1].fullPath) || []}
                title={
                    " QUALE PUNTO DI MISURAZIONE VUOI COMPARARE CON " +
                    getTitleForSingleSensor(chartFilter[0], this.props.collections).toUpperCase() +
                    " ? "
                }
            />
        );
    },
    renderDateFilter: function () {
        const chartFilter = this.props.chartState.charts;
        return (
            <DateFilter
                getKey={R.prop("key")}
                getLabel={R.prop("label")}
                onChange={this.onChangeWidgetValue}
                title={"SELEZIONA IL PERIODO DA VISUALIZZARE"}
                value={
                    this.state.value && this.state.selectedWidget === "dateFilter" ? this.state.value : (
                    chartFilter[0].date.type === "dateFilter" ? chartFilter[0].date : undefined
                )}
            />
        );
    },
    renderSiteNavigator: function () {
        return (
            <SiteNavigator
                allowedValues={this.getSortedAndDecoratedSites()}
                onChange={this.onChangeWidgetValue}
                path={this.state.value || this.props.chartState.charts[0].fullPath || []}
                title={"QUALE PUNTO DI MISURAZIONE VUOI VISUALIZZARE?"}
            />
        );
    },
    renderExport: function () {
        const {start, end} = this.props.chartState.charts[0].date;
        return (
            <Export
                exportStart={start}
                exportEnd={end}
                exportPng={this.exportPng}
                exportCsv={this.exportCsv}
                title={"SELEZIONA IL RANGE E ESPORTA I DATI"}
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
                <Icon
                    color={colors.iconLogout}
                    icon={"logout"}
                    size={"28px"}
                    style={{lineHeight: "20px", paddingRight: "5px"}}
                />
                <Spacer direction="h" size={5} />
                {"Esci dal confronto"}
            </div>
        ) : null;
    },
    renderConfirmModal: function () {
        return (
            <ConfirmModal
                onConfirm={() => this.setState({showConfirmModal: false})}
                onHide={this.closeModals}
                iconType={"flag"}
                renderFooter={true}
                show={this.state.showConfirmModal}
                subtitle={this.getModalSubtitle()}
                title={this.getModalTitle()}
            />
        );
    },
    renderFullscreenModal: function () {
        const theme = this.getTheme();
        return (
            <FullscreenModal
                backgroundColor={
                    this.state.selectedWidget !== "export" ?
                    undefined :
                    theme.colors.backgroundModalExport
                }
                iconCloseColor={
                    this.state.selectedWidget !== "export" ?
                    theme.colors.iconClose :
                    theme.colors.white
                }
                onConfirm={this.onConfirmFullscreenModal}
                onHide={this.closeFullscreenModal}
                onReset={this.closeFullscreenModal}
                renderConfirmButton={
                    this.state.selectedWidget !== "export" && !R.isNil(this.state.selectedWidget)
                }
                show={this.state.showFullscreenModal}
            >
                {this.renderChildComponent()}
            </FullscreenModal>
        );
    },
    render: function () {
        const theme = this.getTheme();
        const selectedSensor = this.props.chartState.charts[1] ? this.props.chartState.charts[1].sensorId : undefined;
        const selectedConsumptionType = (
            this.props.chartState.charts.length > 1 &&
            this.allUniq(this.props.chartState.charts.map(singleSelection => singleSelection.measurementType))
        ) ?
            this.props.chartState.charts[1].measurementType :
            null;
        const valoriMulti = (!this.isDateCompare() && this.selectedSitesId().length < 2 && !selectedConsumptionType);
        const variables = this.getConsumptionVariablesFromFullPath(this.props.chartState.charts[0].fullPath);
        const {alarms} = this.props.chartState;
        return (
            <div>
                <div style={styles(theme).titlePage}>
                    {/* Title Page */}
                    <div style={{fontSize: "18px", marginBottom: "0px", paddingTop: "16px", width: "100%"}}>
                        {this.getTitleForChart().toUpperCase()}
                    </div>
                    <Button style={alarmButtonStyle(theme, alarms.show)}>
                        <Icon
                            color={theme.colors.iconHeader}
                            icon={"danger"}
                            onClick={() => this.props.toggleAlarms()}
                            size={"28px"}
                            style={{lineHeight: "20px"}}
                        />
                    </Button>
                    <Popover
                        className="pull-right"
                        hideOnChange={true}
                        style={{height: "56px", margin: 0}}
                        title={
                            <Icon
                                color={theme.colors.iconOption}
                                icon={"option"}
                                size={"32px"}
                                style={{verticalAlign: "middle"}}
                            />
                        }
                    >
                        <DropdownButton
                            allowedValues={parameters.getChartSetting(this.getTheme())}
                            getColor={R.prop("color")}
                            getHoverColor={R.prop("hoverColor")}
                            getIcon={R.prop("iconClass")}
                            getKey={R.prop("key")}
                            getLabel={R.prop("label")}
                            onChange={this.onChangeWidget}
                            style={styles(theme).chartDropdownButton}
                        />
                    </Popover>
                </div>
                {/* Button Left and Right arrow */}
                <Button
                    style={R.merge(
                        dateButtonStyle(theme), {
                            borderRadius: "0 20px 20px 0",
                            left: "0px",
                            padding: "0px"
                        })
                    }
                >
                    <Icon
                        color={theme.colors.iconArrowSwitch}
                        icon={"arrow-left"}
                        onClick={this.handleClickLeft}
                        size={"34px"}
                        style={{lineHeight: "20px"}}
                    />
                </Button>
                {/* Button top chart */}
                <div style={styles(theme).mainDivStyle}>
                    <bootstrap.Col sm={12} style={styles(theme).colVerticalPadding}>
                        {this.renderChartResetButton()}
                        <span className="pull-right" style={{display: "flex"}}>
                            <ButtonGroupSelect
                                allowedValues={parameters.getSources(theme)}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                multi={valoriMulti}
                                onChange={this.props.selectSource}
                                onChangeMulti={this.onChangeMultiSources}
                                style={sourceButtonStyle(theme)}
                                styleToMergeWhenActiveState={{
                                    background: theme.colors.backgroundChartSelectedButton,
                                    color: theme.colors.textSelectButton,
                                    border: `1px solid ${theme.colors.borderChartSelectedButton}`
                                }}
                                value={this.selectedSources()}
                            />
                        </span>
                    </bootstrap.Col>
                    {/* Chart and widget modal */}
                    <bootstrap.Col className="modal-container" sm={12}>
                        {this.renderFullscreenModal()}
                        {this.renderConfirmModal()}
                        <HistoricalGraph
                            alarmsData={this.getAlarmsData()}
                            chartState={this.props.chartState}
                            isComparationActive={this.isComparationActive()}
                            isDateCompareActive={this.isDateCompare()}
                            misure={this.props.collections.get("readings-daily-aggregates") || Immutable.Map()}
                            ref="historicalGraph"
                            resetZoom={this.props.resetZoom}
                            setZoomExtremes={this.props.setZoomExtremes}
                        />
                    </bootstrap.Col>
                    {/* Button bottom chart */}
                    <bootstrap.Col sm={12}>
                        <span className="pull-left" style={{display: "flex", width: "auto"}}>
                            <ConsumptionButtons
                                allowedValues={variables}
                                onChange={this.onChangeConsumption}
                                resetConsumption={this.props.removeAllCompare}
                                selectedConsumptionValue={selectedConsumptionType}
                                selectedSensorValue={selectedSensor}
                                styleButton={consumptionButtonStyle(theme)}
                                styleButtonSelected={consumptionButtonSelectedStyle(theme)}
                            />
                        </span>
                        <span className="pull-right" style={{display: "flex", paddingTop: "33px"}}>
                            <ButtonGroupSelect
                                allowedValues={parameters.getMeasurementTypes()}
                                getKey={R.prop("key")}
                                getLabel={R.prop("label")}
                                onChange={this.props.selectElectricalType}
                                style={measurementTypeButtonStyle(theme)}
                                styleToMergeWhenActiveState={{
                                    background: theme.colors.backgroundChartSelectedButton,
                                    color: theme.colors.textSelectButton,
                                    border: `1px solid ${theme.colors.borderChartSelectedButton}`
                                }}
                                value={[this.props.chartState.charts[0].measurementType]}
                            />
                        </span>
                    </bootstrap.Col>
                </div>
                <Button
                    style={
                        R.merge(dateButtonStyle(theme),
                        {borderRadius: "20px 0 0 20px", right: "0px", padding: "0px"})
                    }
                >
                    <Icon
                        color={theme.colors.iconArrowSwitch}
                        icon={"arrow-right"}
                        onClick={this.handleClickRight}
                        size={"34px"}
                        style={{lineHeight: "20px"}}
                    />
                </Button>
            </div>
        );
    }
});

function mapStateToProps (state) {
    return {
        collections: state.collections,
        chartState: state.chart
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
        setZoomExtremes: bindActionCreators(setZoomExtremes, dispatch),
        removeAllCompare: bindActionCreators(removeAllCompare, dispatch),
        resetZoom: bindActionCreators(resetZoom, dispatch),
        toggleAlarms: bindActionCreators(toggleAlarms, dispatch)
    };
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Chart);
