import color from "color";
import Radium, {Style} from "radium";
import React, {PropTypes} from "react";
import * as bootstrap from "react-bootstrap";

import components from "components";
import icons from "lib/icons";
import string from "lib/string-it";
import {dafaultTheme} from "lib/theme";

const stylesFunction = ({colors}) => ({
    radiumStylePasswordReset: {
        ".form-group": {
            marginBottom: "0px"
        },
        ".form-group div, .form-group span, .form-group input": {
            border: "0px",
            borderRadius: "0px !important",
            boxShadow: "none",
            background: color(colors.black).alpha(0.1).rgbString(),
            color: colors.white
        },
        ".form-control:focus": {
            boxShadow: "none"
        },
        "::-webkit-input-placeholder": {
            color: colors.white
        },
        ":-moz-placeholder": { /* Firefox 18- */
            color: colors.white
        },
        "::-moz-placeholder": {  /* Firefox 19+ */
            color: colors.white
        },
        ":-ms-input-placeholder": {
            color: colors.white
        }
    },
    inputs: {
        borderRadius: "6px",
        overflow: "hidden",
        border: "solid 1px " + color(colors.white).alpha(0.3).rgbString(),
        color: colors.white
    },
    button: {
        background: colors.primary,
        color: colors.white
    },
    errorAlert: {
        marginTop: "16px",
        textAlign: "center"
    }
});

var PasswordResetView = React.createClass({
    propTypes: {
        asteroid: PropTypes.object.isRequired
    },
    contextTypes: {
        theme: PropTypes.object
    },
    getInitialState: function () {
        return {
            emailSent: false,
            error: null
        };
    },
    getTheme: function () {
        return this.context.theme || dafaultTheme;
    },
    setEmailSent: function () {
        this.setState({
            emailSent: true
        });
    },
    setError: function (error) {
        this.setState({
            error: error
        });
    },
    passwordReset: function () {
        var credentials = {
            email: this.refs.email.getValue()
        };
        this.setError(null);
        this.props.asteroid.call("forgotPassword", credentials)
            .then(this.setEmailSent)
            .catch(this.setError);
    },
    renderError: function (styles) {
        return this.state.error ? (
            <bootstrap.Alert
                bsStyle="danger"
                style={styles.errorAlert}
            >
                {"Alla mail non corrisponde alcun untente"}
            </bootstrap.Alert>
        ) : null;
    },
    renderInfoMessage: function () {
        return (
            <h4 className="text-center">
                {"Riceverai un link alla pagina di reset all'indirizzo e-mail indicato"}
            </h4>
        );
    },
    renderResetForm: function (styles) {
        return (
            <div>
                <div className="ac-login-modal-inputs" style={styles.inputs}>
                    <Radium.Style
                        rules={styles.radiumStylePasswordReset}
                        scopeSelector=".ac-login-modal-inputs"
                    />
                    <bootstrap.Input
                        addonBefore={<img src={icons.iconUser} style={{width: "20px"}}/>}
                        bsSize="large"
                        placeholder="Email"
                        ref="email"
                        type="email"
                    />
                </div>
                <components.Spacer direction="v" size={16} />
                <components.Button
                    block={true}
                    bsSize="large"
                    onClick={this.passwordReset}
                    style={styles.button}
                >
                    {string.sendMailResetPswButton}
                </components.Button>
                {this.renderError()}
            </div>
        );
    },
    render: function () {
        const styles = stylesFunction(this.getTheme());
        return (
            this.state.emailSent ?
            this.renderInfoMessage(styles) :
            this.renderResetForm(styles)
        );
    }
});

module.exports = Radium(PasswordResetView);
