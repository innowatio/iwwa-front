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

var LoginPage = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        errorMail: React.PropTypes.any,
        lostPassword: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <div style={styles.overlay}>
                <components.StyleLogin />
                <span className="text-center" style={styles.textTitlePosition}>
                    <h1 style={styles.titleLabel}>{"Energia alla tua Energia"}</h1>
                    <h4 style={styles.h4Label}>{"Innowatio"}</h4>
                </span>
                <div style={styles.inputsContainer}>
                    <bootstrap.Input
                        addonBefore={<components.Icon icon="user" style={styles.groupIcon}/>}
                        className="form-signin-email"
                        placeholder="Email"
                        ref="email"
                        style={styles.inputLabel}
                        type="email"
                        required>
                    </bootstrap.Input>
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
                        onClick={this.props.onChange}
                        style={styles.accessButton}
                    >
                        {"ACCEDI"}
                    </bootstrap.Button>
                    {this.props.errorMail}
                    <components.Spacer direction="v" size={10} />
                    <div className="text-center" style={styles.popupLabel}>
                        <a onClick={this.props.lostPassword} style={styles.aLink}>{"Username o Password dimenticati?"}</a>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = LoginPage;
