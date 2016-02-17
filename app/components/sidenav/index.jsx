import {Nav} from "react-bootstrap";
import React, {PropTypes} from "react";
import {Link} from "react-router";
import {merge, partial} from "ramda";
import {Style} from "radium";
import * as components from "components";

import {defaultTheme} from "lib/theme";
import * as measures from "lib/measures";

const stylesFunction = ({colors}) => ({
    menu: {
        position: "absolute",
        width: "100%"
    },
    activeLink: {
        borderRadius: "0px",
        backgroundColor: colors.navBackgroundSelected
    },
    sideLabel: {
        color: colors.navText,
        margin: "0 0 0 10px",
        height: "30px",
        padding: "10px auto"
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
        theme: PropTypes.object
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
        localStorage[`hideTutorialOnPage_historicalGraph`] = false;
        localStorage[`hideTutorialOnPage_alarm-form`] = false;
        this.props.linkClickAction();
        location.reload();
    },
    renderNavItem: function (styles, menuItem) {
        return menuItem.url ? (
            <li key={menuItem.key}>
                <Link
                    activeStyle={styles.activeLink}
                    onClick={this.props.linkClickAction}
                    style={{cursor: "pointer", padding: "15px 10px"}}
                    to={menuItem.url}
                >
                    <components.Icon
                        color={this.getTheme().colors.iconSidenav}
                        icon={menuItem.iconClassName}
                        size={"30px"}
                        style={{verticalAlign: "middle", lineHeight: "30px"}}
                    />
                    <span style={styles.sideLabel}>
                        {menuItem.label}
                    </span>
                </Link>
            </li>
        ) : (
            <li className={"navigationItem"} key={menuItem.key} onClick={this.resetTutorial} style={{cursor: "pointer", padding: "5px 0px"}}>
                <a style={{cursor: "pointer", padding: "15px 10px"}}>
                    <components.Icon
                        color={this.getTheme().colors.iconSidenav}
                        icon={menuItem.iconClassName}
                        size={"30px"}
                        style={{verticalAlign: "middle", lineHeight: "30px"}}
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
                        rules={{".nav > li > a:hover": styles.activeLink}}
                    />
                    <Nav bsStyle="pills" stacked={true} >
                        {
                            this.props.items.map(
                                partial(this.renderNavItem, [styles])
                            )
                        }
                    </Nav>
                </div>
            </div>
        );
    }
});

module.exports = SideNav;
