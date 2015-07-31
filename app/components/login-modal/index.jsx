var Radium = require("radium");
var React  = require("react");

var components        = require("components");
var colors            = require("lib/colors");
var LoginView         = require("./login-view.jsx");
var PasswordResetView = require("./password-reset-view.jsx");

var styles = {
    overlay: {
        position: "fixed",
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        backgroundColor: colors.black,
        backgroundImage: "url(/_assets/images/login-background.jpg)",
        backgroundSize: "cover",
        zIndex: 1000
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
            fontSize: "24px"
        }
    },
    activeView: {
        width: "520px",
        position: "relative",
        margin: "auto",
        maxWidth: "90%"
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
        return (
            this.state.activeView === "login" ?
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
                <div style={styles.body}>
                    <div style={styles.title.container}>
                        <div>
                            <img src="/_assets/images/logo.png" style={styles.title.logo} />
                        </div>
                        <components.Spacer direction="v" size={32} />
                        <div style={styles.title.firstLine}>{"Energia alla tua Energia"}</div>
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
                </div>
            </div>
        ) : null;
    }
});

module.exports = Radium(LoginModal);
