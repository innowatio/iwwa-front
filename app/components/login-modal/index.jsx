var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors");

var styles = {
    overlay: {
        position: "fixed",
        top: "0px",
        left: "0px",
        height: "100%",
        width: "100%",
        background: colors.white,
        zIndex: 1000
    },
    inputsContainer: {
        position: "absolute",
        top: "30%",
        left: "calc(50% - 200px)",
        width: "400px"
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
        return this.props.isOpen ? (
            <div style={styles.overlay}>
                <div style={styles.inputsContainer}>
                    <bootstrap.Input
                        addonBefore={<components.Icon icon="user" />}
                        placeholder="Email"
                        ref="email"
                        type="email"
                    />
                    <bootstrap.Input
                        addonBefore={<components.Icon icon="lock" />}
                        placeholder="Password"
                        ref="password"
                        type="password"
                    />
                    <bootstrap.Button block onClick={this.login}>
                        {"Accedi"}
                    </bootstrap.Button>
                    {this.renderError()}
                </div>
            </div>
        ) : null;
    }
});

module.exports = Radium(LoginModal);
