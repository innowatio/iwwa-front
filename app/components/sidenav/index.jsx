import {Nav} from "react-bootstrap";
import React, {PropTypes} from "react";
import {Link} from "react-router";
import {merge, partial} from "ramda";

import {defaultTheme} from "lib/theme";
import * as measures from "lib/measures";

const stylesFunction = ({colors}) => ({
    menu: {
        position: "absolute",
        width: "100%"
    },
    activeLink: {
        borderLeft: "4px solid " + colors.primary,
        borderRadius: "0px",
        backgroundColor: colors.greyLight
    },
    sideLabel: {
        color: colors.primary,
        marginLeft: "10px",
        verticalAlign: "middle",
        height: "100%"
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
    renderIconSideBar: function (styles, menuItem) {
        return menuItem.url ? (
            <li key={menuItem.iconPath} style={{height: "55px"}}>
                <Link
                    activeStyle={styles.activeLink}
                    onClick={this.props.linkClickAction}
                    style={{height: "55px"}}
                    to={menuItem.url}
                >
                    <img src={menuItem.iconPath} style={{float: "right", width: "30px"}} />
                </Link>
            </li>
        ) : (
            <li key={menuItem.iconPath} onClick={this.resetTutorial} style={{height: "55px", cursor: "pointer"}}>
                <a style={{height: "55px"}}>
                    <img src={menuItem.iconPath} style={{float: "right", width: "30px"}} />
                </a>
            </li>
        );
    },
    renderNavItem: function (styles, menuItem) {
        return menuItem.url ? (
            <li key={menuItem.iconPath}>
                <Link
                    activeStyle={styles.activeLink}
                    onClick={this.props.linkClickAction}
                    style={{height: "55px"}}
                    to={menuItem.url}
                >
                    <img src={menuItem.iconPath} style={{float: "left", width: "30px"}} />
                    <span style={styles.sideLabel}>
                        {menuItem.label}
                    </span>
                </Link>
            </li>
        ) : (
            <li key={menuItem.iconPath} onClick={this.resetTutorial} style={{cursor: "pointer"}}>
                <a style={{height: "55px"}}>
                    <img src={menuItem.iconPath} style={{float: "left", width: "30px"}} />
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
