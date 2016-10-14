import React, {PropTypes} from "react";
import {Link} from "react-router";
import {merge, partial} from "ramda";
import {Style} from "radium";
import * as components from "components";
import {EXEC_ENV} from "lib/config";
import pkg from "../../../package.json";

import {defaultTheme} from "lib/theme";
import * as measures from "lib/measures";
import moment from "lib/moment";

const stylesFunction = ({colors}) => ({
    menu: {
        width: "100%",
        height: "calc(100% - 60px)"
    },
    activeLink: {
        borderRadius: "0px",
        backgroundColor: colors.navBackgroundSelected,
        textDecoration: "none"
    },
    sideLabel: {
        color: colors.navText,
        margin: "0 0 0 10px",
        height: "30px",
        padding: "10px auto",
        lineHeight: "40px"
    },
    liMenu: {
        listStyleType: "none"
    },
    copyright: {
        height: "60px",
        fontWeight: 300,
        padding: "10px",
        fontSize: "12px",
        color: colors.white,
        textAlign: "center",
        backgroundColor: colors.backgroundFooter
    }
});

var SideNav = React.createClass({
    propTypes: {
        items: PropTypes.arrayOf(
            PropTypes.object
        ),
        linkClickAction: PropTypes.func,
        sidebarOpen: PropTypes.bool,
        style: PropTypes.object
    },
    contextTypes: {
        theme: PropTypes.object,
        router: PropTypes.object
    },
    getInitialState: function () {
        return {
            visible: false
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    resetTutorial: function () {
        localStorage["hideTutorialOnPage_historicalGraph"] = false;
        localStorage["hideTutorialOnPage_alarm-form"] = false;
        this.props.linkClickAction();
        location.reload();
    },
    renderFooter: function (styles) {
        return EXEC_ENV === "cordova" ? (
            <div style={styles.copyright}>
                {`Versione ${pkg.version}`}
                <br />
                {`Copyright ${moment().format("YYYY")} ©Innowatio SpA`}
            </div>
        ) : null;
    },
    renderNavItem: function (styles, menuItem) {
        // Not all the menuItem have the `url` key. If not, it's set to empty
        // string.
        const active = this.context.router.isActive(menuItem.url || "");
        return menuItem.url ? (
            <li key={menuItem.key} style={styles.liMenu}>
                <Link
                    activeStyle={styles.activeLink}
                    onClick={this.props.linkClickAction}
                    style={{
                        display: "block",
                        cursor: "pointer",
                        padding: "15px 10px"
                    }}
                    to={menuItem.url}
                >
                    <components.Icon
                        color={active ? this.getTheme().colors.iconSidenavActive : this.getTheme().colors.iconSidenav}
                        icon={menuItem.iconClassName}
                        size={"35px"}
                        style={{verticalAlign: "text-top", lineHeight: "26px"}}
                    />
                    <span style={styles.sideLabel}>
                        {menuItem.label}
                    </span>
                </Link>
            </li>
        ) : (
            <li
                className={"navigationItem"}
                key={menuItem.key}
                onClick={this.resetTutorial}
                style={{cursor: "pointer", padding: "5px 0px"}}
            >
                <a style={{
                    display: "block",
                    cursor: "pointer",
                    padding: "15px 10px"
                }}>
                    <components.Icon
                        color={this.getTheme().colors.iconSidenav}
                        icon={menuItem.iconClassName}
                        size={"35px"}
                        style={{verticalAlign: "text-top", lineHeight: "26px"}}
                    />
                    <span style={styles.sideLabel}>
                        {menuItem.label}
                    </span>
                </a>
            </li>
        );
    },
    render: function () {
        const styles = merge(stylesFunction(this.getTheme()), {
            left: (this.state.sidebarOpen ?
            "0px" :
            `-${measures.sidebarWidth}px`)
        });
        return (
            <div style={this.props.style}>
                <div id="menu" style={styles.menu}>
                    <Style
                        rules={{"a:hover, a:focus": styles.activeLink}}
                    />
                    <div>
                        {
                            this.props.items.map(
                                partial(this.renderNavItem, [styles])
                            )
                        }
                    </div>
                </div>
                <div style={{clear: "both"}}></div>
                {this.renderFooter(styles)}
            </div>
        );
    }
});

module.exports = SideNav;
