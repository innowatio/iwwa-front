var Radium = require("radium");
var React  = require("react");

var components        = require("components");
var assetsPathTo      = require("lib/assets-path-to");
var colors            = require("lib/colors_restyling");
var LoginView         = require("./login-view");
var PasswordResetView = require("./password-reset-view");

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

var styles = {
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
        backgroundImage: "linear-gradient(235deg, #8a95c8, #5b72b3, #4554a1, #624899, #984898, #eb437f, #d26faa, #b08abc)",
        backgroundSize: "2000% 2000%",
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
            width: "250px"
        },
        firstLine: {
            fontSize: "48px"
        },
        secondLine: {
            fontSize: "24px",
            fontWeight: "200",
            lineHeight: "18px"
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
        ":hover": {
            textDecoration: "underline"
        }
    }
};

var LoginModal = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object.isRequired,
        isOpen: React.PropTypes.bool.isRequired
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
            "Password dimenticata?" :
            "Torna alla login"
        );
    },
    render: function () {
        return this.props.isOpen ? (
            <div style={styles.overlay}>
                <div style={styles.backgroundImageOverlay}>
                    <div style={styles.body}>
                        <div style={styles.title.container}>
                            <div>
                                <img src={assetsPathTo("restyling/images/logo_login.png")} style={styles.title.logo} />
                            </div>
                            <div style={styles.title.firstLine}>{"e-coach"}</div>
                            <div style={styles.title.secondLine}>{"Innowatio"}</div>
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
