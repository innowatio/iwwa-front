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
    inputsContainer: {
        position: "absolute",
        left: "calc(50% - 175px)",
        width: "350px"
    },
    textTitlePosition: {
        width: "350px"
    }
};

var SentPasswordPage = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func.isRequired
    },
    render: function () {
        return (
            <div style={styles.overlay}>
                <components.StyleLogin />
                <span className="text-center" style={styles.textTitlePosition}>
                    <h1 style={styles.titleLabel}>{"Energia alla tua Energia"}</h1>
                    <h4 style={styles.h4PasswordLostLabel}>{"Innowatio"}</h4>
                    <h4 style={styles.h4PasswordLostLabel}>
                        {"Abbiamo mandato una mail all'indirizzo selezionato per il reset della password."}
                    </h4>
                </span>
                <div style={styles.inputsContainer}>
                    <bootstrap.Button
                        block
                        className="access-button"
                        onClick={this.props.onChange}
                        style={styles.accessButton}
                    >
                        {"TORNA ALLA LOGIN"}
                    </bootstrap.Button>
                </div>
            </div>
        );
    }
});

module.exports = SentPasswordPage;
