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

var RequestPasswordPage = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired,
        errorMail: React.PropTypes.any
    },
    render: function () {
        return (
            <div style={styles.overlay}>
                <components.StyleLogin />
                <span className="text-center" style={styles.textTitlePosition}>
                    <h1 style={styles.titleLabel}>{"Energia alla tua Energia"}</h1>
                    <h4 style={styles.h4PasswordLostLabel}>{"Innowatio"}</h4>
                    <h4 style={styles.h4PasswordLostLabel}>{"Username o Password dimenticati?"}</h4>
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
                    {console.log(this.props.ref)}
                    <bootstrap.Button
                        block
                        className="access-button"
                        onClick={this.props.onChange}
                        style={styles.accessButton}
                    >
                        {"INVIA"}
                    </bootstrap.Button>
                    {this.props.errorMail}
                    <span className="text-center" style={styles.textTitlePosition}>
                        <h6 style={styles.h4PasswordLostLabel}>{"Riceverai le nuove credenziali all'indirizzo e-mail indicato"}</h6>
                    </span>
                </div>
            </div>
        )
    }
});

module.exports = RequestPasswordPage;
