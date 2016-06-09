import color from "color";
import Radium, {Style} from "radium";
import React, {PropTypes} from "react";
import ReactDOM from "react-dom";
import * as bootstrap from "react-bootstrap";

import components from "components";
import string from "lib/string-it";
import {dafaultTheme} from "lib/theme";

const stylesFunction = ({colors}) => ({
    radiumStylePasswordReset: {
        ".form-group": {
            marginBottom: "0px"
        },
        ".form-group div, .form-group span, .form-group input": {
            borderTop: "0px",
            borderBottom: "0px",
            borderRight: "0px",
            borderLeft: "0px",
            height: "88px",
            fontSize: "26px",
            borderTopLeftRadius: "20px !important",
            boxShadow: "none",
            background: color(colors.black).alpha(0).rgbString(),
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
        height: "88px",
        fontSize: "26px",
        borderRadius: "20px",
        fontWeight: "300",
        overflow: "hidden",
        borderTop: "1px",
        borderBottom: "1px",
        borderRight: "1px",
        borderLeft: "1px",
        borderColor: color(colors.white).alpha(0.3).rgbString(),
        borderStyle: "solid",
        color: colors.white,
        backgroundColor: color(colors.black).alpha(0.15).rgbString()
    },
    button: {
        background: colors.buttonPrimary,
        color: colors.white,
        height: "78px",
        width: "70%",
        margin: "auto",
        borderRadius: "30px",
        border: "0px none",
        fontSize: "30px"
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
            email: ReactDOM.findDOMNode(this.refs.email).value
        };
        this.setError(null);
        this.props.asteroid.call("forgotPassword", credentials)
            .then(this.setEmailSent)
            .catch(this.setError);
    },
    renderError: function () {
        return this.state.error ? (
            <bootstrap.Alert
                bsStyle="danger"
                style={stylesFunction(this.getTheme()).errorAlert}
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
                    <bootstrap.FormGroup style={{display: "table"}}>
                        <bootstrap.InputGroup.Addon>
                            <components.Icon
                                color={this.getTheme().colors.iconLogin}
                                icon={"user"}
                                size={"45px"}
                                style={{lineHeight: "20px", verticalAlign: "middle"}}
                            />
                        </bootstrap.InputGroup.Addon>
                        <bootstrap.FormControl
                            bsSize="large"
                            placeholder="Email"
                            ref="email"
                            type="email"
                        />
                    </bootstrap.FormGroup>
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
