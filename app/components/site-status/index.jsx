import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";

import {defaultTheme} from "lib/theme";
import {
    Button,
    Icon
} from "components";
import {Link} from "react-router";

const styles = (theme) => ({
    siteWrp: {
        display: "block",
        padding: "8px 10px",
        minHeight: "100px",
        textAlign: "left",
        border: `1px solid ${theme.colors.borderContentModal}`,
        backgroundColor: theme.colors.backgroundContentModal
    },
    siteNameWrp: {
        width: "calc(100% - 40px)",
        float: "left",
        height: "46px",
        marginBottom: "10px",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    siteName: {
        fontSize: "20px",
        display: "inline",
        fontWeight: "300"
    },
    siteAddress: {
        fontSize: "15px",
        fontWeight: "300"
    },
    SiteSecondaryTextWrp: {
        padding: "10px"
    },
    SiteSecondaryText: {
        fontSize: "15px",
        fontWeight: "300",
        textAlign: "left"
    },
    iconOptionBtn: {
        width: "30px",
        float: "right",
        border: 0,
        backgroundColor: theme.colors.transparent
    },
    siteTitle: {
        display: "block",
        width: "100%",
        padding: "15px",
        fontSize: "20px",
        lineHeight: "20px",
        fontWeight: "300",
        color: theme.colors.white
    },
    buttonHistoricalConsumption: {
        display: "block",
        height: "40px",
        width: "40px",
        lineHeight: "44px",
        textAlign: "center",
        verticalAlign: "middle",
        borderRadius: "100%",
        padding: "0px",
        border: "0px",
        backgroundColor: theme.colors.primary
    }
});

var SiteStatus = React.createClass({
    propTypes: {
        key: PropTypes.string,
        onClickAlarmChart: PropTypes.func,
        parameterStatus: PropTypes.object.isRequired,
        siteAddress: PropTypes.string.isRequired,
        siteInfo: PropTypes.array.isRequired,
        siteName: PropTypes.string.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            open: false
        };
    },
    getAlarmInfo: function () {
        return [
            {label: "Tot allarmi diurni", value: "4", key: "day alarm"},
            {label: "Tot allarmi notturni", value: "3", key: "night alarm"},
            {label: "Ultimo aggiornamento", value: "14.12.2016", key: "last update"}
        ];
    },
    getColorByStatus: function (status) {
        const theme = this.getTheme();
        switch (status) {
            case "ACTIVE":
                return theme.colors.iconActive;
            case "ERROR":
                return theme.colors.iconError;
            case "WARNING":
                return theme.colors.iconWarning;
            default:
                return theme.colors.iconInactive;
        }
    },
    getSiteStatus: function () {
        return [
            {icon: "alarm-o", iconColor: this.getColorByStatus(this.props.parameterStatus.alarm), key: "Allarme"},
            {icon: "connection-o", iconColor: this.getColorByStatus(this.props.parameterStatus.connection), key: "Connessione"},
            {icon: "consumption-o", iconColor: this.getColorByStatus(this.props.parameterStatus.consumption), key: "Consumi"},
            {icon: "remote-control-o", iconColor: this.getColorByStatus(this.props.parameterStatus.remoteControl), key: "Telecontrollo"},
            {icon: "good-o", iconColor: this.getColorByStatus(this.props.parameterStatus.comfort), key: "Comfort"}
        ];
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    renderSiteStatus: function () {
        const siteStatus = this.getSiteStatus().map(status => {
            return (
                <Icon
                    key={status.key}
                    color={status.iconColor}
                    icon={status.icon}
                    size={"42px"}
                    style={{display: "inline-block", marginRight: "8px", height: "40px"}}
                />
            );
        });
        return siteStatus;
    },
    renderPrimaryInfo: function () {
        const theme = this.getTheme();
        const id = this.props.siteInfo.find(x => x.key === "_id");
        return (
            <div style={styles(theme).siteWrp}>
                <div style={{width: "100%", clear: "both"}}>
                    <div style={styles(theme).siteNameWrp}>
                        <h2 style={styles(theme).siteName}>
                            {`${this.props.siteName} / `}
                        </h2>
                        <span style={styles(theme).siteAddress}>{this.props.siteAddress}</span>
                    </div>
                    <Button
                        className="button-option"
                        onClick={()=> this.setState({open: !this.state.open})}
                        style={styles(theme).iconOptionBtn}
                    >
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
                            icon={"option"}
                            size={"24px"}
                            style={{verticalAlign: "middle"}}
                        />
                    </Button>
                </div>
                <div style={{width: "100%", height: "40px", clear: "both"}}>
                    <div style={{float: "left", lineHeight: "40px", height: "40px"}}>
                        {this.renderSiteStatus()}
                    </div>
                    <div style={{width: "40px", height: "40px", float: "right"}}>
                        <Link
                            to={"/chart/"}
                            style={styles(theme).buttonHistoricalConsumption}
                            onClick={() => this.props.onClickAlarmChart([id.value])}
                        >
                            <Icon
                                color={theme.colors.iconSiteButton}
                                icon={"history"}
                                size={"22px"}
                                style={{verticalAlign: "middle"}}
                            />
                        </Link>
                    </div>
                </div>
            </div>
        );
    },

    renderAlarmsInfo: function () {
        const theme = this.getTheme();
        const alarmBox = this.getAlarmInfo().map(item => {
            return (
                <bootstrap.Col key={item.key} xs={12} lg={4} style={{margin: "20px 0px"}}>
                    <div style={{border: `1px solid ${theme.colors.borderContentModal}`}}>
                        <span>{item.label}</span>
                        <p>{item.value}</p>
                    </div>
                </bootstrap.Col>
            );
        });
        return alarmBox;
    },

    renderSiteInfo: function () {
        const theme = this.getTheme();
        const siteInfo = this.props.siteInfo.map(item => {
            return (
                <div key={item.key} style={{
                    borderBottom: `1px solid ${theme.colors.borderContentModal}`,
                    borderLeft: `1px solid ${theme.colors.borderContentModal}`,
                    borderRight: `1px solid ${theme.colors.borderContentModal}`,
                    backgroundColor: theme.colors.backgroundContentModal
                }}>
                    <div style={{width: "100%", ...styles(theme).SiteSecondaryTextWrp}}>
                        <div style={styles(theme).SiteSecondaryText}>
                            {`${item.label}: ${item.value}`}
                        </div>
                    </div>
                </div>
            );
        });
        return siteInfo;
    },

    renderSecondaryInfo: function () {
        const theme = this.getTheme();
        return (
            <div>
                <div style={{
                    borderBottom: `1px solid ${theme.colors.borderContentModal}`,
                    borderLeft: `1px solid ${theme.colors.borderContentModal}`,
                    borderRight: `1px solid ${theme.colors.borderContentModal}`,
                    backgroundColor: theme.colors.backgroundContentModal
                }}>
                    {this.renderAlarmsInfo()}
                    <div style={{clear: "both"}}></div>
                </div>
                {this.renderSiteInfo()}
            </div>
        );
    },

    render: function () {
        const theme = this.getTheme();
        return (
            <bootstrap.Col xs={12} md={12} lg={6} style={{marginBottom: "20px"}}>
                {this.renderPrimaryInfo()}
                <bootstrap.Panel
                    className="site"
                    eventKey="1"
                    expanded={this.state.open}
                    collapsible={true}
                >
                    <Radium.Style
                        rules={{
                            "": {
                                border: "0",
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
                            ".panel-title > a": {
                                ...styles(theme).siteTitle
                            },
                            ".panel-title": {
                                marginBottom: "0px !important"
                            }
                        }}
                        scopeSelector=".site"
                    />
                    {this.renderSecondaryInfo()}
                </bootstrap.Panel>
            </bootstrap.Col>
        );
    }
});
module.exports = SiteStatus;
