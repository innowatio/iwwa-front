import Immutable  from "immutable";
import get from "lodash.get";
import Radium from "radium";
import R from "ramda";
import React from "react";
import * as bootstrap from "react-bootstrap";
import {connect} from "react-redux";
import {Link} from "react-router";
import {bindActionCreators} from "redux";

import {selectSingleElectricalSensor, selectMultipleElectricalSensor} from "actions/chart";

import {defaultTheme} from "lib/theme";
import moment from "lib/moment";
import {multisiteDefaultFilter} from "lib/multi-site-default-filter";

import {
    AlarmsRecap,
    Button,
    ButtonSortBy,
    DashboardBox,
    DashboardGoogleMap,
    FullscreenModal,
    Icon,
    InputFilter,
    MultiSiteFilter,
    SiteStatus,
    SiteRecap,
    TooltipIconButton,
    TrendStatus
} from "components";


const styles = ({colors}) => ({
    pageContent: {
        position: "relative",
        display: "block",
        color: colors.white,
        padding: "10px",
        textAlign: "center"
    },
    rowDataWrp: {
        marginRight: "-10px",
        marginLeft: "-10px"
    },
    dataWrp:{
        minHeight: "200px",
        height: "auto",
        padding: "5px 10px",
        backgroundColor: colors.secondary,
        color: colors.white,
        marginBottom: "10px"
    },
    emptyBoxWrp:{
        minHeight: "200px",
        height: "auto",
        backgroundColor: colors.backgroundBoxMultisite,
        border: `1px solid ${colors.borderBoxMultisite}`,
        marginBottom: "10px"
    },
    colItemWrp: {
        height: "auto",
        paddingRight: "10px",
        paddingLeft: "10px"
    },
    searchTools: {
        width: "100%",
        borderTop: `1px solid ${colors.borderBoxMultisite}`,
        borderBottom: `1px solid ${colors.borderBoxMultisite}`,
        backgroundColor: colors.backgroundBoxMultisite,
        marginBottom: "20px"
    },
    buttonCompare: {
        display: "block",
        float: "right",
        borderRadius: "100%",
        width: "50px",
        height: "50px",
        margin: "5px 10px",
        border: "0"
    },
    boxTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px",
        fontWeight: "300"
    },
    sidebarLegend: {
        textAlign: "left",
        padding: "15px 20px",
        borderBottom: `1px solid ${colors.borderBoxMultisite}`,
        borderRight: `1px solid ${colors.borderBoxMultisite}`,
        borderLeft: `1px solid ${colors.borderBoxMultisite}`,
        backgroundColor: colors.backgroundBoxMultisite
    },
    legendTitleWrp: {
        padding: "0px",
        borderRadius: "0px",
        textAlign: "left",
        cursor: "pointer",
        border: `1px solid ${colors.borderBoxMultisite}`,
        backgroundColor: colors.backgroundBoxMultisite
    },
    legendTitle: {
        display: "block",
        width: "100%",
        padding: "15px 20px",
        fontSize: "20px",
        lineHeight: "20px",
        fontWeight: "300",
        color: colors.mainFontColor
    },
    sidebarTips: {
        textAlign: "left",
        padding: "15px 20px",
        marginBottom: "20px",
        border: `2px dashed ${colors.buttonPrimary}`,
        backgroundColor: colors.transparent,
        borderRadius: "0px !important",
        color: colors.mainFontColor
    },
    alertCloseButton: {
        textShadow: "0 1px 0 " + colors.transparent,
        opacity: 1,
        fontSize: "30px",
        marginRight: "20px",
        color: colors.white,
        fontWeight: "200 !important"
    },
    suggestionCloseButton: {
        color: colors.mainFontColor
    },
    tipsTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px",
        fontWeight: "300"
    },
    iconTips: {
        lineHeight: "20px",
        verticalAlign: "middle"
    },
    iconArrowDown: {
        position: "absolute",
        right: "15px",
        top: "18px",
        transform: open ? null : "rotate(180deg)"
    },
    titleButtonPopover: {
        display: "inline-block",
        position: "relative",
        top: "-115px",
        float: "left",
        width: "50px",
        height: "50px",
        margin: "5px 10px",
        borderRadius: "100%",
        lineHeight: "4",
        backgroundColor: colors.secondary
    },
    textAlert: {
        textTransform: "uppercase",
        padding: "20px 0px",
        textAlign: "center",
        color: colors.white,
        margin: "0px",
        fontSize: "26px",
        fontWeight: "300"
    },
    iconStatusStyle: {
        width: "38px",
        height: "38px",
        lineHeight: "44px",
        borderRadius: "100%",
        backgroundColor: colors.backgroundIconStatus
    }
});

