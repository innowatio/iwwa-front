var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors");
var loginStyle = require("lib/login-modal-style")

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
    },
    login: function () {
        var credentials = {
            email: this.refs.login.refs.email.getValue(),
            password: this.refs.login.refs.password.getValue()
        };
        this.setLoginError(null);
        this.props.asteroid.login(credentials).catch(this.setLoginError);
    },
    passwordLost: function () {
        var credentials = {
            email: this.refs.sendMail.refs.email.getValue()
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
                style={loginStyle.errorAlert}
            >
                {"Hai sbagliato a inserire la mail!"}
            </bootstrap.Alert>
        ) : null;
    },
    renderError: function () {
        return this.state.loginError ? (
            <bootstrap.Alert
                bsStyle="danger"
                style={loginStyle.errorAlert}
            >
                {"Hai sbagliato a inserire mail o password!"}
            </bootstrap.Alert>
        ) : null;
    },
    render: function () {
        if (!this.state.lostPassword) {
            return this.props.isOpen ? (
                <components.LoginPage
                    errorMail={this.renderError()}
                    lostPassword={this.lostPasswordToLogin}
                    onChange={this.login}
                    ref="login"
                />
            ) : null;
        } else {
            if (!this.state.passwordSent) {
                return this.props.isOpen ? (
                    <components.RequestPasswordPage
                        errorMail={this.renderMailError()}
                        onChange={this.passwordLost}
                        ref="sendMail"
                    />
            ) : null;
            } else {
                return this.props.isOpen ? (
                    <components.SentPasswordPage
                        onChange={this.lostPasswordToLogin}
                    />
            ) : null;
            }
        }
    }
});

module.exports = Radium(LoginModal);
