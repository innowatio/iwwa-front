import color from "color";
import Radium, {Style} from "radium";
import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";

import components from "components";
import icons from "lib/icons";
import string from "lib/string-it";
import {defaultTheme} from "lib/theme";

const stylesFunction = ({colors}) => ({
    radiumStyleInput: {
        ".form-group": {
            marginBottom: "0px",
            border: "solid 1px " + color(colors.white).alpha(0.3).rgbString()
        },
        ".form-group div, .form-group span, .form-group input": {
            border: "0px",
            borderRadius: "0px !important",
            boxShadow: "none",
            background: color(colors.black).alpha(0.1).rgbString(),
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
    },
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
});

var LoginView = React.createClass({
    propTypes: {
        asteroid: PropTypes.object.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            loginError: null
        };
    },
    getTheme: function () {
        return this.context.theme || defaultTheme;
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
    renderError: function (styles) {
        return this.state.loginError ? (
            <bootstrap.Alert
                bsStyle="danger"
                style={styles.errorAlert}
            >
                {string.loginErrorAlert}
            </bootstrap.Alert>
        ) : null;
    },
    render: function () {
        const styles = stylesFunction(this.getTheme());
        return (
            <div>
                <div className="ac-login-modal-inputs" style={styles.inputs}>
                    <Style
                        rules={styles.radiumStyleInput}
                        scopeSelector=".ac-login-modal-inputs"
                    />
                    <bootstrap.Input
                        addonBefore={<img src={icons.iconUser} style={{height: "40px"}}/>}
                        bsSize="large"
                        placeholder={string.email}
                        ref="email"
                        type="email"
                    />
                    <bootstrap.Input
                        addonBefore={<img src={icons.iconLock} style={{height: "40px"}}/>}
                        bsSize="large"
                        placeholder={string.password}
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
                    {string.accessButton}
                </components.Button>
                {this.renderError(styles)}
            </div>
        );
    }
});

module.exports = Radium(LoginView);
