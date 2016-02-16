import {Nav} from "react-bootstrap";
import React, {PropTypes} from "react";
import {Link} from "react-router";
import {merge, partial} from "ramda";
import {Style} from "radium";

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
        color: colors.white,
        marginLeft: "10px",
        verticalAlign: "middle",
        height: "56px",
        paddingTop: "0px"
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
        localStorage["hideTutorialOnPage_historicalGraph"] = false;
        localStorage["hideTutorialOnPage_alarm-form"] = false;
        this.props.linkClickAction();
        location.reload();
    },
    renderNavItem: function (styles, menuItem) {
        // images with paddingTop: 13px to remove when the icons will become fonts
        return menuItem.url ? (
            <li key={menuItem.iconPath}>
                <Link
                    activeStyle={styles.activeLink}
                    onClick={this.props.linkClickAction}
                    style={{height: "56px", lineHeight: "56px", padding: "0px 15px"}}
                    to={menuItem.url}
                >
                    <img src={menuItem.iconPath} style={{float: "left", width: "30px", paddingTop: "13px"}} />
                    <span style={styles.sideLabel}>
                        {menuItem.label}
                    </span>
                </Link>
            </li>
        ) : (
            <li className={"navigationItem"} key={menuItem.iconPath} onClick={this.resetTutorial} style={{cursor: "pointer"}}>
                <a style={{height: "56px", lineHeight: "56px", padding: "0px 15px"}}>
                    <img src={menuItem.iconPath} style={{float: "left", width: "30px", paddingTop: "13px"}} />
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
