import color from "color";
import Radium, {Style} from "radium";
import React, {PropTypes} from "react";
import ReactDOM from "react-dom";
import * as bootstrap from "react-bootstrap";

import components from "components";
import string from "lib/string-it";
import {defaultTheme} from "lib/theme";


const stylesFunction = ({colors}) => ({
    radiumStyleInput: {
        ".form-group": {
            marginBottom: "0px",
            fontWeight: "400"
        },
        ".form-group div, .form-group span, .form-group input": {
            border: "0px !important",
            boxShadow: "none",
            borderRadius: "0px",
            background: color(colors.black).alpha(0).rgbString(),
            color: colors.white,
            fontWeight: "400"
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
        },
        "input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill": { /* Chrome */
            boxShadow: "0 0 0px 1000px white inset"
        },
        ".input-usr": {
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            backgroundColor: color(colors.black).alpha(0.15).rgbString(),
            border: "1px solid",
            borderColor: color(colors.white).alpha(0.4).rgbString()
        },
        ".input-psw": {
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            backgroundColor: color(colors.black).alpha(0.15).rgbString(),
            border: "1px solid",
            borderColor: color(colors.white).alpha(0.4).rgbString(),
            borderTop: "0px"
        }
    },
    inputsWrapper: {
        height: "180px",
        borderRadius: "20px",
        margin: "0 0 10px 0",
        overflow: "hidden",
        color: colors.white
    },
    inputs: {
        height: "88px",
        fontSize: "26px",
        backgroundColor: "trasparent",
        borderRadius: "0px",
        border: "0px",
        fontWeight: "300"
    },
    loginButton: {
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
            email: ReactDOM.findDOMNode(this.refs.email).value,
            password: ReactDOM.findDOMNode(this.refs.password).value
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
                <div className="ac-login-modal-inputs" style={styles.inputsWrapper}>
                    <Style
                        rules={styles.radiumStyleInput}
                        scopeSelector=".ac-login-modal-inputs"
                    />
                    <div className="input-usr">
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
                                placeholder={string.email}
                                ref="email"
                                style={styles.inputs}
                                type="email"
                            />
                        </bootstrap.FormGroup>
                    </div>
                    <div className="input-psw">
                        <bootstrap.FormGroup style={{display: "table"}}>
                            <bootstrap.InputGroup.Addon>
                                <components.Icon
                                    color={this.getTheme().colors.iconLogin}
                                    icon={"lock"}
                                    size={"45px"}
                                    style={{lineHeight: "20px", verticalAlign: "middle"}}
                                />
                            </bootstrap.InputGroup.Addon>
                            <bootstrap.FormControl
                                bsSize="large"
                                placeholder={string.password}
                                ref="password"
                                style={styles.inputs}
                                type="password"
                            />
                        </bootstrap.FormGroup>
                    </div>
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
