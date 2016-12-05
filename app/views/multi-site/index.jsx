import Immutable  from "immutable";
import React from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";

import {connect} from "react-redux";
import {defaultTheme} from "lib/theme";
import moment from "lib/moment";
import {
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
        marginRight: "-5px",
        marginLeft: "-5px"
    },
    dataWrp:{
        minHeight: "165px",
        height: "auto",
        padding: "20px 10px",
        backgroundColor: colors.secondary,
        color: colors.white,
        marginBottom: "10px"
    },
    searchTools: {
        border: `1px solid ${colors.borderContentModal}`,
        backgroundColor: colors.backgroundContentModal,
        marginBottom: "20px"
    },
    siteRecap: {
        fontSize: "60px",
        lineHeight: "50px",
        fontWeight: "600",
        margin: "0"
    },
    boxTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px",
        fontWeight: "300"
    },
    sidebarLegend: {
        textAlign: "left",
        padding: "20px",
        marginBottom: "20px",
        border: `1px solid ${colors.borderContentModal}`,
        backgroundColor: colors.backgroundContentModal
    },
    legendTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px",
        fontWeight: "300"
    },
    sidebarTips: {
        textAlign: "left",
        padding: "20px",
        marginBottom: "20px",
        border: `1px dashed ${colors.buttonPrimary}`,
        backgroundColor: colors.transparent
    },
    tipsTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px",
        fontWeight: "300"
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
    componentDidMount: function () {
        this.props.asteroid.subscribe("sites");
    },
    getSites: function () {
        return this.props.collections.get("sites") || Immutable.Map();
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    onChangeInputFilter: function (input) {
        this.setState({
            search: input
        });
    },

    renderTips: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).sidebarTips}>
                <h2 style={styles(theme).tipsTitle}>
                    <Icon
                        color={theme.colors.iconSiteButton}
                        icon={"lightbulb"}
                        size={"30px"}
                        style={styles(theme).iconOption}
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
        return (
            <div style={styles(theme).sidebarLegend}>
                <h2 style={styles(theme).legendTitle}>
                    {"Legenda"}
                </h2>
                <ul>
                    <li>
                        <Icon
                            color={theme.colors.iconSiteButton}
                            icon={"alert"}
                            size={"14px"}
                            style={styles(theme).iconOption}
                        />
                        <label>{"Allarme Attivo"}</label>
                    </li>
                    <li>
                        <Icon
                            color={theme.colors.iconSiteButton}
                            icon={"monitoring"}
                            size={"14px"}
                            style={styles(theme).iconOption}
                        />
                        <label>{"Stato connessione"}</label>
                    </li>
                </ul>
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

    renderAbsorptionStatus: function () {
        const theme = this.getTheme();
        return (
            <div style={styles(theme).dataWrp}>
                <h2 style={styles(theme).boxTitle}>
                    {"ASSORBIMENTO ISTANTANEO"}
                </h2>
            </div>
        );
    },

    renderSearchAction: function () {
        return (
            <div>
                <bootstrap.Col xs={12} sm={8} md={9} lg={10}>
                    <InputFilter
                        onChange={this.onChangeInputFilter}
                    />
                </bootstrap.Col>
                <bootstrap.Col xs={12} sm={4} md={3} lg={2}>
                    <ButtonFilter
                        activeFilter={this.props.collections}
                        filterList={multisiteButtonFilter}
                        onConfirm={this.onChangeInputFilter}
                    />
                    <ButtonSortBy
                        activeSortBy={this.props.collections}
                        filterList={multisiteButtonSortBy}
                    />
                </bootstrap.Col>
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

    renderSiteRecap: function () {
        const theme = this.getTheme();
        // TODO IWWA-834 per i siti, bisogna capire se il controllo sui siti visibili dall'utente sta sul back (publication) o front
        // (in caso va gestita la publication per leggere il permesso `view-all-sites`)
        return (
            <div style={styles(theme).dataWrp}>
                <h2 style={styles(theme).siteRecap}>
                    {this.getSites().size}
                </h2>
                <p style={{fontSize: "20px"}}>
                    {"SITI MONITORATI"}
                </p>
                <span style={{fontSize: "16px", fontWeight: "300"}}>
                    {moment().format("ddd D MMM YYYY - [  h] HH:mm")}
                </span>
            </div>
        );
    },

    renderSidebar: function () {
        return (
            <bootstrap.Col xs={12} sm={4}>
                {this.renderLegend()}
                {this.renderTips()}
            </bootstrap.Col>
        );
    },

    renderSites: function () {
        return (
            <bootstrap.Col xs={12} sm={8}>
                <bootstrap.Row>
                    <SiteStatus
                        siteName={"OVS Curno / "}
                        siteAddress={"via Giuseppe Garibaldi 123"}
                    />
                    <SiteStatus
                        siteName={"OVS Curno / "}
                        siteAddress={"piazza V Giornate"}
                    />
                    <SiteStatus
                        siteName={"Casa Tiziano Zani / "}
                        siteAddress={"piazza V Giornate"}
                    />
                    <SiteStatus
                        siteName={"OVS Curno / "}
                        siteAddress={"piazza V Giornate"}
                    />
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
                        rules={styles(theme).rowDataWrp}
                        scopeSelector=".data-row"
                    />
                    <DashboardBox>
                        {this.renderSiteRecap()}
                    </DashboardBox>
                    <DashboardBox>
                        {this.renderAlarmsRecap()}
                    </DashboardBox>
                    <DashboardBox>
                        {this.renderAssetsStatus()}
                    </DashboardBox>
                    <DashboardBox>
                        {this.renderAbsorptionStatus()}
                    </DashboardBox>
                </bootstrap.Row>
                <bootstrap.Row style={styles(theme).searchTools}>
                    {this.renderSearchAction()}
                </bootstrap.Row>
                <bootstrap.Row>
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
