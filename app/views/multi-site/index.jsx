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
        display: "inline-block",
        lineHeight: "15px",
        verticalAlign: "text-top",
        marginRight: "10px",
        transform: open ? "rotate(180deg)" : null
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
    getLegendItems: function () {
        const theme = this.getTheme();
        return [
            {icon: "alert", iconColor: theme.colors.iconSiteButton, label: "Allarme attivo", key: "Allarme"},
            {icon: "monitoring", iconColor: theme.colors.iconSiteButton, label: "Stato connessione", key: "Connessione"},
            {icon: "gauge", iconColor: theme.colors.iconSiteButton, label: "Andamento consumi", key: "Consumi"},
            {icon: "duplicate", iconColor: theme.colors.iconSiteButton, label: "Telecontrollo Innowatio", key: "Telecontrollo"},
            {icon: "good", iconColor: theme.colors.iconSiteButton, label: "Comfort", key: "Comfort"}
        ];
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
                <li key={item.key} style={{listStyle: "none", marginTop: "5px"}}>
                    <Icon
                        color={item.iconColor}
                        icon={item.icon}
                        size={"28px"}
                        style={{marginRight: "10px", verticalAlign: "middle"}}
                    />
                    <label style={{fontWeight: "300", fontSize: "15px"}}>
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
                    style={{position: "absolute", right: "15px", top: "18px"}}
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
                <bootstrap.Col xs={12} sm={4} md={3} lg={2}
                    style={{textAlign: "center"}}
                >
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
                {this.renderTips()}
                {this.renderLegend()}
                {this.renderMap()}
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
