import Radium from "radium";
import React, {PropTypes} from "react";

import components from "components";

import asteroid from "lib/asteroid";
import assetsPathTo from "lib/assets-path-to";
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
    content: {
        width: "90%",
        height: "40%",
        position: "relative",
        margin: "auto",
        textAlign: "center"
    },
    logoutButton: {
        background: colors.buttonPrimary,
        color: colors.white,
        height: "78px",
        width: "300px",
        margin: "auto",
        borderRadius: "30px",
        border: "0px none",
        fontSize: "30px",
        marginTop: "40px"
    }
});

var UnauthorizedModal = React.createClass({
    propTypes: {
        isOpen: PropTypes.bool.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    logout: function () {
        asteroid.logout();
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
                        <div style={styles.content}>
                            <h2>
                                {"Siamo spiacenti ma la sua utenza non è autorizzata ad accedere."}
                                <br />
                                {"Si prega di contattare l'amministratore per ottenere i permessi."}
                            </h2>
                            <components.Button
                                block={true}
                                bsSize="large"
                                onClick={this.logout}
                                style={styles.logoutButton}
                            >
                                {"LOGOUT"}
                            </components.Button>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
});

module.exports = Radium(UnauthorizedModal);
