var Radium = require("radium");
var React  = require("react");
var R      = require("ramda");

var components        = require("components");
var assetsPathTo      = require("lib/assets-path-to");
var colors            = require("lib/colors_restyling");
var LoginView         = require("./login-view.jsx");
var PasswordResetView = require("./password-reset-view.jsx");


var backgroundKeyFrames = Radium.keyframes({
    "0%": {
        backgroundPosition: "0% 50%"
    },
    "50%": {
        backgroundPosition: "100% 50"
    },
    "100%": {
        backgroundPosition:"0% 50%"
    }
});

/*

    TODO Fix animation

    animation: "animation 13s ease infinite",
    animationName: animationKeyFrames,


    Original CSS

    background: linear-gradient(235deg, #3e50b4, #ff3f80, #25c5d9, #8b9dff, #8b9dff);
    background-size: 1000% 1000%;

    -webkit-animation: AnimationName 0s ease infinite;
    -moz-animation: AnimationName 0s ease infinite;
    animation: AnimationName 0s ease infinite;

    @-webkit-keyframes AnimationName {
        0%{background-position:14% 0%}
        50%{background-position:87% 100%}
        100%{background-position:14% 0%}
    }
    @-moz-keyframes AnimationName {
        0%{background-position:14% 0%}
        50%{background-position:87% 100%}
        100%{background-position:14% 0%}
    }
    @keyframes AnimationName {
        0%{background-position:14% 0%}
        50%{background-position:87% 100%}
        100%{background-position:14% 0%}
    }


        animation: "x 13s ease infinite",
        animationName: backgroundKeyFrames,
        backgroundSize: "cover",

*/

var styles = {
    overlay: {
        animation: "x 13s ease infinite",
        animationName: backgroundKeyFrames,
        backgroundImage: `url(${assetsPathTo("restyling/images/logo_big.png")}), linear-gradient(235deg, #3e50b4, #ff3f80, #25c5d9, #8b9dff, #8b9dff)`,
        backgroundSize: "cover",
        position: "fixed",
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        zIndex: 10000,
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
        console.log(backgroundKeyFrames);
        return this.props.isOpen ? (
            <div style={R.merge(styles.overlay, {zIndex: 10000000000})}>
                <div style={styles.body}>
                    <div style={styles.title.container}>
                        <div>
                            <img src={assetsPathTo("images/logo_login.png")} style={styles.title.logo} />
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
        ) : null;
    }
});

module.exports = Radium(LoginModal);