const multisiteButtonSortBy = [{
    title: "Visualizza in ordine di:",
    sortBy: [
        {label: "Pod", key: "pod"},
        {label: "Id", key: "_id"},
        {label: "Provincia", key: "province"},
        {label: "Data ultimo aggiornamento", key: "aggiornamento"},
        {label: "Piani", key: "piani"},
        {label: "Vetrine", key: "vetrine"},
        {label: "mq Comm", key: "mq"},
        {label: "mq PdV", key: "mq1"}
    ],
    key: "sortBy"
}];

var MultiSite = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: React.PropTypes.any,
        multisite: React.PropTypes.object,
        selectMultipleElectricalSensor: React.PropTypes.func.isRequired,
        selectSingleElectricalSensor: React.PropTypes.func.isRequired
    },
    contextTypes: {
        theme: React.PropTypes.object
    },

    getInitialState: function () {
        return {
            compareMode: false,
            legendIsOpen: false,
            maxItems: 10,
            openPanel: "",
            reverseSort: false,
            search: "",
            selectedSites: [],
            showMapModal: false,
            showCompareMessage: false,
            showTipsMessage: true,
            sortBy: "_id"
        };
    },

    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
        this.props.asteroid.subscribe("filters");
        this.props.asteroid.subscribe("dashboardAlarms");
        this.props.asteroid.subscribe("dashboardAlarmsAggregates");
        this.props.asteroid.subscribe("dashboardDailyMeasurements");
        this.props.asteroid.subscribe("dashboardRealtimeAggregates");
        this.props.asteroid.subscribe("dashboardYearlyConsumptions");
    },

    componentWillReceiveProps: function () {
        this.getFilters();
    },

    shouldComponentUpdate: function (nextProps, nextState) {

        if (!R.equals(this.state, nextState)) {
            return true;
        }

        if (!R.equals(this.props.collections.get("sites"), nextProps.collections.get("sites"))) {
            return true;
        }

        if (!R.equals(this.props.collections.get("filters"), nextProps.collections.get("filters"))) {
            return true;
        }

        if (!R.equals(this.props.collections.get("alarms-aggregates"), nextProps.collections.get("alarms-aggregates"))) {
            return true;
        }

        if (!R.equals(this.props.collections.get("alarms"), nextProps.collections.get("alarms"))) {
            return true;
        }

        return false;
    },

    getSites: function () {
        return this.props.collections.get("sites") || Immutable.Map();
    },

    getTheme: function () {
        return this.context.theme || defaultTheme;
    },

    getSiteInfo: function () {
        return [
            {label: "ID", key: "_id"},
            {label: "Impiegati", key: "employees"},
            {label: "Tipologia attività", key: "businessType"},
            {label: "Area mq", key: "areaInMq"},
            {label: "Potenza contrattuale", key: "contractualPower"},
            {label: "Stato", key: "country"},
            {label: "Indirizzo", key: "address"},
            {label: "Provincia", key: "province"},
            {label: "Location", key: "city"}
        ];
    },

    getFilters: function () {
        const filters = this.props.collections.get("filters") || Immutable.Map();
        const filterResult =[];
        filters.forEach(filter => {
            filterResult.push({
                id: filter.get("_id"),
                label: filter.get("label"),
                selectedValue: "",
                filterType: filter.get("filterType"),
                isAttribute: true
            });
        });
        this.setState({filterList: R.concat(multisiteDefaultFilter, filterResult)});
    },

    getLegendItems: function () {
        const theme = this.getTheme();
        return [
            {icon: "alarm-o", iconColor: theme.colors.iconLegend, label: "Allarme", key: "Allarme"},
            {icon: "connection-o", iconColor: theme.colors.iconLegend, label: "Stato connessione", key: "Connessione"},
            {icon: "consumption-o", iconColor: theme.colors.iconLegend, label: "Andamento consumi", key: "Consumi"},
            {icon: "remote-control-o", iconColor: theme.colors.iconLegend, label: "Telecontrollo Innowatio", key: "Telecontrollo"},
            {icon: "good-o", iconColor: theme.colors.iconLegend, label: "Comfort", key: "Comfort"}
        ];
    },

    getSiteAlarmsAggregates: function (site, threshold = 0) {

        const alarmsList = this.props.collections.get("alarms") || Immutable.List();
        const alarmsAggregatesList = this.props.collections.get("alarms-aggregates") || Immutable.List();

        const alarms = alarmsList.map(x => x.toJS()).toArray();
        const alarmsAggregates = alarmsAggregatesList.map(x => x.toJS()).toArray();

        const decoratedAggregates = alarmsAggregates.map(aggregate => {
            const alarmDefinition = alarms.find(x => x._id === aggregate.alarmId);
            const measurementTimes = aggregate.measurementTimes.split(",");
            const measurementValues = aggregate.measurementValues.split(",");
            const measurements = measurementTimes.map((time, index) => {
                return {
                    time,
                    value: parseInt(measurementValues[index])
                };
            }).filter(x => x.value === 1);
            return {
                ...alarmDefinition,
                ...aggregate,
                measurements,
                triggered: R.last(measurements) ? R.last(measurements).time > threshold : false
            };
        });

        const siteAndSensors = [
            site._id,
            ...site.sensorsIds || []
        ];

        return decoratedAggregates.filter(x => R.contains(x.sensorId, siteAndSensors));
    },

    getSiteAlarmsInfo: function (site) {

        const today = moment().startOf("day");

        const todayAlarms = this.getSiteAlarmsAggregates(site, today.valueOf()).filter(x => x.triggered);

        const nightHours = [0, 1, 2, 3, 4, 5];

        const alarmsInfo = todayAlarms.reduce((state, alarm) => {
            const times = alarm.measurementTimes.split(",");
            const values = alarm.measurementValues.split(",");

            const measurements = times.map((time, index) => {
                return {
                    time: parseInt(time),
                    value: parseFloat(values[index])
                };
            }).filter(x => 1 === x.value);

            const nightTimes = measurements.filter(x => {
                return R.contains(moment(x.time).hours(), nightHours);
            });

            return {
                total: state.total + measurements.length,
                night: state.night + nightTimes.length
            };
        }, {
            total: 0,
            night: 0
        });

        return {
            day: alarmsInfo.total - alarmsInfo.night,
            night: alarmsInfo.night
        };
    },

    getSiteAlarmStatus: function (site) {

        const threshold = moment.utc().valueOf() - 86400000;

        const siteAlarms = this.getSiteAlarmsAggregates(site, threshold);
        if (siteAlarms.length === 0) {
            return "MISSING";
        }

        return siteAlarms.find(x => x.triggered) ? "error" : "active";
    },

    getSiteConnectionStatus: function (site) {
        const threshold = moment.utc().valueOf() - 1800000;

        const lastUpdate = get(site, "lastUpdate", 0);
        if (!lastUpdate) {
            return "missing";
        }

        return lastUpdate > threshold ? "active" : "error";
    },

    getSiteConsumptionStatus: function (site) {
        const today = moment().format("YYYY-MM-DD");
        const yesterday = moment().subtract({days: 1}).format("YYYY-MM-DD");
        const dailyAggregatesList = this.props.collections.get("readings-daily-aggregates") || Immutable.List();
        const dailyAggregates = dailyAggregatesList
            .map(x => x.toJS())
            .filter(x => R.contains(x.sensorId, site._id))
            .filter(x => x.day === today || x.day === yesterday)
            .filter(x => x.measurementType === "activeEnergy")
            .toArray();

        const activeEnergy = dailyAggregates.find(x => x.source === "reading");
        const activeEnergyReference = dailyAggregates.find(x => x.source === "reference");

        if (activeEnergy && activeEnergyReference) {
            const total = activeEnergy.measurementValues.split(",").reduce((total, value) => total + parseFloat(value), 0);
            const totalReference = activeEnergyReference.measurementValues.split(",").reduce((total, value) => total + parseFloat(value), 0);

            const result = (total - totalReference) / totalReference;

            if (result <= -1 || result >= 1) {
                return "unexpected";
            }

            if (result > -1 && result <= -0.05) {
                return "active";
            }

            if (result > -0.05 && result <= 0.1) {
                return "warning";
            }

            if (result > 0.1 && result < 1) {
                return "error";
            }
        }

        return "missing";
    },

    getSiteTelecontrolStatus: function (site) {
        const telecontrol = get(site, "status.telecontrol");
        if (!telecontrol) {
            return "missing";
        }

        return telecontrol.value;
    },

    getSiteComfortStatus: function (site) {
        const threshold = moment.utc().valueOf() - 3600000;

        const comfort = get(site, "status.comfort");
        if (!comfort) {
            return "missing";
        }

        return comfort.time > threshold ? comfort.value : "missing";
    },

    limitSites: function (values) {
        const {maxItems} = this.state;
        //apply splice
        const max = values.length < maxItems ? values.length : maxItems;
        return values.slice(0, max);
    },

    getFilteredSortedSites: function () {

        const start = moment().valueOf();
        const {
            search,
            sortBy,
            reverseSort,
            filterToApply
        } = this.state;
        const sites = this.getSites().map(x => {
            const site = x.toJS();
            return {
                ...site,
                lastUpdate: site.lastUpdate || 0
            };
        }).toArray();
        const filtered = sites.filter(site => {
            const input = search.trim().toLowerCase();
            const siteSearch = `${site.name || ""} ${site.address || ""}`;
            return siteSearch.toLowerCase().includes(input);
        });

        var advancedFiltered = filtered;
        if (filterToApply) {
            filterToApply.forEach(item => {
                advancedFiltered = advancedFiltered.filter(item.filterFunc);
            });
        }

        var sorted = R.sortBy(x => x[sortBy] && isNaN(x[sortBy]) ? x[sortBy].toLowerCase() : x[sortBy], advancedFiltered);

        //Apply reverse sort
        sorted = (reverseSort ? R.reverse(sorted) : sorted);
        const returnValue =  sorted.map(site => {
            return {
                ...site,
                alarmsInfo: !site.alarmsDisabled ? this.getSiteAlarmsInfo(site) : {
                    day: "n.d",
                    night: "n.d"
                },
                status: {
                    alarm: site.alarmsDisabled ? "disabled" : this.getSiteAlarmStatus(site),
                    connection: site.connectionDisabled ? "disabled" : this.getSiteConnectionStatus(site),
                    consumption: site.consumptionsDisabled ? "disabled" : this.getSiteConsumptionStatus(site),
                    remoteControl: site.telecontrolDisabled ? "disabled" : this.getSiteTelecontrolStatus(site),
                    comfort: site.comfortDisabled ? "disabled" : this.getSiteComfortStatus(site)
                }
            };
        });

        console.log(`benchmark: ${moment().valueOf() - start} ms`);

        return returnValue;
    },

    onChangeInputFilter: function (input) {
        this.setState({
            search: input,
            maxItems: 10
        });
    },

    onApplyMultiSiteFilter: function (value) {
        this.setState({
            filterToApply: value
        });
    },

    onResetMultiSiteFilter: function () {
        this.setState({
            filterToApply: this.state.filterList
        });
    },

    onChangeSortBy: function (sortBy) {
        if (sortBy === this.state.sortBy) {
            this.setState({
                reverseSort: !this.state.reverseSort
            });
        } else {
            this.setState({
                sortBy,
                reverseSort: false
            });
        }
    },

    onChangeTabValue: function (tabPeriod) {
        this.setState({period: tabPeriod});
    },

    onClickPanel: function (selectedPanel) {
        if (this.state.openPanel == selectedPanel.value) {
            this.setState({openPanel: ""});
        } else {
            this.setState({openPanel: selectedPanel.value});
        }
    },

    onSiteClick: function (id) {
        const {
            compareMode,
            selectedSites
        } = this.state;

        const isSelected = selectedSites.find(selectedId => selectedId === id);

        if (!isSelected && compareMode && selectedSites.length < 2) {
            this.setState({
                selectedSites: [
                    ...this.state.selectedSites,
                    id
                ]
            });
        }

        if (isSelected) {
            this.setState({
                selectedSites: selectedSites.filter(selectedId => selectedId != id)
            });
        }
    },

    onCompareClick: function () {
        !this.state.compareMode ? this.setState({showCompareMessage: true}) : null;
        this.setState({compareMode: !this.state.compareMode, selectedSites: []}),
        this.state.openPanel ? this.setState({openPanel: ""}) : null,
        window.setTimeout(this.closeCompareMessage, 2500);
    },

    onCompareSites: function () {
        this.props.selectSingleElectricalSensor([this.state.selectedSites[0]]);
        this.props.selectMultipleElectricalSensor(
            [this.state.selectedSites[1]]
        );
        this.setState({compareMode: false});
    },

    closeCompareMessage: function () {
        this.setState({showCompareMessage: false});
    },

    closeTipsMessage: function () {
        this.setState({showTipsMessage: false});
    },

    legendIsOpen: function () {
        this.setState({legendIsOpen: !this.state.legendIsOpen});
    },

    renderTrendStatus: function () {
        const statusAggregate = this.props.collections.get("consumptions-yearly-aggregates") || Immutable.List();
        return (
            <TrendStatus statusAggregate={statusAggregate}/>
        );
    },

    renderSitesRecap: function () {
        const sites = this.getSites();
        return (
            <SiteRecap sites={sites}/>
        );
    },

    renderEmptyBox: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).emptyBoxWrp}>
            </div>
        );
    },

    renderAlarmsRecap:  function () {
        const alarmsAggregates = this.props.collections.get("alarms-aggregates") || Immutable.Map();
        return alarmsAggregates ? (
            <AlarmsRecap alarmsAggregates={alarmsAggregates}/>
        ) : null;
    },

    renderCompareMessage: function () {
        const theme = this.getTheme();
        if (this.state.showCompareMessage) {
            return (
                <bootstrap.Alert
                    className="custom-alert"
                    onDismiss={this.closeCompareMessage}
                >
                    <Radium.Style
                        rules={{
                            "": {
                                borderRadius: "0px !important",
                                color: theme.colors.mainFontColor + " !important",
                                border: "0px",
                                backgroundColor: theme.colors.buttonPrimary,
                                marginBottom: "20px"
                            },
                            ".close": {
                                ...styles(theme).alertCloseButton
                            },
                            ".close:hover": {
                                color: theme.colors.white,
                                opacity: .5
                            },
                            ".close:focus": {
                                outline: "0px",
                                outlineStyle: "none",
                                outlineWidth: "0px"
                            }
                        }}
                        scopeSelector=".custom-alert"
                    />
                    <h4 style={styles(theme).textAlert}>
                        {"SELEZIONA I SITI DA CONFRONTARE"}
                    </h4>
                </bootstrap.Alert>
            );
        }
    },

    renderTooltipButton: function (tooltip, iconName, disabled, onClickFunc) {
        const theme = this.getTheme();
        const backgroundStyle = {backgroundColor:
            (iconName === "confront" ? theme.colors.buttonPrimary : theme.colors.primary)
        };
        return (
            <TooltipIconButton
                buttonStyle={{
                    ...backgroundStyle,
                    border: "0px",
                    borderRadius: "100%",
                    height: "68px",
                    width: "68px",
                    padding: "0px",
                    textAlign: "center",
                    margin: "0px 10px"
                }}
                icon={iconName}
                iconColor={theme.colors.white}
                iconSize={"46px"}
                iconStyle={{
                    lineHeight: "25px",
                    verticalAlign: "middle"
                }}
                isButtonDisabled={disabled}
                onButtonClick={onClickFunc}
                tooltipPlacement={"top"}
                tooltipText={tooltip}
            />
        );
    },

    renderBiggerButton: function (tooltip, iconName, disabled, onClickFunc) {
        const theme = this.getTheme();
        if (iconName === "confront") {
            return (
                <Link
                    className="btn-hover"
                    to={"/chart/"}
                    style={{backgroundColor: theme.colors.transparent}}
                >
                    <Radium.Style
                        rules={{
                            "": {
                                backgroundColor: theme.colors.transparent
                            }
                        }}
                        scopeSelector=".btn-hover"
                    />
                    {this.renderTooltipButton(tooltip, iconName, disabled, onClickFunc)}
                </Link>
            );
        } else {
            return (
                this.renderTooltipButton(tooltip, iconName, disabled, onClickFunc)
            );
        }
    },

    renderCompareButtons: function () {
        if (this.state.compareMode) {
            return (
                <div style={{
                    position: "fixed",
                    width: "176px",
                    margin: "0",
                    textAlign: "center",
                    bottom: "40px",
                    right: "20px",
                    zIndex: "100"
                }}>
                    {this.renderBiggerButton(
                        "Conferma comparazione", "confront", false,
                        () => this.onCompareSites()
                    )}
                    {this.renderBiggerButton(
                        "Annulla comparazione", "delete", false,
                        () => this.setState({
                            compareMode: false,
                            selectedSites: []
                        }))
                    }
                </div>
            );
        }
    },

    renderMultiSiteFilter: function () {
        if (this.state.filterList) {
            const filterList = this.state.filterList;
            return (
                <MultiSiteFilter
                    activeFilter={this.props.collections}
                    filterList={filterList}
                    onConfirm={this.onApplyMultiSiteFilter}
                    onReset={this.onResetMultiSiteFilter}
                />
            );
        }
    },

    renderSearchAction: function () {
        const theme = this.getTheme();
        const sortKey = this.state.sortBy;
        const descending = this.state.reverseSort;
        return (
            <bootstrap.Col className="item-col" xs={12} style={{...styles(theme).searchTools, width: "100%"}}>
                <Radium.Style
                    rules={styles(theme).colItemWrp}
                    scopeSelector=".item-col"
                />
                <div style={{float: "left", width: "calc(100% - 230px)", padding: "0px 5px"}}>
                    <InputFilter
                        inputValue={this.state.search}
                        onChange={this.onChangeInputFilter}
                    />
                </div>
                <div style={{float: "right", width: "230px"}}>
                    <div style={{margin: "20px 0px", height: "auto", float: "right"}}>
                        <TooltipIconButton
                            buttonStyle={{
                                ...styles(theme).buttonCompare,
                                backgroundColor: this.state.compareMode ?
                                    theme.colors.buttonPrimary :
                                    theme.colors.secondary
                            }}
                            icon={"confront"}
                            iconColor={theme.colors.white}
                            iconSize={"30px"}
                            iconStyle={{verticalAlign: "middle"}}
                            isButtonDisabled={false}
                            onButtonClick={this.onCompareClick}
                            tooltipText={"Compara due siti tra loro"}
                        />
                        {this.renderMultiSiteFilter()}
                        <ButtonSortBy
                            descending={descending}
                            filterList={multisiteButtonSortBy}
                            onChange={this.onChangeSortBy}
                            sortKey={sortKey}
                        />
                    </div>
                </div>
            </bootstrap.Col>
        );
    },

    renderSidebar: function (sites) {

        const {colors} = this.getTheme();
        return (
            <bootstrap.Col xs={12} sm={6} lg={4}>
                {this.renderTips()}
                {this.renderLegend()}
                {this.renderMap(sites)}
                <span style={styles(this.getTheme()).titleButtonPopover}>
                    <Icon
                        onClick={() => this.setState({
                            showMapModal: true
                        })}
                        color={colors.iconTips}
                        icon={"expand"}
                        size={"28px"}
                        style={styles(this.getTheme()).iconTips}
                    />
                </span>
            </bootstrap.Col>
        );
    },

    renderTips: function () {
        const theme = this.getTheme();
        if (this.state.showTipsMessage) {
            return (
                <bootstrap.Alert
                    className="tips-alert"
                    onDismiss={this.closeTipsMessage}
                >
                    <Radium.Style
                        rules={{
                            "": {
                                ...styles(theme).sidebarTips
                            },
                            ".close": {
                                ...styles(theme).alertCloseButton,
                                ...styles(theme).suggestionCloseButton
                            },
                            ".close:hover": {
                                color: theme.colors.mainFontColor,
                                opacity: .5
                            },
                            ".close:focus": {
                                outline: "0px",
                                outlineStyle: "none",
                                outlineWidth: "0px"
                            }
                        }}
                        scopeSelector=".tips-alert"
                    />
                    <h2 style={styles(theme).tipsTitle}>
                        <Icon
                            color={theme.colors.mainFontColor}
                            icon={"lightbulb"}
                            size={"40px"}
                            style={styles(theme).iconTips}
                        />
                        {"Suggerimento!"}
                    </h2>
                    <p style={{fontWeight: "300"}}>
                        {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum est felis, laoreet at molestie sed, tempor sed sem. Sed eu dignissim neque. Praesent augue lorem, porttitor nec elit et, sodales lobortis risus."}
                    </p>
                </bootstrap.Alert>
            );
        }
    },

    renderLegendHeader: function () {
        const theme = this.getTheme();
        const arrow = this.state.legendIsOpen ? "rotate(-180deg)" : null;
        return (
            <div>
                {"Legenda"}
                <Icon
                    color={theme.colors.mainFontColor}
                    icon={"arrow-down"}
                    size={"16px"}
                    style={{verticalAlign: "middle", float: "right", transform: arrow}}
                />
            </div>
        );
    },

    renderLegend: function () {
        const theme = this.getTheme();
        const legend = this.getLegendItems().map(item => {
            return (
                <li key={item.key} style={{listStyle: "none"}}>
                    <Icon
                        color={item.iconColor}
                        icon={item.icon}
                        size={"40px"}
                        style={{
                            display: "inline-block",
                            height: "42px",
                            width: "40px",
                            lineHeight: "40px",
                            marginRight: "10px",
                            verticalAlign: "middle"
                        }}
                    />
                    <label style={{
                        fontWeight: "300",
                        fontSize: "16px",
                        color: theme.colors.mainFontColor
                    }}>
                        {item.label}
                    </label>
                </li>
            );
        });
        return (
            <bootstrap.Panel
                className="legend"
                collapsible={true}
                header={this.renderLegendHeader()}
                onClick={this.legendIsOpen}
                eventKey="1"
            >
                <Radium.Style
                    rules={{
                        "": {
                            border: `1px solid ${theme.colors.transparent}`,
                            backgroundColor: theme.colors.transparent,
                            padding: "0px",
                            marginBottom: "20px",
                            borderRadius: "0px"
                        },
                        ".panel-body": {
                            padding: "0px",
                            margin: "0px"
                        },
                        ".panel-collapse > .panel-body": {
                            borderTop: "0px !important"
                        },
                        ".panel-heading": {
                            ...styles(theme).legendTitleWrp
                        },
                        ".panel-title > a": {
                            ...styles(theme).legendTitle
                        }
                    }}
                    scopeSelector=".legend"
                />
                <div style={styles(theme).sidebarLegend}>
                    <ul style={{margin: "0", padding: "0 0 0 5px"}}>
                        {legend}
                    </ul>
                </div>
            </bootstrap.Panel>
        );
    },

    renderMap: function (sites) {
        return (
            <div className="map-embed" style={{marginBottom: "30px"}}>
                <Radium.Style
                    rules={{
                        ".embed-responsive": {padding: "100px"}
                    }}
                    scopeSelector=".map-embed"
                />
                <div style={{height: "350px"}}>
                    <DashboardGoogleMap
                        sites={sites}
                        onChange={({zoom, center}) => {
                            this.setState({
                                zoom,
                                center
                            });
                        }}
                    />
                </div>
            </div>
        );
    },

    renderSites: function (sites) {
        const theme = this.getTheme();
        const buttonStyle = {
            cursor: (this.state.compareMode ? "pointer" : "default")
        };

        return sites.map((site, index) => (
            <SiteStatus
                fontNameSize={{fontSize: "20px"}}
                fontNameWidth={{width: "calc(100% - 40px)"}}
                fontStatusSize={{fontSize: "15px"}}
                iconStatusSize={"44px"}
                iconStatusStyle={styles(theme).iconStatusStyle}
                isActive={!!this.state.selectedSites.find(id => id === site._id)}
                isOpen={this.state.openPanel === site._id}
                key={index}
                onClick={(id) => this.onSiteClick(id)}
                onClickAlarmChart={this.props.selectSingleElectricalSensor}
                onClickPanel={this.onClickPanel}
                paddingStatusDiv={{padding: "8px 10px"}}
                parameterStatus={site.status}
                shownInMap={false}
                site={site}
                siteName={site.name}
                siteInfo={
                    this.getSiteInfo().map(info => {
                        return {
                            key: info.key,
                            label: info.label,
                            value: site[info.key] || ""
                        };
                    })
                }
                siteAddress={site.address || ""}
                style={{...buttonStyle, padding: "8px 10px"}}
            />
        ));
    },
    renderButtonLoad: function (totalNumberOfSites, numberOfDisplayedSites) {
        const theme = this.getTheme();
        return totalNumberOfSites > numberOfDisplayedSites ? (
            <Button
                onClick={() => this.setState({maxItems: this.state.maxItems + 10})}
                style={{
                    backgroundColor: theme.colors.buttonPrimary,
                    color: theme.colors.white,
                    width: "230px",
                    height: "45px",
                    borderRadius: "30px",
                    border: "0px"
                }}
            >
                {"MOSTRA ALTRI"}
            </Button>
        ) : null;
    },
    render: function () {
        const theme = this.getTheme();
        const sites = this.getFilteredSortedSites();
        const sitesLimited = this.limitSites(sites);
        return (
            <content style={styles(theme).pageContent}>
                {this.renderCompareButtons()}
                <bootstrap.Row className="data-row">
                    <Radium.Style
                        rules={{marginRight: "-5px", marginLeft: "-5px", padding: "0 5px"}}
                        scopeSelector=".data-row"
                    />
                    <DashboardBox>
                        {this.renderSitesRecap()}
                    </DashboardBox>
                    <DashboardBox>
                        {this.renderTrendStatus()}
                    </DashboardBox>
                    <DashboardBox>
                        {this.renderAlarmsRecap()}
                    </DashboardBox>
                    <DashboardBox>
                        {this.renderEmptyBox()}
                    </DashboardBox>
                </bootstrap.Row>
                <bootstrap.Row className="search-tool">
                    <Radium.Style
                        rules={styles(theme).rowDataWrp}
                        scopeSelector=".search-tool"
                    />
                    {this.renderSearchAction()}
                </bootstrap.Row>
                <bootstrap.Row className="site-sidebar">
                    {this.renderCompareMessage()}
                    <Radium.Style
                        rules={styles(theme).rowDataWrp}
                        scopeSelector=".site-sidebar"
                    />
                    <bootstrap.Col xs={12} sm={6} lg={8}>
                        <bootstrap.Row>
                            {this.renderSites(sitesLimited)}
                        </bootstrap.Row>
                        <bootstrap.Row style={{marginBottom: "20px"}}>
                            {this.renderButtonLoad(sites.length, sitesLimited.length)}
                        </bootstrap.Row>
                    </bootstrap.Col>
                    {this.renderSidebar(sites)}
                </bootstrap.Row>
                <FullscreenModal
                    title={"Mappa siti"}
                    onHide={() => this.setState({showMapModal: !this.state.showMapModal})}
                    show={this.state.showMapModal}
                >
                    <div>
                        <bootstrap.Row>
                            <bootstrap.Col xs={12} style={{height: "90vh"}}>
                                <div style={{height: "90vh", border: "1px solid " + theme.colors.borderBoxMultisite}}>
                                    <InputFilter
                                        inputValue={this.state.search}
                                        onChange={this.onChangeInputFilter}
                                        style={{
                                            position: "relative",
                                            zIndex: "1",
                                            width: "500px",
                                            float: "right",
                                            margin: "10px"
                                        }}
                                    />
                                    <DashboardGoogleMap
                                        sites={sites}
                                        zoom={this.state.zoom}
                                        center={this.state.center}
                                        onChange={({zoom, center}) => {
                                            this.setState({
                                                zoom,
                                                center
                                            });
                                        }}
                                    />
                                </div>
                            </bootstrap.Col>
                        </bootstrap.Row>
                    </div>
                </FullscreenModal>
            </content>
        );
    }
});

function mapStateToProps (state) {
    return {
        collections: state.collections
    };
}

function mapDispatchToProps (dispatch) {
    return {
        selectSingleElectricalSensor: bindActionCreators(selectSingleElectricalSensor, dispatch),
        selectMultipleElectricalSensor: bindActionCreators(selectMultipleElectricalSensor, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(MultiSite);
