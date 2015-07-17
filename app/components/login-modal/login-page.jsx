var Radium    = require("radium");
var React     = require("react");
var bootstrap = require("react-bootstrap");

var components = require("components");
var colors     = require("lib/colors");
var loginStyle = require("components/login-modal/login-style.js");

var LoginPage = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        errorMail: React.PropTypes.any,
        lostPassword: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <div style={loginStyle.overlay}>
                <components.StyleLogin />
                <span className="text-center" style={loginStyle.textTitlePosition}>
                    <h1 style={loginStyle.titleLabel}>{"Energia alla tua Energia"}</h1>
                    <h4 style={loginStyle.h4Label}>{"Innowatio"}</h4>
                </span>
                <div style={loginStyle.inputsContainer}>
                    <bootstrap.Input
                        addonBefore={<components.Icon icon="user" style={loginStyle.groupIcon}/>}
                        className="form-signin-email"
                        placeholder="Email"
                        ref="email"
                        style={loginStyle.inputLabel}
                        type="email"
                        required>
                    </bootstrap.Input>
                    <div className="input-password">
                        <bootstrap.Input
                            addonBefore={
                                <span className="iconPsw">
                                    <components.Icon className="iconPsw" icon="lock" style={loginStyle.groupIcon}/>
                                </span>
                                }
                            className="form-signin-psw"
                            placeholder="Password"
                            ref="password"
                            style={loginStyle.inputLabel}
                            type="password"
                        />
                    </div>
                    <bootstrap.Button
                        block
                        className="access-button"
                        onClick={this.props.onChange}
                        style={loginStyle.accessButton}
                    >
                        {"ACCEDI"}
                    </bootstrap.Button>
                    {this.props.errorMail}
                    <components.Spacer direction="v" size={10} />
                    <div className="text-center" style={loginStyle.popupLabel}>
                        <a onClick={this.props.lostPassword} style={loginStyle.aLink}>{"Username o Password dimenticati?"}</a>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = LoginPage;
