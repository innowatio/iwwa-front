import React, {PropTypes} from "react";
import moment from "moment";
import * as bootstrap from "react-bootstrap";
import Radium from "radium";

import {defaultTheme} from "lib/theme";

const styles = ({colors}) => ({
    dataWrp:{
        minHeight: "200px",
        height: "auto",
        padding: "5px 10px",
        backgroundColor: colors.secondary,
        color: colors.white,
        marginBottom: "10px"
    },
    boxTitle: {
        fontSize: "20px",
        margin: "0px 0px 10px 0px",
        lineHeight: "20px",
        fontWeight: "300"
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
    }
});

class SiteRecap extends React.Component {
    static propTypes = {
        sites: PropTypes.object.isRequired
    }

    constructor (props) {
        super(props);
        this.state ={};
    }

    getTheme () {
        return this.context.theme || defaultTheme;
    }

    getSitesRecap () {
        return [
            {data: "800", label: "Siti totali", key: "totali"},
            {data: `${this.props.sites.size}`, label: "Siti monitorati", key: "monitorati"},
            {data: "3", label: "Siti in real time", key: "realtime"},
            {data: "1", label: "Siti in remote control", key: "remote control"}
        ];
    }

    renderSiteRecap () {
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
    }

    render () {
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
    }
}

module.exports = SiteRecap;
