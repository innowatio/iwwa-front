import Immutable  from "immutable";
import React from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";

import {connect} from "react-redux";
import {defaultTheme} from "lib/theme";
import moment from "lib/moment";
import {DashboardBox} from "components";


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
    siteRecap: {
        fontSize: "60px",
        lineHeight: "50px",
        fontWeight: "600",
        margin: "0"
    },
    boxTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px"
    }
});

var MultiSite = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object,
        collections: React.PropTypes.any
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
