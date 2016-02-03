var color     = require("color");
var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors_restyling");
var icons      = require("lib/icons_restyling");

var styles = {
    inputs: {
        borderRadius: "15px",
        overflow: "hidden",
        borderWidth: "1px",
        borderColor: color(colors.white).alpha(0.3).rgbString(),
        borderStyle: "solid",
        color: colors.white
    },
    loginButton: {
        background: colors.buttonPrimary,
        color: colors.white,
        height: "68px",
        width: "80%",
        margin: "auto",
        borderRadius: "30px",
        border: "0px none",
        fontSize: "22px"
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
        this.props.asteroid.loginWithPassword(credentials).catch(this.setLoginError);
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
                                marginBottom: "0px",
                                border: "solid 1px " + color(colors.white).alpha(0.3).rgbString()
                            },
                            ".form-group div, .form-group span, .form-group input": {
                                border: "0px",
                                borderRadius: "0px !important",
                                boxShadow: "none",
                                background: color(colors.darkBlack).alpha(0.1).rgbString(),
                                color: colors.white
                            },
                            ".form-control": {
                                height: "60px"
                            },
                            ".form-control:focus": {
                                boxShadow: "none"
                            },
                            "::-webkit-input-placeholder": {
                                color: color(colors.white).alpha(0.7).rgbString()
                            },
                            ":-moz-placeholder": { /* Firefox 18- */
                                color: color(colors.white).alpha(0.7).rgbString()
                            },
                            "::-moz-placeholder": {  /* Firefox 19+ */
                                color: color(colors.white).alpha(0.7).rgbString()
                            },
                            ":-ms-input-placeholder": {
                                color: color(colors.white).alpha(0.7).rgbString()
                            }
                        }}
                        scopeSelector=".ac-login-modal-inputs"
                    />
                    <bootstrap.Input
                        addonBefore={<img src={icons.iconUser} style={{height: "40px"}}/>}
                        bsSize="large"
                        placeholder="Email"
                        ref="email"
                        type="email"
                    />
                    <bootstrap.Input
                        addonBefore={<img src={icons.iconLock} style={{height: "40px"}}/>}
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
                    {"ACCEDI"}
                </components.Button>
                {this.renderError()}
            </div>
        );
    }
});

module.exports = Radium(LoginView);
