import Immutable  from "immutable";
import React from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";
import R from "ramda";
import {bindActionCreators} from "redux";
import {selectSingleElectricalSensor} from "actions/chart";

import {connect} from "react-redux";
import {defaultTheme} from "lib/theme";
import moment from "lib/moment";
import {
    Button,
    ButtonFilter,
    ButtonSortBy,
    DashboardBox,
    DashboardGoogleMap,
    FullscreenModal,
    Icon,
    InputFilter,
    SiteStatus,
    TooltipIconButton
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
    trendText: {
        height: "20px",
        lineHeight: "20px",
        fontSize: "14px",
        textAlign: "left",
        fontWeight: "300",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
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
    siteRecapWrp: {
        backgroundColor: colors.primary,
        padding: "5px",
        margin: "4px 0px"
    },
    siteRecap: {
        fontSize: "40px",
        lineHeight: "30px",
        fontWeight: "600",
        margin: "0"
    },
    siteLabel: {
        display: "inline-block",
        overflow: "hidden",
        width: "95%",
        verticalAlign: "middle",
        height: "20px",
        lineHeight: "20px",
        fontSize: "13px",
        fontWeight: "300",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
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
        color: colors.white
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

const multisiteButtonFilter = [{
    title: "Quali siti vuoi visualizzare?",
    filter: [
        {label: "TUTTI", key: "tutti"},
        {label: "IN ALLARME", key: "allarme"},
        {label: "CONNESSI", key: "connessi"},
        {label: "NON CONNESSI", key: "non connessi"}
    ],
    key: "filter"
}];

var MultiSite = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: React.PropTypes.any,
        multisite: React.PropTypes.object,
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
        this.props.asteroid.subscribe("dashboardAlarms");
        this.props.asteroid.subscribe("dashboardAlarmsAggregates");
        this.props.asteroid.subscribe("dashboardDailyMeasurements");
        this.props.asteroid.subscribe("dashboardRealtimeAggregates");
    },
    getTitleTab: function (period) {
        switch (period) {
            case "day":
                return {
                    key: "day",
                    title: "GIORNO"
                };
            case "week":
                return {
                    key: "week",
                    title: "SETTIMANA"
                };
            case "month":
                return {
                    key: "month",
                    title: "MESE"
                };
            case "year":
                return {
                    key: "year",
                    title: "ANNO"
                };
            default:
                return {
                    key: "",
                    title: ""
                };
        }
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
    getTrendLabel: function () {
        return [
            {label: "Comfort:", key: "Comfort"},
            {label: "Consumo energetico:", key: "Consumo energetico"}
        ];
    },
    getTrendItems: function () {
        const theme = this.getTheme();
        return [
            {icon: "good-o", iconColor: theme.colors.iconActive, key: "good comfort", value: "35%"},
            {icon: "middle-o", iconColor: theme.colors.iconWarning, key: "middle comfort", value: "25%"},
            {icon: "bad-o", iconColor: theme.colors.iconError, key: "bad comfort", value: "40%"}
        ];
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

    getRealtimeAggregate: function (site, measurementType, filter = () => true) {
        const realtimeAggregatesList = this.props.collections.get("readings-real-time-aggregates") || Immutable.List();
        const realtimeAggregates = realtimeAggregatesList.map(x => x.toJS()).toArray();
        return realtimeAggregates.filter(filter).find(x => x.measurementType === measurementType && R.contains(x.sensorId, [site._id, ...site.sensorsIds]));
    },

    getSitesRecap: function () {
        return [
            {data: "800", label: "Siti totali", key: "totali"},
            {data: `${this.getSites().size}`, label: "Siti monitorati", key: "monitorati"},
            {data: "1", label: "Siti in real time", key: "realtime"},
            {data: "2", label: "Siti in remote control", key: "remote control"}
        ];
    },

    getSiteAlarmStatus: function (site) {

        const threshold = moment.utc().valueOf() - 86400000;

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
            ...site.sensorsIds
        ];

        const siteAlarms = decoratedAggregates.filter(x => R.contains(x.sensorId, siteAndSensors));
        if (siteAlarms.length === 0) {
            return "MISSING";
        }

        return siteAlarms.find(x => x.triggered) ? "ERROR" : "ACTIVE";
    },

    getSiteConnectionStatus: function (site) {

        const olderThan = 1800000;
        const threshold = moment.utc().valueOf() - olderThan;

        const realtimeAggregatesList = this.props.collections.get("readings-real-time-aggregates") || Immutable.List();
        const realtimeAggregates = realtimeAggregatesList.map(x => x.toJS()).toArray();

        for (var index = 0; index < site.sensorsIds.length; index++) {
            const sensorId = site.sensorsIds[index];
            const realtime = realtimeAggregates
                .filter(x => x.sensorId === sensorId)
                .filter(x => x.measurementTime >= threshold);
            if (realtime.length > 0) {
                return "ACTIVE";
            }
        }

        return "ERROR";
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
                return "OUTOFRANGE";
            }

            if (result > -1 && result <= -0.05) {
                return "ACTIVE";
            }

            if (result > -0.05 && result <= 0.1) {
                return "WARNING";
            }

            if (result > 0.1 && result < 1) {
                return "ERROR";
            }
        }

        return "MISSING";
    },

    getSiteRemoteControlStatus: function (site) {
        const telecontrol = this.getRealtimeAggregate(site, "telecontrolLevel");
        if (telecontrol) {
            return telecontrol.measurementValue === 1 ? "ACTIVE" : "ERROR";
        }
        return "MISSING";
    },

    getSiteComfortStatus: function (site) {
        const threshold = moment.utc().valueOf() - 3600000;
        const comfort = this.getRealtimeAggregate(site, "comfortLevel", x => {
            return x.measurementTime >= threshold;
        });
        if (comfort) {
            return comfort.measurementValue === 1 ? "ACTIVE" : "ERROR";
        }
        return "MISSING";
    },

    getFilteredSortedSites: function () {
        const {
            maxItems,
            search,
            sortBy,
            reverseSort
        } = this.state;
        const sites = this.getSites().map(x => x.toJS()).toArray();
        const filtered = sites.filter(site => {
            const input = search.trim().toLowerCase();
            const siteSearch = `${site.name || ""} ${site.address || ""}`;
            return siteSearch.toLowerCase().includes(input);
        });

        const sorted = filtered.sort((x, y) => x[sortBy] && x[sortBy].toLowerCase() > y[sortBy].toLowerCase() ? 1 : -1);
        const max = sorted.length < maxItems ? sorted.length : maxItems;
        const limited = reverseSort ? R.reverse(sorted).splice(0, max) : sorted.splice(0, max);

        return limited.map(site => {
            return {
                ...site,
                status: {
                    alarm: site.alarmsDisabled ? "DISABLED" : this.getSiteAlarmStatus(site),
                    connection: site.connectionDisabled ? "DISABLED" : this.getSiteConnectionStatus(site),
                    consumption: site.consumptionsDisabled ? "DISABLED" : this.getSiteConsumptionStatus(site),
                    remoteControl: site.telecontrolDisabled ? "DISABLED" : this.getSiteRemoteControlStatus(site),
                    comfort: site.comfortDisabled ? "DISABLED" : this.getSiteComfortStatus(site)
                }
            };
        });
    },

    onChangeInputFilter: function (input) {
        this.setState({
            search: input,
            maxItems: 10
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
        this.setState({compareMode: !this.state.compareMode}),
        this.setState({showCompareMessage: true});
        window.setTimeout(this.closeCompareMessage, 2500);
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

    getTabParameters: function () {
        const PERIODS = ["day", "week", "month", "year"];
        return PERIODS.map(period => this.getTitleTab(period));
    },

    renderTabContent: function () {
        const theme = this.getTheme();
        const trendData = this.getTrendItems().map(item => {
            return (
                <div
                    key={item.key}
                    style={{
                        // float: "right",
                        // textAlign: "right",
                        // width: "75px"
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Icon
                        color={item.iconColor}
                        icon={item.icon}
                        size={"28px"}
                        style={{
                            marginRight: "5px",
                            width: "30px",
                            height: "30px",
                            lineHeight: "30px"
                        }}
                    />
                    <span style={{
                        ...styles(theme).trendText,
                        width: "auto",
                        display: "inline-block",
                        textAlign: "center"
                    }}>
                        {item.value}
                    </span>
                </div>
            );
        });
        const trend = this.getTrendLabel().map(item => {
            return (
                <div
                    key={item.key}
                    style={{
                        // justifyContent: "space-between"
                        flexDirection: "column",
                        display: "flex",
                        marginBottom: "10px"
                    }}
                >
                    <span style={{
                        //width: "calc(100% - 75px)",
                        width: "100%",
                        ...styles(theme).trendText
                    }}>
                        {item.label}
                    </span>
                    <div style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        {trendData}
                    </div>
                </div>
            );
        });
        return trend;
    },

    renderSingleTab: function (theme, tabParameters) {
        return (
            <bootstrap.Tab
                className="style-single-tab"
                eventKey={tabParameters.key}
                key={tabParameters.key}
                title={tabParameters.title}
            >
                <div style={{marginTop: "5px"}}>
                    {this.renderTabContent(theme, tabParameters)}
                </div>
            </bootstrap.Tab>
        );
    },

    renderTabs: function () {
        const theme = this.getTheme();
        return (
            <bootstrap.Tabs
                id={"trend-tabs"}
                className="style-tab"
                onSelect={this.onChangeTabValue}
            >
                <Radium.Style
                    rules={{
                        "ul": {
                            display: "flex",
                            overflow: "hidden",
                            border: "0px",
                            margin: "0 -10px",
                            alignContent: "stretch",
                            backgroundColor: theme.colors.primary
                        },
                        "ul li": {
                            flexGrow: "4",
                            justifyContent: "space-arund",
                            alignItems: "center",
                            color: theme.colors.white
                        },
                        "ul li a": {
                            lineHeight: "34px",
                            fontSize: "14px",
                            textTransform: "uppercase",
                            padding: "0px 2px"
                        },
                        ".nav-tabs > li > a": {
                            height: "34px",
                            color: theme.colors.white,
                            border: "0px",
                            outline: "none"
                        },
                        ".nav-tabs > li.active > a, .nav-tabs > li > a:hover, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus": {
                            display: "inline",
                            height: "28px",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: theme.colors.white,
                            border: "0px",
                            borderRadius: "0px",
                            outline: "none",
                            backgroundColor: theme.colors.primary,
                            outlineStyle: "none",
                            outlineWidth: "0px",
                            borderBottom: "3px solid" + theme.colors.buttonPrimary
                        },
                        ".nav > li > a:hover, .nav > li > a:focus": {
                            background: theme.colors.transparent
                        }
                    }}
                    scopeSelector=".style-tab"
                />
                {
                    this.getTabParameters().map(parameter => {
                        return this.renderSingleTab(theme, parameter);
                    })
                }
            </bootstrap.Tabs>
        );
    },

    renderTrendStatus: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).dataWrp}>
                <h2 style={styles(theme).boxTitle}>
                    {"ANDAMENTO"}
                </h2>
                <div>
                    {this.renderTabs(theme)}
                </div>
            </div>
        );
    },

    renderSiteRecap: function () {
        const theme = this.getTheme();
        const sites = this.getSitesRecap().map(item => {
            return (
                <bootstrap.Col className="subitem-col" xs={6} key={item.key}>
                    <Radium.Style
                        rules={{paddingLeft: "5px", paddingRight: "5px"}}
                        scopeSelector=".subitem-col"
                    />
                    <div style={styles(theme).siteRecapWrp}>
                        <h2 style={styles(theme).siteRecap}>
                            {item.data}
                        </h2>
                        <span style={styles(theme).siteLabel}>
                            {item.label}
                        </span>
                    </div>
                </bootstrap.Col>
            );
        });
        return sites;
    },

    renderSitesRecap: function () {
        const theme = this.getTheme();
        // TODO IWWA-834 per i siti, bisogna capire se il controllo sui siti visibili dall'utente sta sul back (publication) o front
        // (in caso va gestita la publication per leggere il permesso `view-all-sites`)
        return (
            <div style={styles(theme).dataWrp}>
                <h2 style={styles(theme).boxTitle}>
                    {"SITI"}
                </h2>
                <span style={{fontSize: "15px", fontWeight: "300"}}>
                    {moment().format("ddd D MMM YYYY")}
                </span>
                <bootstrap.Row className="row-data">
                    <Radium.Style
                        rules={{marginRight: "-5px", marginLeft: "-5px"}}
                        scopeSelector=".row-data"
                    />
                    {this.renderSiteRecap()}
                </bootstrap.Row>
            </div>
        );
    },

    // renderAssetsStatus: function () {
    //     const theme = this.getTheme();
    //     return (
    //         <div style={styles(theme).dataWrp}>
    //             <h2 style={styles(theme).boxTitle}>
    //                 {"ASSET STATUS"}
    //             </h2>
    //         </div>
    //     );
    // },

    renderEmptyBox: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).emptyBoxWrp}>
            </div>
        );
    },

    renderAlarmsRecap:  function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).dataWrp}>
                <h2 style={styles(theme).boxTitle}>
                    {"ALLARMI"}
                </h2>
                <bootstrap.Row>
                    <bootstrap.Col
                        xs={6}
                        style={{textAlign: "left", fontWeight: "300", marginTop: "6px"}}
                    >
                        <p style={{fontSize: "16px"}}>
                            <b>{"DIURNI"}</b>
                        </p>
                        <p style={{margin: "0"}}>{"Totali: 12"}</p>
                        <p style={{margin: "0"}}>{"Ultima sett: 10"}</p>
                        <p style={{margin: "0"}}>{"Ultime 24h: 2"}</p>
                    </bootstrap.Col>
                    <bootstrap.Col
                        xs={6}
                        style={{textAlign: "left", fontWeight: "300", marginTop: "6px"}}
                    >
                        <p style={{fontSize: "16px"}}>
                            <b>{"NOTTURNI"}</b>
                        </p>
                        <p style={{margin: "0"}}>{"Totali: 12"}</p>
                        <p style={{margin: "0"}}>{"Ultima sett: 10"}</p>
                        <p style={{margin: "0"}}>{"Ultime 24h: 2"}</p>
                    </bootstrap.Col>
                </bootstrap.Row>
            </div>
        );
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

    renderBiggerButton: function (tooltip, iconName, disabled, onClickFunc) {
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
                iconSize={"50px"}
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
                        "Conferma comparazione", "confront", false, () => this.setState({compareMode: !this.state.compareMode}))
                    }
                    {this.renderBiggerButton(
                        "Annulla comparazione", "delete", false, () => this.setState({compareMode: !this.state.compareMode}))
                    }
                </div>
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
                        <ButtonFilter
                            activeFilter={this.props.collections}
                            filterList={multisiteButtonFilter}
                            onConfirm={this.onChangeInputFilter}
                        />
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

    renderSidebar: function () {
        const {colors} = this.getTheme();
        return (
            <bootstrap.Col xs={12} sm={4}>
                {this.renderTips()}
                {this.renderLegend()}
                {this.renderMap()}
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
                        scopeSelector=".tips-alert"
                    />
                    <h2 style={styles(theme).tipsTitle}>
                        <Icon
                            color={theme.colors.iconSiteButton}
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
                    <label style={{fontWeight: "300", fontSize: "16px"}}>
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
                style={{backgroundColor: theme.colors.black}}
            >
                <Radium.Style
                    rules={{
                        "": {
                            border: `1px solid ${theme.colors.transparent}`,
                            backgroundColor: theme.colors.transparent,
                            padding: "0px",
                            marginBottom: "20px"
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

    renderMap: function () {
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
                        sites={this.getFilteredSortedSites()}
                    />
                </div>
            </div>
        );
    },

    renderSites: function () {
        const buttonStyle = {
            cursor: (this.state.compareMode ? "pointer" : "default")
        };
        return this.getFilteredSortedSites().map((site, index) => (
            <SiteStatus
                isActive={this.state.selectedSites.find(id => id === site._id)}
                isOpen={this.state.openPanel === site._id}
                key={index}
                onClick={(id) => this.onSiteClick(id)}
                onClickAlarmChart={this.props.selectSingleElectricalSensor}
                onClickPanel={this.onClickPanel}
                parameterStatus={site.status}
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
                style={{...buttonStyle}}
            />
        ));
    },

    render: function () {
        const theme = this.getTheme();
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
                    <bootstrap.Col xs={12} sm={8}>
                        <bootstrap.Row>
                            {this.renderSites()}
                        </bootstrap.Row>
                        <bootstrap.Row>
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
                                {"CARICA ALTRI"}
                            </Button>
                        </bootstrap.Row>
                    </bootstrap.Col>
                    {this.renderSidebar()}
                </bootstrap.Row>
                <FullscreenModal
                    title={"Mappa siti"}
                    onHide={() => this.setState({showMapModal: !this.state.showMapModal})}
                    show={this.state.showMapModal}
                >
                    <div>
                        <bootstrap.Row>
                            <bootstrap.Col xs={12}>
                                <InputFilter
                                    inputValue={this.state.search}
                                    onChange={this.onChangeInputFilter}
                                />
                            </bootstrap.Col>
                        </bootstrap.Row>
                        <bootstrap.Row>
                            <bootstrap.Col xs={12} style={{height: "90vh"}}>
                                <DashboardGoogleMap
                                    sites={this.getFilteredSortedSites()}
                                />
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
        selectSingleElectricalSensor: bindActionCreators(selectSingleElectricalSensor, dispatch)
    };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(MultiSite);
