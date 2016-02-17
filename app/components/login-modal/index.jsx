import Radium from "radium";
import React, {PropTypes} from "react";

import components from "components";
import assetsPathTo from "lib/assets-path-to";
import LoginView from "./login-view";
import PasswordResetView from "./password-reset-view";
import string from "lib/string-it";
import {defaultTheme} from "lib/theme";

const backgroundKeyFrames = Radium.keyframes({
    "0%": {
        backgroundPosition: "100% 0%"
    },
    "50%": {
        backgroundPosition: "0% 100%"
    },
    "100%": {
        backgroundPosition: "100% 0%"
    }
});

const stylesFunction = ({colors}) => ({
    backgroundImageOverlay: {
        position: "fixed",
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        zIndex: 100000000000,
        overflowY: "scroll",
        backgroundImage: `url(${assetsPathTo("restyling/images/logo_big.png")})`,
        backgroundSize: "cover"
    },
    overlay: {
        animation: "x 30s ease infinite",
        animationName: backgroundKeyFrames,
        animationDirection: "normal",
        backgroundImage: colors.backgroundLogin,
        backgroundSize: "4000% 4000%",
        position: "absolute",
        display: "block",
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        zIndex: 10000000000,
        overflowY: "scroll"
    },
    body: {
        width: "100%",
        color: colors.white,
        fontWeight: "lighter",
        position: "absolute",
        top: "10%"
    },
    title: {
        container: {
            width: "100%",
            textAlign: "center"
        },
        logo: {
            width: "220px"
        },
        firstLine: {
            fontSize: "48px",
            fontWeight: "400"
        },
        secondLine: {
            fontSize: "26px",
            lineHeight: "24px"
        }
    },
    activeView: {
        width: "50%",
        height: "40%",
        position: "relative",
        margin: "auto"
    },
    viewSwitcher: {
        cursor: "pointer",
        textAlign: "center",
        fontSize: "20px",
        ":hover": {
            textDecoration: "underline"
        }
    }
});

var LoginModal = React.createClass({
    propTypes: {
        asteroid: PropTypes.object.isRequired,
        isOpen: PropTypes.bool.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            activeView: "login"
        };
    },
    componentWillMount: function () {
        this.attachModalOpenClass(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.attachModalOpenClass(props);
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
    },
    attachModalOpenClass: function (props) {
        if (props.isOpen) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    },
    switchView: function () {
        this.setState({
            activeView: (
                this.state.activeView === "login" ?
                "passwordReset" :
                "login"
            )
        });
    },
    renderActiveView: function () {
        return (this.state.activeView === "login" ?
            <LoginView asteroid={this.props.asteroid} /> :
            <PasswordResetView asteroid={this.props.asteroid} />
        );
    },
    renderViewSwitcherText: function () {
        return (
            this.state.activeView === "login" ?
            string.forgetPassword :
            string.returnToLogin
        );
    },
    render: function () {
        const styles = stylesFunction(this.getTheme());
        return this.props.isOpen ? (
            <div style={styles.overlay}>
                <div style={styles.backgroundImageOverlay}>
                    <div style={styles.body}>
                        <div style={styles.title.container}>
                            <div>
                                <components.Icon
                                    color={this.getTheme().colors.iconDropdown}
                                    icon={"innowatio-logo"}
                                    size={"180px"}
                                    style={{
                                        display: "inline-block",
                                        height: "170px",
                                        margin: "0 0 0 20px",
                                        verticalAlign: "middle"
                                    }}
                                />
                            </div>
                            <div style={styles.title.firstLine}>{string.appName}</div>
                            <div style={styles.title.secondLine}>{string.innowatio}</div>
                        </div>
                        <components.Spacer direction="v" size={64} />
                        <div style={styles.activeView}>
                            {this.renderActiveView()}
                        </div>
                        <components.Spacer direction="v" size={16} />
                        <div onClick={this.switchView} style={styles.viewSwitcher}>
                            {this.renderViewSwitcherText()}
                        </div>
                        <components.Spacer direction="v" size={20} />
                    </div>
                </div>
            </div>
        ) : null;
    }
});

module.exports = Radium(LoginModal);
