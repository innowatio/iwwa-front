import Radium from "radium";
import React, {Component, PropTypes} from "react";
import {Link} from "react-router";

import components from "components";
import assetsPathTo from "lib/assets-path-to";
import LoginView from "./login-view";
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
        backgroundImage: `url(${assetsPathTo("images/logo_big.png")})`,
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
        fontSize: "24px",
        fontWeight: "300",
        textDecoration: "none",
        ":hover": {
            textDecoration: "underline"
        }
    }
});

class LoginModal extends Component {

    static propTypes = {
        asteroid: PropTypes.object.isRequired,
        isOpen: PropTypes.bool.isRequired
    }

    static contextTypes = {
        theme: PropTypes.object
    }

    componentWillMount () {
        this.attachModalOpenClass(this.props);
    }

    componentWillReceiveProps (props) {
        this.attachModalOpenClass(props);
    }

    getTheme () {
        return this.context.theme || defaultTheme;
    }

    attachModalOpenClass (props) {
        if (props.isOpen) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    }

    render () {
        const styles = stylesFunction(this.getTheme());
        return this.props.isOpen ? (
            <div style={styles.overlay}>
                <div style={styles.backgroundImageOverlay}>
                    <div style={styles.body}>
                        <div style={styles.title.container}>
                            <div>
                                <components.Icon
                                    color={this.getTheme().colors.iconLogoInnowatio}
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
                            <LoginView asteroid={this.props.asteroid}/>
                        </div>
                        <components.Spacer direction="v" size={16} />
                        <div style={styles.viewSwitcher}>
                            <Link
                                target="_blank"
                                to="https://sso.innowatio.it/password"
                                style={{color: "white"}}
                            >
                                {string.forgetPassword}
                            </Link>
                        </div>
                        <components.Spacer direction="v" size={20} />
                    </div>
                </div>
            </div>
        ) : null;
    }
}

module.exports = Radium(LoginModal);
