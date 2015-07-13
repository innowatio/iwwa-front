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
            loginError: null,
            mailError: null,
            lostPassword: false,
            passwordSent: false
        };
    },
    setLoginError: function (error) {
        this.setState({
            loginError: error
        });
    },
    setPasswordLostError: function (error) {
        this.setState({
            mailError: true
        });
        console.log(this.state.mailError);
    },
    login: function () {
        var credentials = {
            email: this.refs.email.getValue(),
            password: this.refs.password.getValue()
        };
        this.setLoginError(null);
        this.props.asteroid.login(credentials).catch(this.setLoginError);
    },
    passwordLost: function () {
        var credentials = {
            email: this.refs.email.getValue(),
        };
        this.setPasswordLostError(null);
        (credentials.email.indexOf("@")>0) ?
        this.setState({
            passwordSent: !this.state.passwordSent
        }) :
        this.setPasswordLostError
    },
    lostPasswordToLogin: function () {
        !this.state.passwordSent ?
            this.setState({
                lostPassword: !this.state.lostPassword,
                mailError: null,
                loginError: null
            }) :
            this.setState({
                lostPassword: !this.state.lostPassword,
                passwordSent: !this.state.passwordSent,
                mailError: null,
                loginError: null
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
    renderMailError: function () {
        return this.state.mailError ? (
            <bootstrap.Alert
                bsStyle="danger"
                style={styles.errorAlert}
            >
                {"Hai sbagliato a inserire la mail!"}
            </bootstrap.Alert>
        ) : null;
    },
    renderError: function () {
        return this.state.loginError ? (
            <bootstrap.Alert
                bsStyle="danger"
                style={styles.errorAlert}
            >
                {"Hai sbagliato a inserire mail o password!"}
            </bootstrap.Alert>
        ) : null;
    },
    renderStyle: function () {
        return (
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
                        background: colors.primary
                    },
                    ".access-button:hover": {
                        background: colors.buttonHover
                    },
                    ".access-button:active": {
                        background: colors.buttonHover
                    }
                }}
            />
        );
    },
    renderEmailInput: function () {
        return (
            <bootstrap.Input
                addonBefore={<components.Icon icon="user" style={styles.groupIcon}/>}
                className="form-signin-email"
                placeholder="Email"
                ref="email"
                style={styles.inputLabel}
                type="email"
                required>
            </bootstrap.Input>
        );
    },
    renderLoginPage: function () {
        return (
            <div style={styles.overlay}>
                {this.renderStyle()}
                <span className="text-center" style={styles.textTitlePosition}>
                    <h1 style={styles.titleLabel}>{"Energia alla tua Energia"}</h1>
                    <h4 style={styles.h4Label}>{"Innowatio"}</h4>
                </span>
                <div style={styles.inputsContainer}>
                    {this.renderEmailInput()}
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
                        <a onClick={this.lostPasswordToLogin} style={styles.aLink}>{"Username o Password dimenticati?"}</a>
                    </div>
                </div>
            </div>
        );
    },
    renderRequestPasswordPage: function () {
        return (
            <div style={styles.overlay}>
                {this.renderStyle()}
                <span className="text-center" style={styles.textTitlePosition}>
                    <h1 style={styles.titleLabel}>{"Energia alla tua Energia"}</h1>
                    <h4 style={styles.h4PasswordLostLabel}>{"Innowatio"}</h4>
                    <h4 style={styles.h4PasswordLostLabel}>{"Username o Password dimenticati?"}</h4>
                </span>
                <div style={styles.inputsContainer}>
                    {this.renderEmailInput()}
                    <bootstrap.Button
                        block
                        className="access-button"
                        onClick={this.passwordLost}
                        style={styles.accessButton}
                    >
                        {"INVIA"}
                    </bootstrap.Button>
                    {this.renderMailError()}
                    <span className="text-center" style={styles.textTitlePosition}>
                        <h6 style={styles.h4PasswordLostLabel}>{"Riceverai le nuove credenziali all'indirizzo e-mail indicato"}</h6>
                    </span>
                </div>
            </div>
        )
    },
    renderSentPasswordPage: function () {
        return (
            <div style={styles.overlay}>
                {this.renderStyle()}
                <span className="text-center" style={styles.textTitlePosition}>
                    <h1 style={styles.titleLabel}>{"Energia alla tua Energia"}</h1>
                    <h4 style={styles.h4PasswordLostLabel}>{"Innowatio"}</h4>
                    <h4 style={styles.h4PasswordLostLabel}>
                        {"Abbiamo mandato una mail all'indirizzo selezionato per il reset della password."}
                    </h4>
                </span>
                <div style={styles.inputsContainer}>
                    <bootstrap.Button
                        block
                        className="access-button"
                        onClick={this.lostPasswordToLogin}
                        style={styles.accessButton}
                    >
                        {"TORNA ALLA LOGIN"}
                    </bootstrap.Button>
                </div>
            </div>
        )
    },
    render: function () {
        if (!this.state.lostPassword) {
            return this.props.isOpen ? (
                <div>
                    {this.renderLoginPage()}
                </div>
            ) : null;
        } else {
            if (!this.state.passwordSent) {
                return this.props.isOpen ? (
                    <div>
                        {this.renderRequestPasswordPage()}
                    </div>
            ) : null;
            } else {
                return this.props.isOpen ? (
                    <div>
                        {this.renderSentPasswordPage()}
                    </div>
            ) : null;
            }
        }
    }
});

module.exports = Radium(LoginModal);
