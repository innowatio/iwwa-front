import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";
import moment from "moment";

import {defaultTheme} from "lib/theme";
import {
    Button,
    Icon
} from "components";
import {Link} from "react-router";

const styles = (theme) => ({
    siteWrp: {
        display: "block",
        borderRadius: "0px",
        width: "100%",
        color: theme.colors.mainFontColor,
        position: "relative",
        minHeight: "100px",
        textAlign: "left",
        border: `1px solid ${theme.colors.borderBoxMultisite}`
    },
    siteNameWrp: {
        float: "left",
        height: "46px",
        color: theme.colors.mainFontColor,
        marginBottom: "10px",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    siteName: {
        display: "inline",
        fontWeight: "300"
    },
    siteAddress: {
        fontWeight: "300"
    },
    siteSecondaryText: {
        fontWeight: "300",
        textAlign: "left",
        color: theme.colors.mainFontColor
    },
    iconOptionBtn: {
        width: "40px",
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
        color: theme.colors.mainFontColor
    },
    singleInfoWrp: {
        borderBottom: `1px solid ${theme.colors.secondary}`,
        borderLeft: `1px solid ${theme.colors.secondary}`,
        borderRight: `1px solid ${theme.colors.secondary}`
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
        fontNameSize: PropTypes.object,
        fontNameWidth: PropTypes.object,
        fontStatusSize: PropTypes.object,
        iconStatusSize: PropTypes.string,
        iconStatusStyle: PropTypes.object,
        isActive: PropTypes.bool,
        isOpen: PropTypes.bool,
        onClick: PropTypes.func,
        onClickAlarmChart: PropTypes.func,
        onClickPanel: PropTypes.func,
        onClose: PropTypes.func,
        paddingStatusDiv: PropTypes.object,
        parameterStatus: PropTypes.object.isRequired,
        shownInMap: PropTypes.bool,
        site: PropTypes.object.isRequired,
        siteAddress: PropTypes.string.isRequired,
        siteInfo: PropTypes.array.isRequired,
        siteName: PropTypes.string.isRequired,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getDefaultProps: function () {
        return {
            fontNameSize: "20px",
            fontNameWidth: "calc(100% - 40px)",
            fontStatusSize: "15px",
            paddingStatusDiv: "8px 10px",
            iconStatusSize: "44px",
            iconStatusStyle: {
                display: "inline-block",
                borderRadius: "100%",
                width: "38px",
                height: "38px"
            },
            shownInMap: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    getAlarmInfo: function () {
        const {site} = this.props;
        const {
            day,
            night
        } = this.props.site.alarmsInfo;
        return [
            {label: "Tot allarmi diurni", value: day, key: "day alarm"},
            {label: "Tot allarmi notturni", value: night, key: "night alarm"},
            {label: "Ultimo aggiornamento", value: site.lastUpdate ? moment(site.lastUpdate).format("L") : "n.d.", key: "last update"}
        ];
    },
    getSiteStatus: function () {
        return [
            {
                icon: "alarm-o",
                iconColor: this.getColorByStatus(this.props.parameterStatus.alarm),
                key: "alarm"
            },
            {
                icon: "connection-o",
                iconColor: this.getColorByStatus(this.props.parameterStatus.connection),
                key: "connection"
            },
            {
                icon: "consumption-o",
                iconColor: this.getColorByStatus(this.props.parameterStatus.consumption),
                key: "consumption"
            },
            {
                icon: "remote-control-o",
                iconColor: this.getColorByStatus(this.props.parameterStatus.remoteControl),
                key: "remoteControl"
            },
            {
                icon: "good-o",
                iconColor: this.getColorByStatus(this.props.parameterStatus.comfort),
                key: "comfort"
            }
        ];
    },
    getColorByStatus: function (status) {
        const theme = this.getTheme();
        switch (status) {
            case "active":
                return theme.colors.iconActive;
            case "error":
                return theme.colors.iconError;
            case "warning":
                return theme.colors.iconWarning;
            case "unexpected":
                return theme.colors.iconOutOfRange;
            case "disabled":
                return theme.colors.iconDisabled;
            default:
                return theme.colors.iconInactive;
        }
    },
    getTooltipByStatus: function (status) {
        switch (status) {
            case "active":
                return {
                    alarm: "Non ci sono allarmi attivi",
                    connection: "Connessione ok",
                    consumption: "I consumi sono regolari",
                    remoteControl: "Sito telecontrollato",
                    comfort: "Livelli di comfort ottimali"
                };
            case "error":
                return {
                    alarm: "Ci sono allarmi attivi",
                    connection: "Problemi di connessione",
                    consumption: "Problemi relativi ai consumi",
                    remoteControl: "Problemi al telecontrollo",
                    comfort: "Problemi ai livelli di comfort"
                };
            case "warning":
                return {
                    alarm: "",
                    connection: "",
                    consumption: "I consumi non sono ottimali",
                    remoteControl: "",
                    comfort: "Livelli di comfort non ottimali"
                };
            case "unexpected":
                return {
                    alarm: "",
                    connection: "",
                    consumption: "É necessario verificare i consumi",
                    remoteControl: "",
                    comfort: ""
                };
            case "disabled":
                return {
                    alarm: "Allarmi disabilitati",
                    connection: "Stato connessione non disponibile",
                    consumption: "Consumi di riferimento non disponibili",
                    remoteControl: "Telecontro non disponibile",
                    comfort: "Livelli di comfort non disponibili"
                };
            default:
                return {
                    alarm: "Allarmi non impostati per questo sito",
                    connection: "Questo sito non é connesso a Innowatio",
                    consumption: "Dati non disponibili",
                    remoteControl: "Sito non telecontrollato da Innowatio",
                    comfort: "Livelli di comfort controllati da Innowatio"
                };
        }
    },
    getSiteWrpBackground: function () {
        const theme = this.getTheme();
        if (this.props.isOpen && this.props.isActive) {
            return theme.colors.buttonPrimary;
        } else if (this.props.isOpen) {
            return theme.colors.backgroundBoxMultisiteOpen;
        } else if (this.props.isActive) {
            return theme.colors.buttonPrimary;
        } else {
            return theme.colors.backgroundBoxMultisite;
        }
    },

    renderIconStatus: function (status) {
        return (
            <div className="icon-status">
                <Radium.Style
                    rules={{
                        "": {
                            height: "40px",
                            marginTop: "3px"
                        },
                        ":before": {
                            margin: "-3px !important"
                        }
                    }}
                    scopeSelector=".icon-status"
                />
                <Icon
                    color={status.iconColor}
                    icon={status.icon}
                    key={status.key}
                    size={this.props.iconStatusSize}
                    style={{...this.props.iconStatusStyle, display: "inline-block"}}
                />
            </div>
        );
    },
    renderSiteStatus: function () {
        const siteStatus = this.getSiteStatus().map((status) => {
            const statoIcona = this.props.parameterStatus[status.key];
            return this.getTooltipByStatus(statoIcona)[status.key] ? (
                <bootstrap.OverlayTrigger
                    key={status.key}
                    overlay={
                        <bootstrap.Tooltip className="buttonInfo" id={status.key}>
                            {this.getTooltipByStatus(statoIcona)[status.key]}
                        </bootstrap.Tooltip>
                    }
                    placement="bottom"
                    rootClose={true}
                    trigger={["hover", "click"]}
                >
                    <span style={{
                        display: "inline-block",
                        marginRight: "15px"
                    }}>
                        {this.renderIconStatus(status)}
                    </span>
                </bootstrap.OverlayTrigger>
            ) : (
                this.renderIconStatus(status)
            );
        });
        return siteStatus;
    },
    renderPrimaryInfo: function () {
        const theme = this.getTheme();
        const id = this.props.siteInfo.find(x => x.key === "_id");
        const itemStyleOpen = {
            borderColor: (this.props.isOpen ?
                theme.colors.secondary : theme.colors.borderBoxMultisite)
        };
        const itemStyleActive = {
            color: (this.props.isActive ?
                theme.colors.white : theme.colors.mainFontColor)
        };
        return (
            <div
                onClick={() => this.props.onClick(id.value)}
                style={{
                    ...styles(theme).siteWrp,
                    ...this.props.style,
                    ...itemStyleOpen,
                    backgroundColor: this.getSiteWrpBackground(theme)
                }}
            >
                <div style={{width: "100%", clear: "both"}}>
                    <div style={{...this.props.fontNameWidth, ...styles(theme).siteNameWrp}}>
                        <h2 style={{
                            ...styles(theme).siteName,
                            ...itemStyleActive,
                            ...this.props.fontNameSize
                        }}>
                            {`${this.props.siteName} / `}
                        </h2>
                        <span style={{
                            ...this.props.fontStatusSize,
                            ...styles(theme).siteAddress,
                            ...itemStyleActive
                        }}>
                            {this.props.siteAddress}
                        </span>
                    </div>
                    {this.props.onClose ? (
                        <Button
                            className="button-close"
                            onClick={() => this.props.onClose()}
                            style={styles(theme).iconOptionBtn}
                        >
                            <Radium.Style
                                rules={{
                                    "": {
                                        WebkitBoxShadow: "none !important",
                                        boxShadow: "none !important"
                                    },
                                    ".btn:active": {
                                        WebkitBoxShadow: "none !important",
                                        boxShadow: "none !important"
                                    }
                                }}
                                scopeSelector=".button-close"
                            />
                            <Icon
                                color={theme.colors.mainFontColor}
                                icon={"close"}
                                size={"26px"}
                                style={{verticalAlign: "middle"}}
                            />
                        </Button>
                    ) : null}
                    <Button
                        className="button-option"
                        onClick={evt => {
                            evt.stopPropagation();
                            this.props.onClickPanel(id);
                        }}
                        style={styles(theme).iconOptionBtn}
                    >
                        <Radium.Style
                            rules={{
                                "": {
                                    WebkitBoxShadow: "none !important",
                                    boxShadow: "none !important"
                                },
                                ".btn:active": {
                                    WebkitBoxShadow: "none !important",
                                    boxShadow: "none !important"
                                }
                            }}
                            scopeSelector=".button-option"
                        />
                        <Icon
                            color={this.props.isActive ? theme.colors.white : theme.colors.mainFontColor}
                            icon={"option"}
                            size={"26px"}
                            style={{verticalAlign: "middle"}}
                        />
                    </Button>
                </div>
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div style={{float: "left", lineHeight: "40px", height: "45px"}}>
                        {this.renderSiteStatus()}
                    </div>
                    <div style={{width: "40px", height: "40px", float: "right"}}>
                        <Link
                            to={"/chart/"}
                            style={{
                                ...styles(theme).buttonHistoricalConsumption,
                                lineHeight: "44px",
                                ...this.props.iconStatusStyle,
                                backgroundColor: theme.colors.primary
                            }}
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
                <bootstrap.Col className="col" key={item.key} xs={4} style={{margin: "20px 0px"}}>
                    <Radium.Style
                        rules={{
                            "": {
                                paddingLeft: "6px",
                                paddingRight: "6px"
                            }
                        }}
                        scopeSelector=".col"
                    />
                    <div style={{
                        border: `1px solid ${theme.colors.borderBoxAlarmMultisite}`,
                        minHeight: "95px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        color: theme.colors.mainFontColor,
                        ...this.props.paddingStatusDiv
                    }}>
                        <span style={{
                            fontWeight: "300",
                            lineHeight: "16px",
                            ...this.props.fontStatusSize
                        }}>
                            {item.label}
                        </span>
                        <p style={{
                            fontWeight: "300",
                            lineHeight: "30px",
                            margin: "0",
                            ...this.props.fontNameSize
                        }}>
                            {item.value}
                        </p>
                    </div>
                </bootstrap.Col>
            );
        });
        return alarmBox;
    },

    renderSiteInfo: function () {
        const theme = this.getTheme();
        const itemStyleOpen = {
            backgroundColor: (this.props.isOpen ?
                theme.colors.backgroundBoxMultisiteOpen : theme.colors.backgroundBoxMultisite),
            boxShadow: "0px 6px 6px " + theme.colors.shadowBoxMultisiteOpen
        };
        const siteInfo = this.props.siteInfo.filter(x => x.value).map(item => {
            return (
                <div key={item.key} style={{...styles(theme).singleInfoWrp, ...itemStyleOpen}}>
                    <div style={{width: "100%", ...this.props.paddingStatusDiv}}>
                        <div style={{...styles(theme).siteSecondaryText, ...this.props.fontStatusSize}}>
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
        const itemStyleOpen = {
            backgroundColor: (this.props.isOpen ?
                theme.colors.backgroundBoxMultisiteOpen : theme.colors.backgroundBoxMultisite)
        };
        return (
            <div>
                <div style={{...styles(theme).singleInfoWrp, ...itemStyleOpen}}>
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
            <bootstrap.Col xs={12} lg={this.props.shownInMap ? 12 : 6} style={{marginBottom: "20px"}}>
                {this.renderPrimaryInfo()}
                <bootstrap.Panel
                    className="site"
                    eventKey="1"
                    expanded={this.props.isOpen}
                    collapsible={true}
                >
                    <Radium.Style
                        rules={{
                            "": {
                                position: "absolute",
                                left: "15px",
                                right: "15px",
                                zIndex: "1",
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
