var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors");

var styles = {
    center: {
        textAlign: "center"
    },
    overlay: {
        position: "fixed",
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        background: colors.primary,
        zIndex: 1000
    },
    h4Label: {
        marginBottom: "100px",
        color: colors.white,
        fontWeight: "100"
    },
    accessButton: {
        fontWeight: "bold",
        height: "50px",
        color: colors.white,
        fontSize: "20px"
    },
    titleLabel: {
        marginTop: "200px",
        color: colors.white,
        fontWeight: "100"
    },
    inputLabel: {
        height: "50px",
        fontSize: "18px"
        // opacity: 0.1
    },
    h4PasswordLostLabel: {
        marginBottom: "30px",
        color: colors.white,
        fontWeight: "100"
    },
    groupIcon: {
        width: "36px"
    },
    inputsContainer: {
        position: "absolute",
        left: "calc(50% - 175px)",
        width: "350px"
    },
    textTitlePosition: {
        width: "350px"
    },
    popupLabel: {
        color: colors.white
    },
    aLink: {
        color: colors.white,
        fontSize: "15px"
    },
    errorAlert: {
        marginTop: "16px"
    }
};

var LoginModal = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object.isRequired,
        isOpen: React.PropTypes.bool.isRequired
    },
    getInitialState: function () {
        return {
            loginError: null
        };
    },
    setLoginError: function (error) {
        this.setState({
            loginError: error
        });
    },
    login: function () {
        var credentials = {
            email: this.refs.email.getValue(),
            password: this.refs.password.getValue()
        };
        this.setLoginError(null);
        this.props.asteroid.login(credentials).catch(this.setLoginError);
    },
    lostPasswordLogin: function () {
        this.setState({
            lostPassword: true
        });
    },
    attachModalOpenClass: function (props) {
        if (props.isOpen) {
            document.body.classList.add("modal-open");
        } else {
            document.body.classList.remove("modal-open");
        }
    },
    componentWillMount: function () {
        this.attachModalOpenClass(this.props);
    },
    componentWillReceiveProps: function (props) {
        this.attachModalOpenClass(props);
    },
    renderError: function () {
        return this.state.loginError ? (
            <bootstrap.Alert
                bsStyle="danger"
                style={styles.errorAlert}
            >
                {"Error logging in"}
            </bootstrap.Alert>
        ) : null;
    },
    render: function () {
        if (!this.state.lostPassword) {
            return this.props.isOpen ? (
                <div style={styles.overlay}>
                    <Radium.Style
                        rules={{
                            ".form-group": {
                                marginBottom: "-1px"
                            },
                            ".input-password": {
                                marginBottom: "40px",
                                borderTopLeftRadius: 0
                            },
                            ".form-signin-email": {
                                borderBottomRightRadius: 0
                            },
                            ".form-signin-psw": {
                                borderTopRightRadius: 0
                            },
                            ".input-group": {
                                borderTopLeftRadius: 0
                            },
                            ".access-button": {
                                backgroundImage: "radial-gradient(circle, #d9d9e5 15px, #9b9fbc 50px, #6c719a 100px);"
                            },
                            ".access-button:hover": {
                                background: colors.buttonHover
                            },
                            ".access-button:active": {
                                background: colors.buttonHover
                            }
                        }}
                    />
                <span className="text-center" style={styles.textTitlePosition}>
                        <h1 style={styles.titleLabel}>{"Energia alla tua Energia"}</h1>
                        <h4 style={styles.h4Label}>{"Innowatio"}</h4>
                    </span>
                    <div style={styles.inputsContainer}>
                        <bootstrap.Input
                            addonBefore={<components.Icon icon="user" style={styles.groupIcon}/>}
                            className="form-signin-email"
                            placeholder="Email"
                            ref="email"
                            style={styles.inputLabel}
                            type="email">
                        </bootstrap.Input>
                    <div className="input-password">
                        <bootstrap.Input
                            addonBefore={
                                <span className="iconPsw">
                                    <components.Icon className="iconPsw" icon="lock" style={styles.groupIcon}/>
                                </span>
                                }
                            className="form-signin-psw"
                            placeholder="Password"
                            ref="password"
                            style={styles.inputLabel}
                            type="password"
                        />
                    </div>
                        <bootstrap.Button
                            block
                            className="access-button"
                            onClick={this.login}
                            style={styles.accessButton}
                        >
                            {"ACCEDI"}
                        </bootstrap.Button>
                        {this.renderError()}
                        <components.Spacer direction="v" size={10} />
                        <div className="text-center" style={styles.popupLabel}>
                            <a onClick={this.lostPasswordLogin} style={styles.aLink}>{"Username o Password dimenticati?"}</a>
                        </div>
                    </div>
                </div>
                ) : null;
        } else {
            return this.props.isOpen ? (
                <div style={styles.overlay}>
                    <Radium.Style
                        rules={{
                            ".form-group": {
                                marginBottom: "-1px"
                            },
                            ".input-password": {
                                marginBottom: "40px",
                                borderTopLeftRadius: 0
                            },
                            ".form-signin-email": {
                                borderBottomRightRadius: 0
                            },
                            ".form-signin-psw": {
                                borderTopRightRadius: 0
                            },
                            ".input-group": {
                                borderTopLeftRadius: 0
                            },
                            ".access-button": {
                                backgroundImage: "radial-gradient(circle, #d9d9e5 15px, #9b9fbc 50px, #6c719a 100px);"
                            },
                            ".access-button:hover": {
                                background: colors.buttonHover
                            },
                            ".access-button:active": {
                                background: colors.buttonHover
                            }
                        }}
                    />
                    <span className="text-center" style={styles.textTitlePosition}>
                        <h1 style={styles.titleLabel}>{"Energia alla tua Energia"}</h1>
                        <h4 style={styles.h4PasswordLostLabel}>{"Innowatio"}</h4>
                        <h4 style={styles.h4PasswordLostLabel}>{"Username o Password dimenticati?"}</h4>
                    </span>
                    <div style={styles.inputsContainer}>
                        <bootstrap.Input
                            addonBefore={<components.Icon icon="user" style={styles.groupIcon}/>}
                            className="form-signin-email"
                            placeholder="Email"
                            ref="email"
                            style={styles.inputLabel}
                            type="email">
                        </bootstrap.Input>
                        <bootstrap.Button
                            block
                            className="access-button"
                            onClick={""}
                            style={styles.accessButton}
                        >
                            {"INVIA"}
                        </bootstrap.Button>
                        <span className="text-center" style={styles.textTitlePosition}>
                            <h6 style={styles.h4PasswordLostLabel}>{"Riceverai le nuove credenziali all'indirizzo e-mail indicato"}</h6>
                        </span>
                        {this.renderError()}
                    </div>
                </div>
            ) : null;
        }
    }
});

module.exports = Radium(LoginModal);
