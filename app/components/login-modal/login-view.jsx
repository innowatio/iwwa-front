var color     = require("color");
var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors");

var styles = {
    inputs: {
        borderRadius: "4px",
        overflow: "hidden"
    },
    loginButton: {
        background: colors.primary,
        color: colors.white
    },
    errorAlert: {
        marginTop: "16px",
        textAlign: "center"
    }
};

var LoginView = React.createClass({
    propTypes: {
        asteroid: React.PropTypes.object.isRequired
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
    renderError: function () {
        return this.state.loginError ? (
            <bootstrap.Alert
                bsStyle="danger"
                style={styles.errorAlert}
            >
                {"Login non riuscito: email o password errate"}
            </bootstrap.Alert>
        ) : null;
    },
    render: function () {
        return (
            <div>
                <div className="ac-login-modal-inputs" style={styles.inputs}>
                    <Radium.Style
                        rules={{
                            ".form-group": {
                                marginBottom: "0px"
                            },
                            ".form-group div, .form-group span, .form-group input": {
                                border: "0px",
                                borderRadius: "0px !important",
                                boxShadow: "none",
                                background: color(colors.darkBlack).alpha(0.1).rgbString(),
                                color: colors.white
                            },
                            ".form-control:focus": {
                                boxShadow: "none"
                            }
                        }}
                        scopeSelector=".ac-login-modal-inputs"
                    />
                    <bootstrap.Input
                        addonBefore={<components.Icon icon="user" />}
                        bsSize="large"
                        placeholder="Email"
                        ref="email"
                        type="email"
                    />
                    <bootstrap.Input
                        addonBefore={<components.Icon icon="lock" />}
                        bsSize="large"
                        placeholder="Password"
                        ref="password"
                        type="password"
                    />
                </div>
                <components.Spacer direction="v" size={16} />
                <components.Button
                    block={true}
                    bsSize="large"
                    onClick={this.login}
                    style={styles.loginButton}
                >
                    {"Accedi"}
                </components.Button>
                {this.renderError()}
            </div>
        );
    }
});

module.exports = Radium(LoginView);
