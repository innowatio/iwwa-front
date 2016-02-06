import React, {PropTypes} from "react";
import {Map, List} from "immutable";
import {Link} from "react-router";
import {merge} from "ramda";

import icons from "lib/icons_restyling";
import {defaultTheme} from "lib/theme";

var stylesFunction = ({colors}) => ({
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px",
        background: colors.primary,
        height: "100%",
        color: colors.white
    },
    icon: {
        cursor: "pointer",
        alignItems: "center"
    },
    hamburger: {
        cursor: "pointer"
    },
    viewTitle: {
        margin: "auto",
        fontSize: "20px",
        borderBottom: `3px solid ${colors.buttonPrimary}`
    }
});

var Header = React.createClass({
    propTypes: {
        asteroid: PropTypes.object.isRequired,
        menuClickAction: PropTypes.func,
        title: PropTypes.string
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    logout: function () {
        this.props.asteroid.logout();
    },
    userIsAdmin: function () {
        const users = this.props.asteroid.collections.get("users") || Map();
        const roles = users.getIn([this.props.asteroid.userId, "roles"]) || List();
        return roles.includes("admin");
    },
    renderAdminPage: function () {
        return this.userIsAdmin() && ENVIRONMENT !== "cordova" ? (
            <span style={{marginRight: "10px"}}>
                <Link to="/users/" >
                    <img className="pull-right" src={icons.iconUser} style={{width: "25px"}} />
                </Link>
            </span>
        ) : null;
    },
    render: function () {
        const styles = stylesFunction(this.getTheme());
        return (
            <div style={styles.base}>
                <img onClick={this.props.menuClickAction} src={icons.iconMenu}  style={styles.hamburger}/>
                <span style={merge(styles.base, {marginLeft: "15px"})}>
                    <Link to="/dashboard/" >
                        <img src={icons.iconLogo} />
                    </Link>
                </span>
                <div style={styles.viewTitle}>
                    {this.props.title.toUpperCase()}
                </div>
                {this.renderAdminPage()}
                <span onClick={this.logout} style={styles.icon}>
                    <img className="pull-right" src={icons.iconLogout} style={{width: "85%"}}/>
                </span>
            </div>
        );
    }
});

module.exports = Header;
