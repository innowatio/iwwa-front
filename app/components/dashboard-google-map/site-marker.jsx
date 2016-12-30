import React, {PropTypes} from "react";
import {defaultTheme} from "lib/theme";

import {
    SiteStatus
} from "components";

const styles = (theme) => ({
    pinpointContainer: {
        position: "absolute",
        left: -20 / 2,
        top: -20 / 2,
        cursor: "help"
    },
    pinpoint: {
        width: "20px",
        height: "20px",
        padding: "4px",
        MozTransform: "rotate(45deg)",
        WebkitTransform: "rotate(45deg)",
        backgroundColor: theme.colors.transparent,
        border: "2px solid " + theme.colors.buttonPrimary,
        borderRadius: "30px",
        borderBottomRightRadius: "0px"
    }
});

// style={styles(theme).pinpointWrp}

var SiteMarker = React.createClass({
    propTypes: {
        site: PropTypes.object
    },
    getInitialState: function () {
        return {
            visible: false,
            expanded: false
        };
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
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    viewSiteInfo: function () {
        this.setState({
            visible: !this.state.visible
        });
    },
    render: function () {
        const theme = this.getTheme();
        const {site} = this.props;
        return (
            <div style={{width: "100vh", color: "white"}}>
                {this.state.visible ? (
                    <SiteStatus
                        isOpen={this.state.expanded}
                        key={site._id}
                        onClickPanel={() => this.setState({expanded: !this.state.expanded})}
                        onClose={() => this.setState({
                            visible: false
                        })}
                        parameterStatus={site.status}
                        siteAddress={site.address || ""}
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
                    />
                ) : null}
                <div style={styles(theme).pinpointContainer}>
                    <div style={styles(theme).pinpoint} />
                </div>
            </div>
        );
    }
});

module.exports = SiteMarker;
