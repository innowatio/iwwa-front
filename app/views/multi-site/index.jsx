import Immutable  from "immutable";
import React from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";

import {connect} from "react-redux";
import {defaultTheme} from "lib/theme";
import moment from "lib/moment";
import {
    Button,
    ButtonFilter,
    ButtonSortBy,
    DashboardBox,
    Icon,
    InputFilter,
    SiteStatus
} from "components";


const styles = ({colors}) => ({
    pageContent: {
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
    colItemWrp: {
        height: "auto",
        paddingRight: "10px",
        paddingLeft: "10px"
    },
    trendText: {
        height: "30px",
        lineHeight: "30px",
        fontSize: "15px",
        textAlign: "left",
        fontWeight: "300",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    },
    searchTools: {
        width: "100%",
        borderTop: `1px solid ${colors.borderContentModal}`,
        borderBottom: `1px solid ${colors.borderContentModal}`,
        backgroundColor: colors.backgroundContentModal,
        marginBottom: "20px"
    },
    buttonConfront: {
        display: "block",
        float: "right",
        backgroundColor: colors.secondary,
        borderRadius: "100%",
        width: "50px",
        height: "50px",
        margin: "6px 12px",
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
        marginBottom: "20px",
        borderBottom: `1px solid ${colors.borderContentModal}`,
        borderRight: `1px solid ${colors.borderContentModal}`,
        borderLeft: `1px solid ${colors.borderContentModal}`,
        backgroundColor: colors.backgroundContentModal
    },
    legendTitleWrp: {
        padding: "0px",
        borderRadius: "0px",
        textAlign: "left",
        cursor: "pointer",
        border: `1px solid ${colors.borderContentModal}`,
        backgroundColor: colors.backgroundContentModal
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
        position: "relative",
        textAlign: "left",
        padding: "15px 20px",
        marginBottom: "20px",
        border: `2px dashed ${colors.buttonPrimary}`,
        backgroundColor: colors.transparent
    },
    buttonCancelTips: {
        position: "absolute",
        backgroundColor: colors.transparent,
        border: "0px",
        top: "5px",
        right: "0px"
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
    }
});

const multisiteButtonSortBy = [{
    title: "Visualizza in ordine di:",
    sortBy: [
        {label: "Pod", key: "pod"},
        {label: "Id", key: "id"},
        {label: "Provincia", key: "prov"},
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
        multisite: React.PropTypes.object
    },
    contextTypes: {
        theme: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            search: ""
        };
    },
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
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
    getTrendItems: function () {
        const theme = this.getTheme();
        return [
            {icon: "good-o", iconColor: theme.colors.iconActive, label: "Comfort:", key: "Comfort", value: "<=>"},
            {icon: "middle-o", iconColor: theme.colors.iconMiddleWay, label: "Energy consumption", key: "Energy consumption", value: "15%"},
            {icon: "bad-o", iconColor: theme.colors.iconInactive, label: "Energy budget Kwh/€:", key: "Energy budget", value: "26%"}
        ];
    },
    getLegendItems: function () {
        const theme = this.getTheme();
        return [
            {icon: "alarm-o", iconColor: theme.colors.iconActive, label: "Allarme attivo", key: "Allarme"},
            {icon: "connection-o", iconColor: theme.colors.iconActive, label: "Stato connessione", key: "Connessione"},
            {icon: "consumption-o", iconColor: theme.colors.iconActive, label: "Andamento consumi", key: "Consumi"},
            {icon: "remote-control-o", iconColor: theme.colors.iconActive, label: "Telecontrollo Innowatio", key: "Telecontrollo"},
            {icon: "good-o", iconColor: theme.colors.iconActive, label: "Comfort", key: "Comfort"}
        ];
    },
    getSitesRecap: function () {
        return [
            {data: "800", label: "Siti totali", key: "totali"},
            {data: `${this.getSites().size}`, label: "Siti monitorati", key: "monitorati"},
            {data: "1", label: "Real time monitored", key: "realtime"},
            {data: "2", label: "Remote Control", key: "remote control"}
        ];
    },
    onChangeInputFilter: function (input) {
        this.setState({
            search: input
        });
    },

    onChangeTabValue: function (tabPeriod) {
        this.setState({period: tabPeriod});
    },

    getTabParameters: function () {
        const PERIODS = ["day", "week", "month", "year"];
        return PERIODS.map(period => this.getTitleTab(period));
    },

    renderTabContent: function () {
        const theme = this.getTheme();
        const trend = this.getTrendItems().map(item => {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirction: "row",
                        justifyContent: "space-between"
                    }}
                    key={item.key}
                >
                    <span style={{
                        width: "calc(100% - 75px)",
                        ...styles(theme).trendText
                    }}>
                        {item.label}
                    </span>
                    <div style={{float: "right", textAlign: "right", width: "75px"}}>
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
                            width: "40px",
                            display: "inline-block",
                            textAlign: "right"
                        }}>
                            {item.value}
                        </span>
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
                <div style={{margin: "15px 0px 0px 10px"}}>
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
                    {moment().format("ddd D MMM YYYY - [  h] HH:mm")}
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

    renderAssetsStatus: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).dataWrp}>
                <h2 style={styles(theme).boxTitle}>
                    {"ASSET STATUS"}
                </h2>
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
                        style={{textAlign: "left", fontWeight: "300"}}
                    >
                        <p style={{fontSize: "16px"}}>
                            {"DIURNI"}
                        </p>
                        <p style={{margin: "0"}}>{"Totali: 12"}</p>
                        <p style={{margin: "0"}}>{"Ultima sett: 10"}</p>
                        <p style={{margin: "0"}}>{"Ultime 24h: 2"}</p>
                    </bootstrap.Col>
                    <bootstrap.Col
                        xs={6}
                        style={{textAlign: "left", fontWeight: "300"}}
                    >
                        <p style={{fontSize: "16px"}}>
                            {"NOTTURNI"}
                        </p>
                        <p style={{margin: "0"}}>{"Totali: 12"}</p>
                        <p style={{margin: "0"}}>{"Ultima sett: 10"}</p>
                        <p style={{margin: "0"}}>{"Ultime 24h: 2"}</p>
                    </bootstrap.Col>
                </bootstrap.Row>
            </div>
        );
    },

    renderSearchAction: function () {
        const theme = this.getTheme();
        return (
            <bootstrap.Col className="item-col" xs={12} style={{...styles(theme).searchTools, width: "100%"}}>
                <Radium.Style
                    rules={styles(theme).colItemWrp}
                    scopeSelector=".item-col"
                />
                <div style={{float: "left", width: "calc(100% - 230px)", padding: "0px 5px"}}>
                    <InputFilter
                        onChange={this.onChangeInputFilter}
                    />
                </div>
                <div style={{float: "right", width: "230px"}}>
                    <div style={{margin: "20px 0px", height: "auto", float: "right"}}>
                        <Button style={styles(theme).buttonConfront}>
                            <Icon
                                color={theme.colors.iconSiteButton}
                                icon={"confront"}
                                size={"30px"}
                                style={{verticalAlign: "middle"}}
                            />
                        </Button>
                        <ButtonFilter
                            activeFilter={this.props.collections}
                            filterList={multisiteButtonFilter}
                            onConfirm={this.onChangeInputFilter}
                        />
                        <ButtonSortBy
                            activeSortBy={this.props.collections}
                            filterList={multisiteButtonSortBy}
                        />
                    </div>
                </div>
            </bootstrap.Col>
        );
    },

    renderSidebar: function () {
        return (
            <bootstrap.Col xs={12} sm={4}>
                {this.renderTips()}
                {this.renderLegend()}
                {this.renderMap()}
            </bootstrap.Col>
        );
    },

    renderTips: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).sidebarTips}>
                <Button className="button-option" style={styles(theme).buttonCancelTips}>
                    <Radium.Style
                        rules={{
                            "": {
                                padding: "0px !important",
                                margin: "0px !important"
                            }
                        }}
                        scopeSelector=".button-option"
                    />
                    <Icon
                        color={theme.colors.iconSiteButton}
                        icon={"delete"}
                        size={"22px"}
                        style={{marginRight: "10px", verticalAlign: "middle"}}
                    />
                </Button>
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
                        size={"36px"}
                        style={{
                            display: "inline-block",
                            height: "42px",
                            width: "36px",
                            lineHeight: "36px",
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
            <bootstrap.Accordion style={{position: "relative"}}>
                <Icon
                    color={theme.colors.white}
                    icon={"arrow-down"}
                    size={"16px"}
                    style={styles(theme).iconArrowDown}
                />
                <bootstrap.Panel className="legend" header="Legenda" eventKey="1" style={{backgroundColor: theme.colors.black}}>
                    <Radium.Style
                        rules={{
                            "": {
                                border: `1px solid ${theme.colors.transparent}`,
                                backgroundColor: theme.colors.transparent,
                                padding: "0px",
                                margin: "0px"
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
            </bootstrap.Accordion>
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
                <bootstrap.ResponsiveEmbed a16by9={true}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d22121.91644272157!2d9.5555986!3d46.12605785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sit!4v1481041694687"
                        width="100"
                        height="100"
                        frameBorder="0"
                    />
                </bootstrap.ResponsiveEmbed>
            </div>
        );
    },

    renderSites: function () {
        return (
            <bootstrap.Col xs={12} sm={8}>
                <bootstrap.Row>
                    {
                        this.getSites()
                        .filter(site => {
                            const input = this.state.search.trim().toLowerCase();
                            return (site.get("name") || "").toLowerCase().includes(input) || (site.get("address") || "").toLowerCase().includes(input);
                        })
                        .map(site => {
                            return (
                                <SiteStatus
                                    key={site.get("_id")}
                                    siteName={site.get("name")}
                                    siteInfo={
                                        this.getSiteInfo().map(info => {
                                            return {
                                                key: info.key,
                                                label: info.label,
                                                value: site.get(info.key) || ""
                                            };
                                        })
                                    }
                                    siteAddress={site.get("address") || ""}
                                />
                            );
                        }).toArray()
                    }
                </bootstrap.Row>
            </bootstrap.Col>
        );
    },

    render: function () {
        const theme = this.getTheme();
        return (
            <content style={styles(theme).pageContent}>
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
                        {this.renderAssetsStatus()}
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
                    <Radium.Style
                        rules={styles(theme).rowDataWrp}
                        scopeSelector=".site-sidebar"
                    />
                    {this.renderSites()}
                    {this.renderSidebar()}
                </bootstrap.Row>
            </content>
        );
    }
});

function mapStateToProps (state) {
    return {
        collections: state.collections
    };
}
module.exports = connect(mapStateToProps)(MultiSite);
